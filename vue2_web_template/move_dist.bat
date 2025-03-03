@echo off
 
@REM del  D:\my\study-resource-tools\nginx-1.25.3\* /s/q
rmdir D:\my\study-resource-tools\nginx-1.25.3\Mydist /s/q
xcopy   .\dist\*  D:\my\study-resource-tools\nginx-1.25.3\Mydist\ /s/y