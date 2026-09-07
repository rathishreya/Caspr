@echo off
cd /d "C:\Users\joysh\Documents\caspr\caspr-claude-core"
echo Checking for Python installations...
dir "C:\Users\joysh\AppData\Local\Programs\Python\" 2>nul || echo No Programs\Python dir
dir "C:\Python*" 2>nul || echo No C:\Python dir
dir "C:\Users\joysh\AppData\Local\Microsoft\WindowsApps\python*.exe" 2>nul
where python 2>nul || echo python not in PATH
where python3 2>nul || echo python3 not in PATH
where py 2>nul || echo py not in PATH
echo --- GIT BASH Python ---
"C:\Program Files\Git\bin\bash.exe" -c "which python3; python3 --version; python3 -c 'import pdfplumber; print(\"pdfplumber ok\")'" 2>nul || echo Git Bash python check failed
echo Done
pause
