@echo off
title Push CharityChain to GitHub
cd /d "%~dp0"
echo ==========================================================
echo       PUSHING CHARITYCHAIN TO GITHUB REPOSITORY
echo       https://github.com/SahilAgarwal2304/Charity-Chain
echo ==========================================================
echo.
git push -u origin main
echo.
echo ==========================================================
echo If prompted above, click "Sign in with your browser" to authorize!
echo Once done, check your repo on GitHub:
echo https://github.com/SahilAgarwal2304/Charity-Chain
echo ==========================================================
pause
