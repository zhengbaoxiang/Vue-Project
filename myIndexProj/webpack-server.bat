@echo off

start /min cmd /k "cd /d %~dp0&&npm run dev"

if errorlevel 1 (
    echo webpack server Failed
) else (
    echo webpack server start success

)