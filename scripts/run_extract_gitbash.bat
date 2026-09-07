@echo off
cd /d "C:\Users\joysh\Documents\caspr\caspr-claude-core"
"C:\Program Files\Git\bin\bash.exe" -c "python3 extract_pdfs.py > pdf_extract_output.txt 2>&1; echo Exit: $?"
echo Done - check pdf_extract_output.txt
pause
