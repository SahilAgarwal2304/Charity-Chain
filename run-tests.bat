@echo off
title CharityChain - Smart Contract Unit Tests
cd /d "%~dp0"
echo ==========================================================
echo        CHARITYCHAIN - AUTOMATED UNIT TEST SUITE
echo ==========================================================
echo Running Smart Contract Tests (Solidity / Hardhat / Mocha)...
echo.
call npx hardhat test
echo.
echo ==========================================================
echo Tests completed! Show this screen to the external examiner!
echo ==========================================================
pause
