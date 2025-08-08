@echo off
echo.
echo ========================================
echo    GoMall Database Setup Script
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Starting database setup...
echo.

node runAllScripts.js

if errorlevel 1 (
    echo.
    echo ERROR: Database setup failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Setup completed successfully!
echo ========================================
echo.
echo You can now start the GoMall server:
echo   cd .. && npm start
echo.
pause
