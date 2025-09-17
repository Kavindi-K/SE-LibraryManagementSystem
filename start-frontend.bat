@echo off
echo Starting Library Management Frontend...
cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\frontend"

echo Installing dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ NPM install failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed! Starting Vite dev server...
echo Frontend will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
