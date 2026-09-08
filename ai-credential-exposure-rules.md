# AI Credential Exposure Standard

**Scope:** Every credential, secret, and key handled by a Caspr application or developer, and every AI model or AI agent that could come into contact with one — hosted LLM APIs, coding agents (Claude Code, Copilot, Cursor), MCP servers, CI agents, and self-hosted models.
**Audience:** All engineers, plus anyone configuring an AI tool against a Caspr repository or environment.
**Rules:** 58 across 8 sections · 41 marked `[P0]` — release blockers.
**Status:** Binding. Deviations require a written note in the PR description and sign-off from the security owner.
**Security owner:** Jayant (joy@caspr.ai), interim — see Appendix E, item 1.
**Companion:** `docs/python-backend-rules.md` (`R-CFG-*`, `R-SEC-4` cover secrets at rest in code; this document covers secrets in front of a model).
**Last updated:** 2026-08-25

---

## How to read this document

Every rule has an ID (`R-CLS-3`), a one-line **Rule**, a **Why** where the reasoning is not obvious, and a **Verification** note where a tool can enforce it. Cite rule IDs in review (`R-CTX-2 — this .env is inside the agent's read scope`). Rules marked **[P0]** are release blockers.

Three terms are used precisely throughout:

- **Disclosure surface** — any path by which a value reaches a model's context window or a model provider's servers. See `R-AI-2` for the full enumeration. "We didn't put it in the prompt" is not a defence.
- **Credential** — any value whose possession grants access, authenticity, or decryption. Passwords, API keys, tokens, private keys, signed cookies, connection strings containing any of these.
- **Broker** — a component that holds the real credential and injects it at the network boundary, so the agent transacts with the protected system without the value ever entering its context. See section 4.

---

## 0. Prime directives

### R-AI-1 [P0] — Default is deny; disclosure is the exception that must be justified

**Rule:** No credential value is shared with any AI model unless a rule in this document explicitly permits it. Absence of a prohibition is not permission.

**Why:** The classification tiers in section 1 are exhaustive by construction. A value that does not obviously fit a tier is Tier 1 until the security owner classifies it — never Tier 3 by default.

### R-AI-2 [P0] — "Shared with a model" means more than "typed into a prompt"

**Rule:** A credential is disclosed to a model the moment it enters **any** of these surfaces:

| Surface | Typical example |
|---|---|
| Prompt text | Pasting a `.env` into chat, quoting an error containing a DSN |
| File read into context | Agent opens `.env`, `settings.local.json`, `~/.aws/credentials`, `kubeconfig` |
| Tool / command output | Agent runs `printenv`, `docker inspect`, `terraform output`, `gcloud auth print-access-token` |
| Process environment | Agent-spawned process inherits `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`; also readable via `/proc/self/environ` and `ps auxeww` |
| Agent instruction / rules files | `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, MCP `mcp.json` |
| Agent memory and transcripts | Session logs cached on disk, long-term memory stores, RAG indexes |
| Telemetry and feedback uploads | `/feedback` shares, crash reports, prompt-logging gateways |
| Retrieved external content | A PR comment, issue body, or web page the agent reads — the injection channel |

**Why:** The two most expensive documented failures in this space were not prompt pastes. Copilot completions were found to contain thousands of valid third-party secrets drawn from *training data*, not from the user's context ([GitGuardian](https://blog.gitguardian.com/yes-github-copilot-can-leak-secrets/)). And the 2026 "Comment and Control" research exfiltrated `ANTHROPIC_API_KEY`, a write-scoped `GITHUB_TOKEN`, `GEMINI_API_KEY` and more from CI runners across Claude Code, Gemini CLI and Copilot Agent — via instructions hidden in HTML comments in a pull request, with the secrets leaving through the already-allowlisted `github.com` egress ([writeup](https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/)). Note the specific bypass: Copilot filtered subprocess environment variables, but `ps auxeww` still exposed the unfiltered *parent* process environment.

### R-AI-3 [P0] — The model never needs the secret; it needs the capability

**Rule:** Before disclosing anything, separate two questions: *does the model need to know this value?* and *does the agent need to act on the system this value protects?* The answer to the first is almost always no. Satisfy the second with a broker (section 4), never by disclosure.

**Why:** This is the single distinction that resolves most arguments. "The agent has to query the database" does not imply "the agent must see the database password." It implies the agent needs a query channel — which a broker or an injected short-lived credential provides without disclosure. Cloud Security Alliance guidance is explicit that agents should never hold static API keys or reach a credential store directly ([CSA](https://cloudsecurityalliance.org/artifacts/agentic-ai-identity-and-access-management-a-new-approach)).

### R-AI-4 [P0] — Prompt-layer instructions are not a control

**Rule:** Never rely on system prompts, agent rules files, or "do not reveal secrets" instructions as a security boundary. Enforcement is structural: what the process can read, what the network can reach, what the credential is scoped to, how long it lives.

**Why:** OWASP LLM01 states plainly that there is no fool-proof prevention for prompt injection given the stochastic nature of LLMs ([OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)). An instruction the model can be argued out of is not a control. Worse, the instruction channel is itself attackable: the "Rules File Backdoor" hid invisible Unicode directives inside shared `.cursor/rules` and Copilot instruction files — unreadable to a human reviewer, obeyed by the agent ([Pillar Security](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents)).

### R-AI-5 — Self-hosted or local models change the retention risk, not the classification

**Rule:** Running a model locally or on Caspr infrastructure removes the third-party retention question only. It does not change any tier in section 1.

**Why:** Prompt injection, log persistence, memory poisoning, and over-scoped agent identity are all properties of the agent loop, not of who hosts the weights. A local model in an agent with a shell still reads `~/.aws/credentials`.

---

## 1. Classification

### R-CLS-1 [P0] — Every credential carries one of four tiers

| Tier | Name | Rule in one line |
|---|---|---|
| **0** | Never disclosed, in any form | The value, and any partial or transformed form of it, never enters a disclosure surface. Not truncated, not hashed, not "the first four characters". |
| **1** | Value never disclosed; capability brokered | The real value never enters a disclosure surface. If an agent must act on the protected system, it does so through a broker or a short-lived scoped credential (section 4). |
| **2** | Structure disclosed; value never | Names, shapes, formats, scopes, and policy may be shared freely. The value may not. |
| **3** | Freely shareable | Contains no secret. Share without ceremony. |

### R-CLS-2 [P0] — Tier assignment table

This table is the authority. Anything not listed is Tier 1 until the security owner classifies it (`R-AI-1`).

| Credential class | Example | Tier |
|---|---|---|
| TLS / mTLS private key | `server.key`, client cert key | **0** |
| Token signing key | JWT `HS256` secret, `RS256` private key | **0** |
| Encryption master key / KEK / DEK | KMS-wrapped key material, field-encryption key | **0** |
| Code-signing / release-signing key | GPG key, Apple/Play signing key | **0** |
| SSH private key | `~/.ssh/id_ed25519` | **0** |
| Root / break-glass credential | Cloud root account, DB superuser, emergency admin | **0** |
| Raw cardholder data | PAN, CVV, full track data | **0** |
| Database DSN containing a password | `postgresql+asyncpg://user:pw@host/db` | **1** |
| Cloud IAM static key pair | AWS access key ID + secret | **1** |
| Cloud service account key file | GCP service-account JSON, Azure SP secret | **1** |
| Third-party API key (any environment) | Stripe, SendGrid, OpenAI, Anthropic keys | **1** |
| OAuth client secret | GitHub / Google OAuth app secret | **1** |
| Webhook signing secret | Stripe `whsec_…`, GitHub webhook secret | **1** |
| Live session token / cookie / bearer | User session JWT, `GITHUB_TOKEN`, PAT | **1** |
| CI/CD secret of any kind | Repository or org secret, deploy key | **1** |
| Message broker / cache credential | Redis password, Celery broker URL with auth | **1** |
| Reversible PII token | Tokenized identifier that maps back to PII | **1** |
| Environment variable **names** | `DATABASE__DSN`, `STRIPE__API_KEY` | **2** |
| Credential **format** or prefix | `sk-…`, `whsec_…`, 32-byte hex | **2** |
| Scopes, permissions, IAM policy JSON | `repo:read`, a role's policy document | **2** |
| IAM role ARN / workload identity binding | `arn:aws:iam::…:role/caspr-api` | **2** |
| Vault path / secret reference | `secret/data/caspr/api#dsn` | **2** |
| Rotation policy and lifetime | "15-minute lease, rotated hourly" | **2** |
| Non-secret connection metadata | Port, database name, region, driver | **2** |
| Production hostnames and usernames | `db-prod-01.internal`, `caspr_api_rw` | **2**, redact externally (`R-SHR-5`) |
| Obviously-fake placeholder | `sk-test-REPLACE_ME` | **3** |
| Public key material | TLS public cert, JWKS, SSH `.pub` | **3** |
| Public identifiers | OAuth `client_id`, publishable/`pk_` key | **3** |

