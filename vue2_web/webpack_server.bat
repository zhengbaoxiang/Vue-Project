@echo off
cd /d %~dp0

:: 直接运行
npm run dev

:: 新开一个最小化窗口运行服务
@REM start /min cmd /c "npm run dev"

if errorlevel 1 (
    echo Failed to start webpack server
    pause
    exit /b %errorlevel%
)