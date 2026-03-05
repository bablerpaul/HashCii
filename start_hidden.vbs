' HashCii Silent Launcher for Windows
' Runs start.bat without showing a console window
Set fso = CreateObject("Scripting.FileSystemObject")
Set WshShell = CreateObject("WScript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = scriptDir
WshShell.Run "cmd /c """ & scriptDir & "\start.bat""", 0, False
