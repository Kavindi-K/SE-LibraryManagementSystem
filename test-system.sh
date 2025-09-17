#!/bin/bash

echo "=== Testing Library Management System ==="
echo

# Test backend compilation
echo "🔧 Testing Backend Compilation..."
cd backend
if ./mvnw compile -q; then
    echo "✅ Backend compiles successfully"
else
    echo "❌ Backend compilation failed"
fi

echo

# Test frontend dependencies
echo "🔧 Testing Frontend Dependencies..."
cd ../frontend
if npm list > /dev/null 2>&1; then
    echo "✅ Frontend dependencies are resolved"
else
    echo "⚠️  Some frontend dependencies may need to be installed"
    echo "Run: npm install"
fi

echo
echo "🎉 System validation complete!"
echo
echo "To start the system:"
echo "1. Backend: cd backend && ./mvnw spring-boot:run"
echo "2. Frontend: cd frontend && npm install && npm run dev"
