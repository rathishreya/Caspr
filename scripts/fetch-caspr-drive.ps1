<#
.SYNOPSIS
    Mirror the shared Google Drive folder "caspr-claude-core" into this repository.

.DESCRIPTION
    Does the whole job in one run:
      1. Finds rclone, or downloads a portable copy next to this script (no admin, no installer).
      2. Configures a Google Drive remote if one is not already set up (opens a browser once).
      3. Copies the shared folder — binaries included — to a staging directory.
      4. Mirrors staging into the repository working tree.
      5. Commits and pushes.

    The folder lives under "Shared with me", not "My Drive", so every rclone call
    passes --drive-shared-with-me. Without that flag the path does not resolve and
    rclone reports "directory not found".

.PARAMETER RepoPath
    The local clone to copy into. Defaults to the repository this script sits in.

.PARAMETER Branch
    Branch to commit and push to.

.PARAMETER IncludeSecrets
    Copy credential-bearing files too. Off by default — see the SECURITY note below.

.PARAMETER SkipGit
    Fetch to staging and mirror into the tree, but do not commit or push.

.PARAMETER Remote
    Name of the rclone remote to use or create.

.PARAMETER DriveFolder
    Folder name to look for at the root of "Shared with me".

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\scripts\fetch-caspr-drive.ps1

.EXAMPLE
    # Fetch only; inspect the result before committing anything
    .\scripts\fetch-caspr-drive.ps1 -SkipGit

.NOTES
    SECURITY — read before using -IncludeSecrets.
    By default this skips files that carry live credentials: Ahrefs_Key.txt,
    docs/app-handoff/CASPR-KEYS-REQUEST.txt, .env, *.pem, *.key and similar.
    They are skipped because this repository is on GitHub, and a credential
    committed to git history stays recoverable even after the file is deleted —
    rotating the key becomes the only real remedy. CLAUDE.md rule 7 names
    Ahrefs_Key.txt as the specific reason that rule was extended to cover Drive.
    Pass -IncludeSecrets only if you have decided that is acceptable.
#>

[CmdletBinding()]
param(
    [string] $RepoPath = (Split-Path -Parent $PSScriptRoot),
    [string] $Branch   = 'claude/google-drive-to-repo-rpda75',
    [string] $Remote      = 'gdrive',
    [string] $DriveFolder = 'caspr-claude-core',
    [switch] $IncludeSecrets,
    [switch] $SkipGit
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# LOCALAPPDATA is the right home on Windows but is not defined elsewhere, which
# would make Join-Path throw on a null path.
$StagingRoot = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA }
               else { [System.IO.Path]::GetTempPath() }
$Staging     = Join-Path $StagingRoot 'caspr-drive-staging'
$ToolsDir    = Join-Path $PSScriptRoot '.tools'

# Sum file sizes under a path, ignoring git metadata. Returns MB, 0 when empty —
# Measure-Object yields a null Sum for an empty set, which would otherwise throw
# under StrictMode.
function Get-TreeSizeMb {
    param([string] $Path)
    $sum = Get-ChildItem -LiteralPath $Path -Recurse -File -Force -ErrorAction SilentlyContinue |
           Where-Object { $_.FullName -notmatch '\\\.git\\' } |
           Measure-Object -Property Length -Sum |
           Select-Object -ExpandProperty Sum
    if (-not $sum) { return 0 }
    return [math]::Round($sum / 1MB, 1)
}

function Write-Step { param([string] $Message) Write-Host "`n==> $Message" -ForegroundColor Cyan }
function Write-Note { param([string] $Message) Write-Host "    $Message" -ForegroundColor DarkGray }
function Write-Warn { param([string] $Message) Write-Host "    ! $Message" -ForegroundColor Yellow }

# ---------------------------------------------------------------- 1. rclone --