### R-CLS-3 [P0] — Non-production credentials are classified by blast radius, not by name

**Rule:** A staging or development credential is Tier 1 if it reaches real infrastructure, real customer data, a real third-party account, or a billable API. It is Tier 3 only if it is a fabricated string in a throwaway local environment with no network reachability.

**Why:** "It's only the dev key" is how live third-party API keys leak. A dev Stripe key is still a real credential on a real Stripe account. The question is what an attacker gets, not which folder it lives in.

### R-CLS-4 [P0] — Partial disclosure of a Tier 0 or Tier 1 value is full disclosure

**Rule:** Do not share truncated values, first/last characters, hashes, base64 forms, encrypted-at-rest forms, or "just the part before the `@`". Treat any of these as the whole secret.

**Why:** Prefix disclosure collapses brute-force space and confirms format; the host/user half of a DSN is a working recon result on its own. Encoding is not protection — the Comment and Control attack base64-encoded exfiltrated secrets specifically to slip past secret-scanning regexes.

### R-CLS-5 — The four-question decision procedure

When a value is not in the `R-CLS-2` table, work down this list and stop at the first "yes":

1. Does possession allow forging identity, signing, or decrypting at scale? → **Tier 0**
2. Does possession grant access to a real system, real data, or a billable account? → **Tier 1**
3. Does it describe a credential without being one? → **Tier 2**
4. Would you paste it in a public GitHub issue without a second thought? → **Tier 3**

If you hesitate at step 4, the answer is Tier 2, not Tier 3.

### R-CLS-6 — Record the tier next to the secret's definition

**Rule:** Each secret in `core/settings.py` carries its tier in a comment or field description. Vault/secret-manager entries carry it as a tag.

**Why:** Classification that lives only in this document gets re-litigated at every incident. Classification next to the definition is read by whoever is about to expose it.

---

## 2. What may be shared, and how

### R-SHR-1 [P0] — Share the shape, never the value

**Rule:** For any task involving a Tier 0, 1, or 2 credential, give the model the variable name, the format, the scopes, and the vault reference. Never the value.

This is sufficient for essentially every real task — writing config code, debugging a parse failure, reviewing an IAM policy, wiring a client:

```python
# Correct — the model has everything it needs
class StripeSettings(BaseModel):
    api_key: SecretStr        # Tier 1 · format "sk_live_<24+ alnum>" · vault: secret/data/caspr/stripe#api_key
    webhook_secret: SecretStr # Tier 1 · format "whsec_<32 alnum>"
    publishable_key: str      # Tier 3 · public, safe to log
```

