@echo off
cd /d "C:\Users\joysh\Documents\caspr\caspr-claude-core"
C:\Users\joysh\AppData\Local\Microsoft\WindowsApps\python3.exe "C:\Users\joysh\Documents\caspr\caspr-claude-core\extract_pdfs.py" > "C:\Users\joysh\Documents\caspr\caspr-claude-core\pdf_extract_output.txt" 2>&1
echo Done. Output in pdf_extract_output.txt
pause