function Resolve-Rclone {
    $onPath = Get-Command rclone -ErrorAction SilentlyContinue
    if ($onPath) {
        Write-Note "using rclone already on PATH: $($onPath.Source)"
        return $onPath.Source
    }

    $portable = Join-Path $ToolsDir 'rclone.exe'
    if (Test-Path $portable) {
        Write-Note "using portable rclone: $portable"
        return $portable
    }

    Write-Step 'rclone not found — downloading a portable copy'
    Write-Note 'Nothing is installed system-wide and no admin rights are needed.'

    New-Item -ItemType Directory -Force -Path $ToolsDir | Out-Null
    $zip     = Join-Path $ToolsDir 'rclone.zip'
    $extract = Join-Path $ToolsDir 'unzipped'
    $url     = 'https://downloads.rclone.org/rclone-current-windows-amd64.zip'

    # Progress rendering makes Invoke-WebRequest an order of magnitude slower.
    $priorProgress = $ProgressPreference
    $ProgressPreference = 'SilentlyContinue'
    try {
        Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
    } finally {
        $ProgressPreference = $priorProgress
    }

    if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
    Expand-Archive -Path $zip -DestinationPath $extract -Force

    $found = Get-ChildItem -Path $extract -Filter 'rclone.exe' -Recurse |
             Select-Object -First 1
    if (-not $found) { throw "rclone.exe not found inside $url" }

    Move-Item -Path $found.FullName -Destination $portable -Force
    Remove-Item $zip, $extract -Recurse -Force -ErrorAction SilentlyContinue

    Write-Note "installed: $portable"
    return $portable
}

# ------------------------------------------------------- 2. Drive remote -----

function Confirm-Remote {
    param([string] $Rclone, [string] $Name)

    $existing = & $Rclone listremotes 2>$null
    if ($LASTEXITCODE -eq 0 -and $existing -contains "${Name}:") {
        Write-Note "rclone remote '$Name' already configured"
        return
    }

    Write-Step "Configuring the '$Name' remote"
    Write-Note 'A browser window will open. Sign in as the account the folder is'
    Write-Note 'shared with (shreyanshi.rathi@ez.works) and approve read access.'
    Write-Note 'Read-only scope — this cannot modify anything in Drive.'

    & $Rclone config create $Name drive scope drive.readonly
    if ($LASTEXITCODE -ne 0) {
        throw "rclone config failed. Run '$Rclone config' by hand to set up a Google Drive remote named '$Name'."
    }
}

# --------------------------------------------------------------- 3. fetch ----

# Credential-shaped paths. Skipped unless -IncludeSecrets; see the NOTES block.
$SecretFilters = @(
    'Ahrefs_Key.txt'
    'CASPR-KEYS-REQUEST.txt'
    '.env'
    '*.pem'
    '*.key'
    '*_rsa'
    'id_ed25519'
    '*service-account*.json'
    'kubeconfig'
    '*.tfstate'
)

function Invoke-DriveCopy {
    param([string] $Rclone, [string] $Name, [string] $Destination)

    $rcloneArgs = @(
        'copy'
        "${Name}:$DriveFolder"
        $Destination
        '--drive-shared-with-me'   # the folder is shared, not owned — required
        '--drive-acknowledge-abuse'
        '--progress'
        '--transfers'; '8'
        '--checkers'; '16'
        '--drive-export-formats'; 'docx,xlsx,pptx,svg'  # Google-native docs
        '--exclude'; '.git/**'
    )

    if (-not $IncludeSecrets) {
        foreach ($pattern in $SecretFilters) {
            $rcloneArgs += @('--exclude', $pattern)
            $rcloneArgs += @('--exclude', "**/$pattern")
        }
    }

    Write-Step "Copying '$DriveFolder' from Drive"
    if ($IncludeSecrets) {
        Write-Warn 'Including credential files (-IncludeSecrets). These will reach git history.'
    } else {
        Write-Note "Skipping $($SecretFilters.Count) credential patterns. Use -IncludeSecrets to override."
    }
    Write-Note 'First run downloads ~40-60 MB and takes a couple of minutes.'

    & $Rclone @rcloneArgs
    if ($LASTEXITCODE -ne 0) {
        $code = $LASTEXITCODE
        $hint = @"
rclone copy failed (exit $code).

If the error is 'directory not found', the folder is not visible at the root of
'Shared with me'. Check the exact name with:

    $Rclone lsd ${Name}: --drive-shared-with-me

then re-run this script with -DriveFolder set to the name it prints. If nothing
is listed at all, open Drive in a browser, right-click the folder and choose
Organise -> Add shortcut to Drive, then re-run.
"@
        throw $hint
    }
}

# -------------------------------------------------------------- 4. mirror ----

