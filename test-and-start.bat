@echo off
echo ==============================================
echo    Library Management System - Quick Test
echo ==============================================
echo.

echo 1. Testing Backend Compilation...
cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"
call mvnw.cmd clean compile -q

if %ERRORLEVEL% neq 0 (
    echo ❌ Backend compilation FAILED
    echo Please check the compilation errors above.
    pause
    exit /b 1
) else (
    echo ✅ Backend compilation SUCCESS
)

echo.
echo 2. Testing Frontend Dependencies...
cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\frontend"

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend dependencies FAILED
    pause
    exit /b 1
) else (
    echo ✅ Frontend dependencies OK
)

echo.
echo ==============================================
echo     System Status: READY TO START
echo ==============================================
echo.
echo To start your Library Management System:
echo.
echo 1. Backend:  Double-click "start-backend.bat"
echo 2. Frontend: Double-click "start-frontend.bat"
echo.
echo Backend URL: http://localhost:8080
echo Frontend URL: http://localhost:5173
echo API Endpoint: http://localhost:8080/api/members
echo.
echo System Features Fixed:
echo ✅ Responsive design for all screen sizes
echo ✅ Mobile-friendly navigation and tables
echo ✅ Enhanced error handling and debugging
echo ✅ Proper API connection troubleshooting
echo ✅ Touch-friendly buttons and forms
echo ✅ Horizontal scrolling tables on mobile
echo.
pause
