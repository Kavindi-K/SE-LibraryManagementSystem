@echo off
echo ===============================================
echo    🔧 ULTIMATE BACKEND FIX SCRIPT
echo ===============================================
echo.

cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"

echo 🛑 Step 1: Killing ALL Java processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM javaw.exe >nul 2>&1
timeout /t 3 >nul

echo 🧹 Step 2: Cleaning up ports...
netstat -ano | findstr :8080 > temp_port.txt 2>nul
for /f "tokens=5" %%a in (temp_port.txt) do (
    echo Killing process using port 8080: %%a
    taskkill /F /PID %%a >nul 2>&1
)
del temp_port.txt >nul 2>&1

echo 🔧 Step 3: Clean build...
call mvnw.cmd clean compile -q

echo 🚀 Step 4: Starting backend with enhanced config...
echo.
echo 📍 Backend starting on: http://localhost:8080
echo 📍 Health check: http://localhost:8080/api/members/health
echo 📍 Member API: http://localhost:8080/api/members
echo 📍 Membership types: http://localhost:8080/api/members/membership-types
echo.
echo ⏳ Wait for "LIBRARY MANAGEMENT SYSTEM STARTED SUCCESSFULLY!" message...
echo.

start "Library Backend" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo ✅ Backend started in new window!
echo ✅ Check the new window for startup messages
echo ✅ Look for the success message with green checkmarks
echo.
echo 🔄 You can now click "Retry" in your frontend!
echo.
pause