function Copy-IntoRepo {
    param([string] $Source, [string] $Target)

    Write-Step "Mirroring into $Target"

    # Adds and overwrites but never deletes, so anything already committed
    # survives even if Drive no longer has it. .git is skipped so the repository
    # metadata is never touched.
    $sourceRoot = (Resolve-Path -LiteralPath $Source).Path.TrimEnd('\', '/')
    $copied = 0

    # A foreach statement, not ForEach-Object: the pipeline cmdlet runs its block
    # in a child scope, so the counter would not survive the loop.
    foreach ($file in @(Get-ChildItem -LiteralPath $Source -Recurse -File -Force)) {
        $relative = $file.FullName.Substring($sourceRoot.Length).TrimStart('\', '/')
        if ($relative -match '(^|[\\/])\.git([\\/]|$)') { continue }

        $destination = Join-Path $Target $relative
        $parent = Split-Path -Parent $destination
        if ($parent -and -not (Test-Path -LiteralPath $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }

        Copy-Item -LiteralPath $file.FullName -Destination $destination -Force
        $copied++
    }

    Write-Note "$copied file(s) written"
}

# ----------------------------------------------------------------- 5. git ----

function Publish-Changes {
    param([string] $Target, [string] $BranchName)

    Push-Location $Target
    try {
        $current = (git rev-parse --abbrev-ref HEAD).Trim()
        if ($current -ne $BranchName) {
            Write-Step "Switching to $BranchName"
            # Ask first rather than letting a failed checkout print 'error:
            # pathspec ... did not match', which reads like a real failure.
            git rev-parse --verify --quiet "refs/heads/$BranchName" | Out-Null
            if ($LASTEXITCODE -eq 0) { git checkout $BranchName }
            else { git checkout -b $BranchName }
            if ($LASTEXITCODE -ne 0) { throw "could not switch to $BranchName" }
        }

        if (-not (git status --porcelain)) {
            Write-Step 'Nothing changed — repository already matches Drive'
            return
        }

        git add -A
        if ($LASTEXITCODE -ne 0) { throw 'git add failed' }

        $added = (git diff --cached --numstat | Measure-Object).Count
        $mb    = Get-TreeSizeMb -Path $Target

        Write-Step "Committing $added changed file(s) — working tree is $mb MB"
        if ($mb -gt 90) {
            Write-Warn "That is large for a git repository. GitHub rejects any single file over 100 MB."
        }

        # A here-string is only recognised in expression mode, so it has to be
        # bound to a variable — passing @" directly as a command argument is a
        # parse error.
        $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
        $message = @"
Mirror caspr-claude-core from Google Drive via rclone

Full-fidelity copy of the shared Drive folder, binaries included. Fetched with
rclone rather than file-by-file through the Drive API, so this supersedes the
partial copy recorded in MANIFEST.md.

Fetched $stamp by scripts/fetch-caspr-drive.ps1.
"@

        git commit -q -m $message
        if ($LASTEXITCODE -ne 0) { throw 'git commit failed' }

        Write-Step "Pushing to origin/$BranchName"
        git push -u origin $BranchName
        if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
    } finally {
        Pop-Location
    }
}

# ----------------------------------------------------------------- main ------

Write-Host ''
Write-Host '  Caspr Drive -> repository mirror' -ForegroundColor White
Write-Host '  --------------------------------' -ForegroundColor DarkGray
Write-Note "repo:    $RepoPath"
Write-Note "branch:  $Branch"
Write-Note "staging: $Staging"

if (-not (Test-Path (Join-Path $RepoPath '.git'))) {
    throw "$RepoPath is not a git repository. Pass -RepoPath pointing at your clone of rathishreya/Caspr."
}

$rclone = Resolve-Rclone
Confirm-Remote -Rclone $rclone -Name $Remote

New-Item -ItemType Directory -Force -Path $Staging | Out-Null
Invoke-DriveCopy -Rclone $rclone -Name $Remote -Destination $Staging

$fileCount = (Get-ChildItem $Staging -Recurse -File -Force | Measure-Object).Count
$sizeMb    = Get-TreeSizeMb -Path $Staging
Write-Step "Fetched $fileCount files ($sizeMb MB) to staging"

if ($fileCount -eq 0) {
    throw "Staging is empty — nothing was copied. Run '$rclone lsd ${Remote}: --drive-shared-with-me' to see what the account can actually see."
}

Copy-IntoRepo -Source $Staging -Target $RepoPath

if ($SkipGit) {
    Write-Step 'Done — files are in the working tree, nothing committed (-SkipGit)'
    Write-Note 'Review with: git status'
} else {
    Publish-Changes -Target $RepoPath -BranchName $Branch
    Write-Step 'Done'
}
