#!/bin/bash
# setup_backend.sh - Setup script for Sharada Financial Services Backend

echo "🚀 Setting up Sharada Financial Services Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python version: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing required packages..."
pip install -r requirements.txt

# Create .env file from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your actual API keys!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run the server: python app.py"
echo "   or: uvicorn app:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "API will be available at: http://localhost:8000"
echo "API documentation at: http://localhost:8000/docs"
echo ""
echo "Don't forget to update your .env file with the correct API keys!"
