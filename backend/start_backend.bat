@echo off
REM start_backend.bat - Start script for Sharada Financial Services Backend (Windows)

echo 🚀 Starting Sharada Financial Services Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo ❌ Virtual environment not found. Please run setup_backend.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from template...
    copy env.example .env
    echo ⚠️  Please update .env file with your actual API keys before starting!
)

REM Start the server
echo 🌐 Starting FastAPI server...
echo 📍 Server will be available at: http://localhost:8000
echo 📚 API documentation at: http://localhost:8000/docs
echo 🔍 Health check at: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
