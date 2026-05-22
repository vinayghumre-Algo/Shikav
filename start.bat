@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   Shikav [by Kavish Ghumre] - SQL Learning Platform
echo ============================================
echo.

set "NODE_PATH=C:\Program Files\nodejs"
if exist "%NODE_PATH%\node.exe" set "PATH=%NODE_PATH%;%PATH%"

cd /d "%~dp0"

echo [1/3] Installing dependencies...
if not exist "node_modules" (
    call npm.cmd install
    if !errorlevel! neq 0 ( echo ERROR: Install failed & pause & exit /b !errorlevel! )
)
if not exist "client\node_modules" (
    cd client && call npm.cmd install && cd ..
    if !errorlevel! neq 0 ( echo ERROR: Client install failed & pause & exit /b !errorlevel! )
)

echo [2/3] Building frontend...
if not exist "public\index.html" (
    cd client && call npm.cmd run build && cd ..
    if !errorlevel! neq 0 ( echo ERROR: Build failed & pause & exit /b !errorlevel! )
)

echo [3/3] Starting server...
echo.
echo App URL: http://localhost:3000
echo.
echo Press Ctrl+C in the window to stop.
echo.

start "Shikav SQL" cmd /k "cd /d %~dp0 && node server.js"

echo Server started! Open http://localhost:3000 in your browser.
pause
