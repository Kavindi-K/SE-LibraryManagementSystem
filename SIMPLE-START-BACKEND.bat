@echo off
title Library Management Backend Server
cls
echo.
echo ============================================================
echo                 LIBRARY BACKEND SERVER
echo ============================================================
echo.

cd /d "D:\LibraryManagement\SE-LibraryManagementSystem\backend"

REM Kill any existing Java processes
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM javaw.exe >nul 2>&1

echo Starting Spring Boot application...
echo.
echo Backend will be available at: http://localhost:8080
echo API endpoints will be at: http://localhost:8080/api/members
echo.
echo Wait for the success message, then press Retry in your frontend!
echo.

mvnw.cmd spring-boot:run

pause
