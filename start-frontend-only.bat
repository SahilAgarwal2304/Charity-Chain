@echo off
title CharityChain Web Server (Port 5000)
cd /d "%~dp0"
echo ==========================================================
echo       CHARITYCHAIN - WEB APPLICATION LAUNCHER
echo ==========================================================
echo Starting Frontend Web Server on http://localhost:5000...
echo.
start http://localhost:5000
node server.js
pause
