@echo off
:start
node main.js
echo.
echo [ERROR] The bot will restart in 15 seconds.
timeout /t 15 /nobreak >nul
goto start