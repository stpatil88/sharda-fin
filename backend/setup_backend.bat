@echo off
REM setup_backend.bat - Setup script for Sharada Financial Services Backend (Windows)

echo 🚀 Setting up Sharada Financial Services Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set python_version=%%i
echo ✅ Python version: %python_version%

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📚 Installing required packages...
pip install -r requirements.txt

REM Create .env file from example
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please update .env file with your actual API keys!
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Backend setup complete!
echo.
echo To start the backend server:
echo 1. Activate virtual environment: venv\Scripts\activate.bat
echo 2. Run the server: python app.py
echo    or: uvicorn app:app --reload --host 0.0.0.0 --port 8000
echo.
echo API will be available at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
echo.
echo Don't forget to update your .env file with the correct API keys!
pause
