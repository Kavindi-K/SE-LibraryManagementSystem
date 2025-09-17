
echo.
echo 🔍 Step 3: Compiling the application...
call mvnw.cmd compile -q
if %ERRORLEVEL% neq 0 (
    echo ❌ COMPILATION FAILED!
    echo Please check the error messages above
    pause
    exit /b 1
)
echo ✅ Compilation successful

echo.
echo 🔍 Step 4: Testing MongoDB connection...
echo Checking if MongoDB Atlas is accessible...
ping -n 1 cluster0.pu2hdjk.mongodb.net >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Warning: Cannot ping MongoDB cluster
    echo This might be normal for Atlas clusters
)

echo.
echo 🔍 Step 5: Starting Spring Boot application...
echo.
echo 📋 What to look for:
echo   ✅ "Started LibraryApplication in X.XXX seconds"
echo   ✅ "Tomcat started on port(s): 8080"
echo   ✅ "Sample member data initialized successfully!"
echo   ❌ Any MongoDB connection errors
echo   ❌ Any compilation errors
echo.
echo 🚀 Starting backend on http://localhost:8080
echo Press Ctrl+C to stop the server
echo ===============================================
echo.

call mvnw.cmd spring-boot:run

pause
