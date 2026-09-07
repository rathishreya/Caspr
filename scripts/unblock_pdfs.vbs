Dim fso, folder, file
Set fso = CreateObject("Scripting.FileSystemObject")
Set folder = fso.GetFolder("C:\Users\joysh\Documents\caspr\caspr-claude-core\Other Inputs")
For Each file In folder.Files
    If LCase(Right(file.Name, 4)) = ".pdf" Then
        Dim adsPath
        adsPath = file.Path & ":Zone.Identifier"
        If fso.FileExists(adsPath) Then
            fso.DeleteFile adsPath
            WScript.Echo "Unblocked: " & file.Name
        End If
    End If
Next
WScript.Echo "Done unblocking PDFs."
