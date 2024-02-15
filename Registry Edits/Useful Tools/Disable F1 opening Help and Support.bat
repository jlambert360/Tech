@echo off
taskkill /f /im HelpPane.exe
takeown /f %WinDir%\HelpPane.exe
icacls %WinDir%\HelpPane.exe /deny Everyone:(X)

reg add HKCU\SOFTWARE\Classes\Typelib\{8cec5860-07a1-11d9-b15e-000d56bfe6ee}\1.0\0\win32 /t REG_SZ /ve /f
reg add HKCU\SOFTWARE\Classes\Typelib\{8cec5860-07a1-11d9-b15e-000d56bfe6ee}\1.0\0\win64 /t REG_SZ /ve /f