### R-SHR-2 [P0] — Placeholders must be unmistakably fake

**Rule:** Every synthetic credential in Caspr code, documentation, fixtures, or prompts uses the single house pattern:

```
CASPR_DUMMY_<TYPE>_<DESCRIPTOR>
```

```python
api_key     = "CASPR_DUMMY_KEY_stripe_test"
db_password = "CASPR_DUMMY_SECRET_postgres"
webhook     = "CASPR_DUMMY_SECRET_stripe_webhook"
private_key = "CASPR_DUMMY_PEM_jwt_signing"
```

`<TYPE>` is one of `KEY`, `SECRET`, `TOKEN`, `PEM`, `DSN`. Never generate a realistic-looking fake credential — no plausible random hex, no correctly-checksummed key, no real-looking prefix such as `sk_live_`.

**Why:** Realistic fakes fail twice. They burn triage time when push protection and secret scanners flag them, and — the worse failure — a future engineer copies one into a real deployment believing it is real. One fixed, greppable pattern also fixes the allowlist problem: without it, every new fake value earns its own `gitleaks` allowlist entry, the allowlist accumulates dozens of literal strings, and eventually someone allowlists a *real* value because it looked like the others. Scanner-vendor guidance is consistent that obviously-synthetic placeholders reduce false-positive load ([Aikido](https://www.aikido.dev/blog/secrets-detection-what-to-look-for-when-choosing-a-tool)).

**Verification:** One `gitleaks` allowlist rule for the whole convention — never per-value entries:

```toml
[allowlist]
regexes = ['''CASPR_DUMMY_(KEY|SECRET|TOKEN|PEM|DSN)_[A-Za-z0-9_]+''']
```

A CI check additionally fails any placeholder-looking literal in a Caspr repository that does *not* match this pattern, so the convention cannot quietly erode.

### R-SHR-3 [P0] — Never ask a model to generate a production secret

**Rule:** Key material is generated by `secrets.token_urlsafe`, `openssl`, the cloud KMS, or the secret manager. Never by a model, and never by a model-written script executed on a developer laptop.

**Why:** Model output is not a cryptographic random source, may be influenced by context, and — critically — the generated value has now been through a disclosure surface by definition. A secret a model produced is a secret a model has seen.

### R-SHR-4 [P0] — Redact before you paste an error, log, or traceback

**Rule:** Stack traces, `docker inspect` output, Terraform plans, and connection errors routinely embed DSNs, tokens, and headers. Redact before pasting into any AI tool.

**Why:** This is the highest-frequency accidental disclosure in normal engineering work — the value is not in a file the developer is thinking about, it is in the middle of the thing they are debugging.

### R-SHR-5 — Redact production topology in externally-hosted contexts

**Rule:** Internal hostnames, database usernames, internal service names, and account IDs are Tier 2 — shareable with an agent operating on the repository, redacted when the content leaves for a third-party surface (a shared transcript, a support ticket, a feedback upload).

### R-SHR-6 — Public key material and public identifiers are genuinely free

**Rule:** Share TLS public certificates, JWKS documents, SSH public keys, OAuth `client_id`s, and publishable keys without ceremony. Blanket "no keys near AI" policies that also block these produce workarounds, which is worse.

### R-SHR-7 [P0] — Never paste customer data to obtain a credential-shaped answer

**Rule:** Do not paste production rows, real session tokens, or real user records to debug an auth or token problem. Reproduce with synthetic data.

### R-SHR-8 — Source code containing credentials is a Tier 1 disclosure, not a Tier 3 one

**Rule:** Before sharing a file with any AI tool, check whether it contains a hardcoded secret. If it does, the fix is to remove the hardcoding (`R-CFG-1`, `R-CFG-2`), not to share it and note the concern.

**Why:** Samsung's 2023 losses — semiconductor source code, chip-test sequences, a confidential meeting transcript — came from engineers pasting work into ChatGPT across twenty days, with no exploit involved ([AI Incident DB #768](https://incidentdatabase.ai/cite/768/)).

---

## 3. Workspace and context hygiene

### R-CTX-1 [P0] — Secrets never live in the repository working tree

**Rule:** `.env` files containing real values, downloaded service-account JSON, `kubeconfig`, and exported credentials do not sit in a directory an agent can read. Local development uses a secret manager or an `.env` containing only fake local values (`R-CFG-6`).

**Why:** Every ignore mechanism in every coding agent is best-effort, and each vendor says so. Cursor's documentation states that `.cursorignore` blocks indexing but that complete protection is not guaranteed; GitHub's content exclusion explicitly does not apply to Copilot CLI or Agent-mode chat ([GitHub](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)). An ignore rule stops indexing. It does not stop an agent from running `cat`.

### R-CTX-2 [P0] — Configure ignore rules anyway, as depth, not as the boundary

**Rule:** Every repository configures the exclusion mechanism for every agent in use — `.gitignore`, `.claudeignore`-equivalent permission settings, `.cursorignore`, org-level Copilot content exclusion — covering at minimum: `.env*`, `*.pem`, `*.key`, `*_rsa`, `**/credentials`, `**/*service-account*.json`, `**/kubeconfig`, `.terraform/`, `*.tfstate`.

**Why:** It stops the accidental-indexing path even though it does not stop the deliberate-read path. Both paths need closing; this one is nearly free.

### R-CTX-3 [P0] — Agent shell access does not include credential files

**Rule:** Where the agent harness supports a command allowlist or sandbox, deny reads of `~/.aws/`, `~/.config/gcloud/`, `~/.kube/`, `~/.ssh/`, `$GOOGLE_APPLICATION_CREDENTIALS`, and deny `printenv`/`env`/`ps auxeww` output being returned to context.

**Why:** Harvesting cloud credential files is a documented, in-the-wild agent attack path — the "poisoned coding test" campaign did exactly this via an agent running with the developer's full permissions ([Mitiga](https://www.mitiga.io/blog/poisoned-coding-test-ai-agent-attack)).

### R-CTX-4 [P0] — Enforce at the kernel boundary; command allowlists are the inner layer, not the boundary

**Rule:** The security boundary for an agent with shell access is an OS-level sandbox — a container with no host bind mounts beyond the scoped workspace (`R-CTX-11`), a microVM, or a `seccomp` / AppArmor / SELinux / Landlock profile that denies the credential paths of `R-CTX-3` at the syscall layer. Inside that boundary, still constrain the agent by enumerating what it may run, never by enumerating what it may not.

**Why:** Command-name filtering is not a boundary, because the command name is not the capability. Every one of these reaches the same syscall without matching a filtered name:

```sh
echo <base64> | base64 -d | sh          # the payload never appears as a command name
python3 -c 'import os; print(os.environ)' # env access with no `env` or `printenv` in sight
node -e 'console.log(process.env)'
bash -c 'p''r''i''n''t''e''n''v'          # trivial string-splitting against a matcher
```

A name-matching filter has to enumerate an unbounded set of spellings; a syscall or mount-namespace policy has to enumerate one path. The empirical record is one-sided: subprocess environment filtering was bypassed by reading the parent process environment via `ps auxeww`, and environment scrubbing for spawned processes was bypassed by an in-process file read of `/proc/self/environ` — which never traverses the subprocess sandbox at all. Both bypasses are dead against a kernel-level deny on the path.

**Verification:** Infrastructure review confirms the sandbox profile exists and denies the `R-CTX-3` paths. An agent runner with shell access and no sandbox profile is a `[P0]` finding.

### R-CTX-5 [P0] — The agent's own API keys are not in the agent's reachable environment

**Rule:** `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, and equivalents are supplied to the harness, not exported into the shell environment the agent can inspect.

- **In CI:** scoped to the step that needs them, and never present in a step that processes untrusted input.
- **On developer workstations:** CLI agents are launched through a wrapper that sanitizes the parent environment — a clean container runner, or `env -i` with an explicit passlist. Never from an interactive shell that has sourced the developer's profile.

```sh
# ~/bin/agent — launch with an explicit environment, not an inherited one
exec env -i \
  HOME="$HOME" PATH="$PATH" TERM="$TERM" LANG="$LANG" \
  ANTHROPIC_API_KEY="$(secret-cli read caspr/agent#anthropic_key)" \
  "$@"
```

**Why:** These were the exact values exfiltrated in the Comment and Control chain, and CI is the easier half of the problem. A developer's interactive shell has typically sourced a profile exporting `AWS_*`, `GITHUB_TOKEN`, `STRIPE_*`, and database URLs, and every one of those is inherited by an agent started from that shell — a far richer environment than any CI step. `env -i` inverts the default from "inherit everything unless scrubbed" to "inherit nothing unless passed", which is the same allowlist-over-blocklist argument as `R-CTX-4`.

### R-CTX-6 [P0] — Untrusted content never shares a context with a credential-bearing environment

**Rule:** An agent that reads issue bodies, PR comments, web pages, or user-supplied files must not run in an environment holding Tier 0/1 values. Split the job: one agent reads untrusted input with no credentials; a separate, credentialed step acts on a structured, reviewed result.

**Why:** This is the structural answer to indirect prompt injection. Since injection cannot be prevented at the prompt layer (`R-AI-4`), remove the thing worth stealing from the context that can be hijacked.

### R-CTX-7 [P0] — Agent instruction and config files are reviewed code

**Rule:** `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, and MCP config files are code-reviewed on every change, scanned for deceptive Unicode, and never accepted from an untrusted fork. "Deceptive Unicode" means all three of:

| Class | Codepoints | What it does to a reviewer |
|---|---|---|
| Bidirectional controls | `U+202A`–`U+202E`, `U+2066`–`U+2069` | Reorders rendered text so the displayed order differs from the parsed order |
| Zero-width and invisible | `U+200B`–`U+200D`, `U+2060`, `U+FEFF` | Carries instructions that render as nothing at all |
| Confusables / mixed script | Cyrillic `а` for Latin `a`, Greek `ο` for `o` | Makes a hostile path, host, or tool name render identically to an approved one |

**Why:** The Rules File Backdoor turned exactly these files into an invisible instruction channel with write access to the codebase. The three classes fail differently and a check for one does not catch the others: bidi controls survive a zero-width strip, and confusables are ordinary printable characters that no non-printing filter will ever flag.

**Verification:** See `R-VER-1`.

### R-CTX-8 [P0] — MCP configuration holds no plaintext long-lived tokens

**Rule:** MCP servers authenticate via OAuth per the MCP authorization specification, or receive short-lived credentials at launch from the secret manager. Plaintext tokens in `mcp.json` are prohibited.

**Why:** The specification has forbidden token passthrough and required servers to mint their own downstream tokens since the 2025-11-25 revision ([MCP spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)), but the ecosystem has not followed: analysis of roughly 5,200 open-source MCP servers found 53% relying on hardcoded static secrets against 8.5% using OAuth. Trail of Bits found MCP config files routinely aggregating several plaintext secrets in one world-readable file ([Trail of Bits](https://blog.trailofbits.com/2025/04/30/insecure-credential-storage-plagues-mcp/)). The spec is ahead of the field; follow the spec.

### R-CTX-9 — Local agent transcripts are treated as secret-bearing storage

**Rule:** Agent session logs cached on disk (for example under `~/.claude/projects/`) are on a full-disk-encrypted machine, are not backed up to unmanaged cloud storage, and are purged when a laptop changes hands.

**Why:** Transcripts persist in plaintext by default and contain whatever the agent read. They are a durable copy of the disclosure surface.

### R-CTX-10 — Feedback and transcript sharing is an explicit disclosure decision

**Rule:** Treat "share this session" and `/feedback` uploads as publishing the transcript. Review before sending. Vendor-side redaction of known key patterns is a backstop, not a licence.

### R-CTX-11 [P0] — Workspace mounts are scoped and discardable

**Rule:** An agent execution environment mounts the specific target directory under active work, and nothing above it. `$HOME`, parent directories, the Docker socket, and any volume carrying unmanaged credentials are never mounted into an agent container or runner. The mount is discarded when the task ends.

```yaml
# Correct — one directory, read-write, nothing else reachable
volumes:
  - ./services/caspr-api:/workspace:rw

# Prohibited — each of these hands over the credential store
#  - ${HOME}:/root                      # ~/.aws, ~/.ssh, ~/.config/gcloud, shell history
#  - ..:/workspace                      # sibling repos, their .env files
#  - /var/run/docker.sock:/var/run/docker.sock   # container escape to the host
```

**Why:** This is the rule that makes `R-CTX-3` enforceable rather than aspirational. An agent denied `~/.aws` by a command filter still reads it at `/root/.aws` if `$HOME` is bind-mounted, and a broad mount re-opens every path the sandbox of `R-CTX-4` was configured to close. Deny the mount and the file is not merely unreadable — it is not present in the namespace at all, which no amount of creative shell quoting can undo.

**Verification:** Container and runner definitions are reviewed for mount scope. A `$HOME`, parent-directory, or Docker-socket mount in an agent runner is a `[P0]` finding.

---

## 4. Agents that need real access

### R-AGT-1 [P0] — The agent gets its own identity, never the operator's

**Rule:** Every agent — CI agent, MCP server, autonomous worker — authenticates as itself, with its own scoped identity. Never by inheriting a human's session, PAT, or cloud profile.

**Why:** OWASP's agentic entry ASI03 (Identity and Privilege Abuse) exists because agents routinely inherit elevated human privilege and become a privilege-escalation path. Reasoning about blast radius is impossible when the agent's identity is a person's.

### R-AGT-2 [P0] — Credentials issued to agents are short-lived and task-scoped

**Rule:** Maximum lifetime for an agent-held credential is the task duration, and never more than one hour. Static long-lived keys are prohibited for agent use.

**Why:** Converged guidance across CSA (just-in-time verifiable credentials that expire with the task) and the CISA/Five Eyes joint guidance of 30 April 2026, which requires each agent to carry a verified, cryptographically anchored identity with short-lived credentials ([CISA](https://www.cisa.gov/resources-tools/resources/careful-adoption-agentic-ai-services)). A short lifetime converts a leak from a breach into an inconvenience.

### R-AGT-3 [P0] — Prefer the broker pattern: the agent transacts, the proxy authenticates

**Rule:** Where an agent needs to call a protected system, route the call through a credential broker or egress proxy that injects the real credential at the network boundary. The agent holds a placeholder.

**Why:** This is the one architecture where `R-AI-3` is enforced by construction rather than by discipline — an agent that never receives the value cannot leak it under any injection. It is the convergent pattern across CSA guidance, Infisical's agent vault, and the egress-proxy designs documented by Christian Posta ([Infisical](https://infisical.com/blog/credential-brokering-for-ai-agents), [Posta](https://blog.christianposta.com/credential-brokering-patterns-for-ai-agent-egress/)).

### R-AGT-4 [P0] — Prefer federated workload identity over any stored key

**Rule:** Use OIDC workload identity federation (GitHub Actions OIDC, AWS IRSA, GCP Workload Identity, Azure Managed Identity) or SPIFFE/SPIRE. A stored static key for an agent requires a written exception.

**Why:** It removes the credential from existence rather than protecting it. NIST's NCCoE demonstration project on agent identity is built around exactly this combination — OAuth 2.0, SPIFFE/SPIRE, SCIM and MCP ([NCCoE](https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization)). Note that project is at concept-paper stage, so this is a converging direction rather than a ratified standard.

### R-AGT-5 [P0] — Delegate by token exchange; never forward a received token

**Rule:** When an agent or MCP server calls a downstream service, it exchanges its token for a downscoped one ([RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693)). Passing the received token through unchanged is prohibited. The exchanged token **must** carry an explicit `aud` claim naming only the target downstream resource, and every receiving service **must** reject a token whose `aud` is absent, wildcarded, or not its own identifier.

```jsonc
// Exchange request — audience is requested, not left to a default
{ "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token": "<agent's own token>",
  "audience": "https://billing.caspr.internal",   // exactly one resource
  "scope": "invoices:read" }                       // narrowest scope that completes the task
```

**Why:** Downscoping without audience binding solves half the problem. A scope-limited but audience-unbound token is still replayable against *every* service that trusts the issuer, so one compromised or malicious downstream service — an MCP server, a third-party tool endpoint — replays what it received laterally. The `aud` claim is what confines a captured token to the single resource it was minted for, and it is only a control if the receiving side validates it: an `aud` nobody checks is documentation. Token passthrough itself is the confused-deputy vulnerability, and is forbidden by the MCP specification for that reason.

### R-AGT-6 [P0] — Authorization is enforced outside the model

**Rule:** Every tool call an agent makes is authorized by the receiving service against the agent's identity. The model is never the thing deciding whether an action is permitted.

**Why:** OWASP LLM06 (Excessive Agency) requires independent authorization enforcement precisely because a model's decision can be argued out of it by injected content.

### R-AGT-7 [P0] — Least functionality: an agent gets the narrowest scope that completes the task

**Rule:** Read-only unless the task needs writes. One repository, not the org. One table, not the schema. No standing production write access for an agent — production writes go through an approved, human-gated pipeline.

### R-AGT-8 [P0] — Egress is allowlisted, and the allowlist is not a safe channel

**Rule:** Agent network egress is restricted to the hosts it needs. Additionally, treat allowlisted hosts as potential exfiltration paths and require review of what the agent may *write* to them.

**Why:** The Comment and Control exfiltration left through `github.com` — an allowlisted host, by design, in a GitHub Actions runner. Egress allowlisting is necessary and insufficient; write capability to an allowlisted host is itself a channel.

### R-AGT-9 — Every agent action is audited under the agent's own identity

**Rule:** Log which agent, acting for which principal, took which action against which resource, with the delegation chain intact.

### R-AGT-10 — High-impact actions require a human in the loop

**Rule:** Credential rotation, IAM changes, production data mutation, and deploys are proposed by an agent and executed by a human or a gated pipeline.

---

## 5. Providers and data handling

### R-VND-1 [P0] — Only approved providers may receive Caspr content

**Rule:** Maintain a short, explicit list of AI providers approved for Caspr code and data, each under commercial terms with training on inputs disabled. Personal accounts and consumer tiers are prohibited for work content.

**Why:** Consumer tiers frequently default to training on inputs, with retention measured in years rather than days. The account type, not the model, determines the terms.

### R-VND-2 [P0] — Verify retention terms before onboarding, and re-verify at review

**Rule:** Before approving a provider, record: default retention window, whether inputs train models, whether zero-data-retention is available and to whom, and what survives ZDR (safety classification and abuse-monitoring stores commonly do). Re-verify at each security review. Terms change without notice.

**Why:** Appendix D is a snapshot taken 2026-08-25, not a standing guarantee. Do not cite it as current without re-checking the linked source.

### R-VND-3 [P0] — Zero data retention is a mitigation, never an authorization

**Rule:** ZDR does not raise a Tier 0 or Tier 1 value's tier, does not permit a disclosure that would otherwise be prohibited, and does not excuse rotation after an exposure (`R-RSP-3`).

**Why:** ZDR narrows one window — provider-side persistence. It does nothing about the local transcript on disk, the agent's memory store, the gateway log, or the injected instruction that made the model emit the secret in the first place. Provider documentation is also generally not exhaustive about what safety and abuse-monitoring pipelines retain regardless.

### R-VND-4 [P0] — Route through a gateway with secret redaction where volume justifies it

**Rule:** For programmatic LLM traffic, route through a gateway performing secret and PII detection on outbound prompts ([LiteLLM guardrails](https://docs.litellm.ai/docs/proxy/guardrails/secret_detection), [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/features/guardrails/), or equivalent). Detections are logged; redacted values never reach the provider.

**Why:** It is the only control that catches the case nobody anticipated. Treat it as a net under the rules, not a replacement for them — pattern-based detection misses novel formats.

### R-VND-5 — Prefer providers offering enforceable, org-wide retention controls

**Rule:** Where a provider allows retention mode to be enforced centrally (for example via cloud policy rather than per-call parameters), prefer that path over per-request flags.

**Why:** A per-request flag is one forgotten parameter away from retention. An org-level policy is not.

### R-VND-6 — Data residency is a separate question from retention

**Rule:** Where a regulatory obligation constrains where data is processed, verify the provider's regional guarantee independently of its retention posture. The two are configured separately and are frequently confused.

---

## 6. Detection, response, and rotation

### R-RSP-1 [P0] — Secret scanning runs pre-commit and in CI, and blocks

**Rule:** `gitleaks` or `detect-secrets` at pre-commit; provider-side push protection enabled; a detection fails the build. This is `R-SEC-4` restated because AI-assisted code is a materially higher-rate source.

**Why:** GitGuardian's 2026 telemetry recorded 28.65M new hardcoded secrets on public GitHub in 2025 (+34% year on year), with secret leak rates in AI-assisted code running roughly twice the platform baseline, and AI-service credentials the fastest-growing leaked category at +81% ([report](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)).

### R-RSP-2 — Scan the AI traffic, not only the commits

**Rule:** Where tooling permits, scan prompts, tool outputs, and agent transcripts for secret patterns, not just the diff. Route detections to the security owner.

**Why:** Committed code is the last point in the chain. The disclosure happened several steps earlier.

### R-RSP-3 [P0] — A Tier 0 or Tier 1 value that entered a disclosure surface is compromised. Rotate it.

**Rule:** Rotate on discovery. No assessment of whether the model "actually used" it, whether ZDR was enabled, or whether the session was deleted. Target windows, from discovery:

| Tier | Rotate within | Also required |
|---|---|---|
| Tier 0 | 1 hour | Revoke and re-issue dependent certificates/tokens; invalidate all sessions signed by the old key |
| Tier 1, production | 4 hours | Revoke old credential; audit access logs for the exposure window |
| Tier 1, non-production reaching real systems | 24 hours | Revoke old credential |

**These windows are provisional, not ratified.** They stand as the working default and should be followed today, but they have not been tested against Caspr's deploy and session-invalidation tooling — in particular, whether a Tier 0 signing-key turn (revoke, re-issue, invalidate every session signed by the old key) completes inside an hour. Until that test runs, rotate as fast as the tooling allows and record the actual elapsed time in the `R-RSP-5` report. Appendix E, item 2 tracks the timing test that closes this out.

**Why:** The alternative is a judgement call made by the person least motivated to make extra work, under uncertainty they cannot resolve. And remediation is empirically the bottleneck, not detection: 64% of secrets found valid in 2022 were still unrevoked in 2026. A rotation rule with no discretion in it is the only kind that survives contact with a Friday afternoon.

### R-RSP-4 [P0] — Rotation is not complete until the old value fails

**Rule:** Verify the old credential is rejected. Rotation that issues a new value without revoking the old one has changed nothing.

### R-RSP-5 [P0] — Report exposures; never handle one silently

**Rule:** Any disclosure of a Tier 0 or Tier 1 value is reported to the security owner — currently Jayant (joy@caspr.ai) — the same day, with the surface, the exposure window, the rotation status, and the **elapsed time from discovery to the old credential being rejected**. Reporting is blameless; not reporting is the violation.

**Why:** Individual exposures are cheap to fix. Patterns of exposure are what actually need finding, and they are invisible if each one is quietly cleaned up.

### R-RSP-6 — Every credential must be rotatable within its target window before it is issued

**Rule:** If you cannot rotate it inside the `R-RSP-3` window, you cannot issue it. Rotation is a design requirement, not an incident procedure.

### R-RSP-7 — Purge the artefacts, knowing purging is not remediation

**Rule:** After rotation, delete the local transcript, clear the agent memory entry, and request provider-side deletion where offered. Do this second. Rotation is the remediation; purging is hygiene.

---

## 7. Verification

### R-VER-1 [P0] — Ignore rules and agent config are checked in CI

**Rule:** CI asserts the required exclusion patterns of `R-CTX-2` are present, and rejects all three deceptive-Unicode classes of `R-CTX-7` in agent config paths — bidirectional controls (`U+202A`–`U+202E`, `U+2066`–`U+2069`), zero-width and invisible characters (`U+200B`–`U+200D`, `U+2060`, `U+FEFF`), and mixed-script confusables. Confusable detection needs a script-mixing check (a single identifier drawing on both Latin and Cyrillic, for example); a non-printing-character filter will not find them.

### R-VER-2 [P0] — No plaintext credential in any agent or MCP configuration

**Rule:** CI scans `mcp.json`, `.cursor/rules`, `CLAUDE.md`, `AGENTS.md`, and equivalents for credential patterns. Any hit fails the build.

### R-VER-3 [P0] — Agent credential lifetimes are asserted, not assumed

**Rule:** Infrastructure review confirms every agent identity issues credentials with a TTL at or under the `R-AGT-2` ceiling. A static key requires a documented exception with an expiry date.

### R-VER-4 — Classification coverage is reviewed quarterly

**Rule:** Each quarter, walk `core/settings.py` and the secret manager and confirm every entry carries a tier (`R-CLS-6`). New unclassified entries are Tier 1 by default and must be resolved.

### R-VER-5 — Exposure incidents are reviewed for pattern, not fault

**Rule:** Review reported exposures each quarter. A recurring surface is a missing control, and the fix belongs in this document.

---

## Appendix A — The one-page version

- Private keys, signing keys, root credentials: **never**, in any form, not even partially.
- Live credentials to real systems: the **value** never; the **capability** through a broker.
- Names, formats, scopes, policies, vault paths: **share freely** — this is what the model actually needs.
- Public keys, `client_id`s, obviously-fake placeholders: **free**.
- An agent that must act gets **its own identity**, **short-lived**, **audience-bound**, **narrowly scoped**, **audited**.
- An agent with a shell is confined by the **kernel and the mount namespace**, not by a list of command names.
- Untrusted input and real credentials **never share a context**.
- Anything real that touched a model context is **rotated**, no debate.

## Appendix B — Rule index

| Group | Rules | Theme |
|---|---|---|
| `R-AI` | 1–5 | Prime directives: default deny, disclosure surfaces, capability vs. knowledge |
| `R-CLS` | 1–6 | Four-tier classification and the decision procedure |
| `R-SHR` | 1–8 | What may be shared, placeholders, redaction |
| `R-CTX` | 1–11 | Workspace, sandboxing, mount scope, shell scope, agent config, MCP, transcripts |
| `R-AGT` | 1–10 | Agent identity, brokering, token exchange, scoping, egress |
| `R-VND` | 1–6 | Approved providers, retention, ZDR, gateway redaction |
| `R-RSP` | 1–7 | Scanning, rotation clock, reporting |
| `R-VER` | 1–5 | CI and review gates |

## Appendix C — Threat model in one table

| Threat | Source | Rule that answers it |
|---|---|---|
| Human pastes a secret into a prompt | OWASP LLM02; Samsung 2023 | `R-SHR-1`, `R-SHR-4`, `R-SHR-8` |
| Agent reads `.env` or a cloud credential file | Agent exposure research | `R-CTX-1`, `R-CTX-2`, `R-CTX-3` |
| Command filter evaded by subshell, encoding, or scripting wrapper | Bypass patterns in `R-CTX-4` | `R-CTX-4` (kernel-level deny), `R-CTX-11` |
| Broad bind mount re-exposes `$HOME` or the Docker socket | Container escape / credential store on host | `R-CTX-11` |
| Developer shell exports the whole credential set into the agent | Ambient workstation environment | `R-CTX-5` |
| Downscoped token replayed laterally against another service | Missing `aud` validation | `R-AGT-5` |
| Indirect prompt injection exfiltrates env vars | OWASP LLM01; Comment and Control (2026) | `R-CTX-5`, `R-CTX-6`, `R-AGT-8` |
| Poisoned agent rules file | Rules File Backdoor (2025) | `R-CTX-7`, `R-VER-1` |
| MCP server holds plaintext tokens / passes them through | OWASP MCP01; MCP authorization spec | `R-CTX-8`, `R-AGT-5` |
| Agent inherits the operator's full privilege | OWASP ASI03; LLM06 | `R-AGT-1`, `R-AGT-6`, `R-AGT-7` |
| Model regurgitates a secret from training data | Copilot secret-regurgitation research | Not preventable by us — `R-RSP-1` catches it landing in our code |
| Provider retains a prompt containing a secret | Vendor retention terms | `R-VND-1`, `R-VND-2`, `R-VND-3` |
| Exposure discovered, nobody rotates | Secrets Sprawl 2026 (64% still unrevoked) | `R-RSP-3`, `R-RSP-4`, `R-RSP-5` |

## Appendix D — Provider retention snapshot (2026-08-25, verify before relying)

Recorded to satisfy `R-VND-2`. **This is a point-in-time reading of vendor documentation, not a guarantee.** Re-read the linked source before making a decision on it.

| Provider | Default retention | Trains on input | ZDR available |
|---|---|---|---|
| Anthropic API | ~30 days | No, absent explicit opt-in | Yes, per-organization, sales-enabled; some safety/abuse pipelines retain regardless |
| Claude Code | Per plan; local transcripts cached in plaintext ~30 days | No on commercial plans absent opt-in | Enterprise, per-organization |
| OpenAI API | ~30 days abuse-monitoring logs | No by default | Yes, requires approval; some endpoints ineligible |
| Google Gemini / Vertex | Paid tiers not used for product improvement by default | No on paid tiers | Yes, per-endpoint on Vertex |
| AWS Bedrock | No input/output storage by default | No | Effectively default; enforceable org-wide via SCP |
| Azure OpenAI | ~30 days abuse-monitoring store | No | Modified Abuse Monitoring for approved customers |

Sources: [Anthropic retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [Claude Code data usage](https://code.claude.com/docs/en/data-usage) · [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) · [Gemini ZDR](https://ai.google.dev/gemini-api/docs/zdr) · [Bedrock retention](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html) · [Azure abuse monitoring](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring)

## Appendix E — Open items

| # | Item | Status | What closes it |
|---|---|---|---|
| 1 | **Security owner** — `R-CLS-2`, `R-RSP-5`, `R-VER-5` route here | **Interim: Jayant (joy@caspr.ai).** Personal, not a function | A monitored alias or a named role with a routing address, so an incident report does not depend on one person being reachable |
| 2 | **Rotation windows** — the `R-RSP-3` table | **Provisional.** Followed today, not ratified | A timing test: attempt a Tier 0 turn against the real deploy and session-invalidation path and measure it. Ratify 1h, or replace it with the number the tooling actually supports |
| 3 | **Approved provider list** — required by `R-VND-1` | **Not started.** Appendix D is a market snapshot, not an approval | An explicit list of providers cleared for Caspr content, each with commercial terms and training-on-input disabled |
| 4 | **Prompt gateway** — `R-VND-4` | **Not chosen.** The rule names a class of tool | A selection, once programmatic LLM traffic exists at a volume that justifies one |

**On items 1 and 2 specifically.** Both are deliberately recorded as unfinished rather than written up as settled. A sole-person owner and an untested SLA are the two failure modes this appendix exists to keep visible: the first stalls an incident when that person is unreachable, and the second decays into a rule people learn to ignore once they discover the tooling cannot meet it. Neither is a reason to delay adopting the rest of the document.

## Appendix F — Primary sources

**Standards and frameworks**
- OWASP Top 10 for LLM Applications 2025 — [LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [full PDF](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf), [LLM06 Excessive Agency](https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html)
- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/) — ASI02 Tool Misuse, ASI03 Identity and Privilege Abuse, ASI06 Memory Poisoning
- [OWASP MCP01-2025 — Token Mismanagement and Secret Exposure](https://owasp.org/www-project-mcp-top-10/2025/MCP01-2025-Token-Mismanagement-and-Secret-Exposure)
- [MCP Authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [NIST AI 600-1 — Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [NIST NCCoE — Software and AI Agent Identity and Authorization](https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization) (concept paper stage)
- [CISA / Five Eyes — Careful Adoption of Agentic AI Services](https://www.cisa.gov/resources-tools/resources/careful-adoption-agentic-ai-services) (30 April 2026)
- [Cloud Security Alliance — Agentic AI Identity and Access Management](https://cloudsecurityalliance.org/artifacts/agentic-ai-identity-and-access-management-a-new-approach)
- [RFC 8693 — OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693)

**Incidents and research**
- [Samsung / ChatGPT source code leak (2023)](https://incidentdatabase.ai/cite/768/)
- [GitHub Copilot leaking valid secrets from training data](https://blog.gitguardian.com/yes-github-copilot-can-leak-secrets/)
- [Rules File Backdoor — invisible instructions in agent rules files](https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents)
- [Comment and Control — cross-vendor prompt injection to credential theft (2026)](https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/)
- [Trail of Bits — insecure credential storage in MCP](https://blog.trailofbits.com/2025/04/30/insecure-credential-storage-plagues-mcp/)
- [Trend Micro — internet-exposed MCP servers](https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud)
- [CloudSEK — MCP server chained to AWS credential theft](https://www.cloudsek.com/blog/aivigil-mcp-security-case-study)
- [Mitiga — poisoned coding test harvesting cloud credential files](https://www.mitiga.io/blog/poisoned-coding-test-ai-agent-attack)
- [GitGuardian — State of Secrets Sprawl 2026](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)

**Practice patterns and tooling**
- [Infisical — credential brokering for AI agents](https://infisical.com/blog/credential-brokering-for-ai-agents)
- [Christian Posta — credential brokering patterns for AI agent egress](https://blog.christianposta.com/credential-brokering-patterns-for-ai-agent-egress/)
- [HashiCorp — SPIFFE for agentic AI and non-human identity](https://www.hashicorp.com/en/blog/spiffe-securing-the-identity-of-agentic-ai-and-non-human-actors)
- [LiteLLM — secret detection guardrail](https://docs.litellm.ai/docs/proxy/guardrails/secret_detection)
- [Cloudflare AI Gateway — guardrails](https://developers.cloudflare.com/ai-gateway/features/guardrails/)
- [GitHub Copilot — content exclusion](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

**Note on unverified sources.** ISO/IEC 42001 and ISO/IEC 27001 Annex A were reachable only through secondary summaries (the standards are paywalled), and NIST SP 800-207A's SPIFFE reference was not fetched from primary text. Neither is cited as binding above. Check primary text before adding either as a compliance claim.
