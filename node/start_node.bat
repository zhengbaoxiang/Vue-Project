

@echo off
:: 设置当前工作目录为该批处理文件所在的目录
cd /d %~dp0

echo start to run Node.js ...

:: 直接运行Node.js服务
@REM node ./index.js

:: 最小化窗口运行Node.js服务
start /min cmd /k  "node ./index.js"


if errorlevel 1 (
    echo error,Node.js server Failed
    pause
    exit /b %errorlevel%
)else(
    echo Node.js server start success
    pause
)
