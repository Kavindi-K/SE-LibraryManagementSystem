@echo off
echo ================================================
echo    LIBRARY MANAGEMENT BACKEND STARTUP
echo ================================================
echo.

cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"

echo 🔍 Step 1: Checking if port 8080 is available...
netstat -ano | findstr :8080 >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠️  Port 8080 is in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo Killing process %%a
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo ✅ Port 8080 is now available
echo.

echo 🔧 Step 2: Cleaning and compiling...
call mvnw.cmd clean compile -q

if %ERRORLEVEL% neq 0 (
    echo ❌ Compilation failed!
    pause
    exit /b 1
)

echo ✅ Compilation successful
echo.

echo 🚀 Step 3: Starting Spring Boot application...
echo.
echo 📍 Backend will be available at: http://localhost:8080
echo 📍 API endpoints at: http://localhost:8080/api/members
echo 📍 Frontend should connect automatically once started
echo.
echo ⏳ Starting server (this may take 10-15 seconds)...
echo.

start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo ✅ Backend startup initiated!
echo 📋 Look for these success messages in the new window:
echo    - "Started LibraryApplication"
echo    - "Tomcat started on port(s): 8080"
echo    - MongoDB connection success
echo.
echo 🌐 Once you see those messages, your frontend should work!
echo.
pause
