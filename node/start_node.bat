@echo off
cd /d %~dp0

:: 直接运行
node ./index.js

:: 新开一个最小化窗口运行服务
@REM start /min cmd /c  "node ./index.js"

if errorlevel 1 (
    echo error,Node.js server Failed
    pause
    exit /b %errorlevel%
)
