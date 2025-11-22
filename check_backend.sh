#!/bin/bash
# Quick diagnostic script for backend connection issues

echo "=== Backend Connection Diagnostic ==="
echo ""

echo "1. Checking backend container status..."
docker compose ps backend
echo ""

echo "2. Checking backend logs (last 20 lines)..."
docker compose logs backend --tail=20
echo ""

echo "3. Testing backend from inside container..."
docker compose exec backend curl -s http://localhost:8000/health || echo "FAILED: Backend not responding inside container"
echo ""

echo "4. Testing backend from host..."
curl -s http://localhost:8000/health || echo "FAILED: Backend not accessible from host"
echo ""

echo "5. Checking if port 8000 is listening..."
sudo netstat -tlnp | grep 8000 || sudo ss -tlnp | grep 8000 || echo "Port 8000 not found in listening ports"
echo ""

echo "6. Checking backend environment variables..."
docker compose exec backend env | grep -E "HOST|PORT" || echo "Environment variables not found"
echo ""

echo "=== Diagnostic Complete ==="
echo ""
echo "If backend is not accessible:"
echo "1. Check logs above for errors"
echo "2. Verify firewall rules allow port 8000"
echo "3. Try: docker compose restart backend"
echo "4. Try: docker compose up -d --build backend"


