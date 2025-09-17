@echo off
echo ===============================================
echo    FORCE RESTART BACKEND WITH NEW CONFIG
echo ===============================================
echo.

cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"

echo 🛑 Step 1: Killing any existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM javaw.exe >nul 2>&1
timeout /t 2 >nul

echo 🔧 Step 2: Clean build with new security config...
call mvnw.cmd clean compile -q

echo 🚀 Step 3: Starting backend with updated configuration...
echo.
echo 📍 Backend starting on: http://localhost:8080
echo 📍 API endpoints: http://localhost:8080/api/members
echo 📍 New security config allows frontend access
echo.

call mvnw.cmd spring-boot:run

pause
