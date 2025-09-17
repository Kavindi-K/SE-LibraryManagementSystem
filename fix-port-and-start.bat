@echo off
echo ===============================================
echo    PORT 8080 CONFLICT RESOLVER
echo ===============================================
echo.

echo 🔍 Step 1: Checking what's using port 8080...
netstat -ano | findstr :8080
if %ERRORLEVEL% equ 0 (
    echo.
    echo 📋 Found process(es) using port 8080
    echo.
    echo 🔍 Getting detailed process information...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo Process ID: %%a
        tasklist /fi "pid eq %%a" 2>nul
    )
    echo.
    echo ⚠️  Port 8080 is in use. Choose an option:
    echo.
    echo [1] Kill the process using port 8080 (recommended)
    echo [2] Change your app to use port 8081 instead
    echo [3] Exit and manually resolve
    echo.
    set /p choice="Enter your choice (1, 2, or 3): "

    if "!choice!"=="1" (
        echo.
        echo 🛑 Killing processes using port 8080...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
            echo Terminating process %%a
            taskkill /F /PID %%a >nul 2>&1
        )
        echo ✅ Processes terminated
        goto :start_backend
    ) else if "!choice!"=="2" (
        goto :change_port
    ) else (
        echo Exiting...
        pause
        exit /b 0
    )
) else (
    echo ✅ Port 8080 is free
    goto :start_backend
)

:change_port
echo.
echo 🔧 Changing application port to 8081...
cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend\src\main\resources"
echo server.port=8081 >> application.properties
echo ✅ Application configured to use port 8081
echo.
echo 🚨 IMPORTANT: Update your frontend API URL to http://localhost:8081
echo Edit: frontend\src\services\memberService.js
echo Change: http://localhost:8080 to http://localhost:8081
echo.
goto :start_backend

:start_backend
echo.
echo 🚀 Starting Spring Boot backend...
cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"
echo ===============================================
echo.

call mvnw.cmd spring-boot:run

pause
