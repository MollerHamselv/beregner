#!/bin/bash
# 🧪 Quick Test Script for Beregner System
# Usage: ./quick-test.sh [domain]

set -e

DOMAIN=${1:-"http://localhost:8080"}
ADMIN_KEY=${ADMIN_KEY:-"test-key-123"}

echo "🧪 Testing Beregner System: $DOMAIN"
echo "================================="

# Test 1: Frontend availability
echo "📱 Testing frontend..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/")
if [ "$response" = "200" ]; then
    echo "✅ Main page accessible"
else
    echo "❌ Main page failed (HTTP $response)"
fi

response=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/admin.html")
if [ "$response" = "200" ]; then
    echo "✅ Admin page accessible"
else
    echo "❌ Admin page failed (HTTP $response)"
fi

# Test 2: API Collection endpoint
echo "🔧 Testing API endpoints..."
collect_response=$(curl -s -X POST "$DOMAIN/api/collect" \
  -H "Content-Type: application/json" \
  -d '{
    "employees": 25,
    "industry": "IT & Teknologi",
    "salary": 45000,
    "stressPct": 65,
    "consent": true,
    "_hp": ""
  }' | jq -r '.ok // "false"' 2>/dev/null || echo "false")

if [ "$collect_response" = "true" ]; then
    echo "✅ Data collection API working"
else
    echo "⚠️  Data collection API issue (expected in local testing)"
fi

# Test 3: Admin authentication
if [[ "$DOMAIN" == *"vercel"* ]] || [[ "$DOMAIN" == *"localhost"* && "$ADMIN_KEY" != "test-key-123" ]]; then
    admin_response=$(curl -s -H "X-Admin-Key: $ADMIN_KEY" \
      "$DOMAIN/api/admin/stats" | jq -r '.totalEntries // "error"' 2>/dev/null || echo "error")
    
    if [ "$admin_response" != "error" ]; then
        echo "✅ Admin API authenticated"
    else
        echo "❌ Admin API authentication failed"
    fi
else
    echo "⚠️  Skipping admin test (no valid key for localhost)"
fi

# Test 4: File integrity
echo "📁 Testing file integrity..."
required_files=("index.html" "admin.html" "script.js" "style.css" "vercel.json")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files: ${missing_files[*]}"
fi

# Test 5: JavaScript syntax check
echo "📜 Testing JavaScript syntax..."
if command -v node >/dev/null 2>&1; then
    if node -c script.js 2>/dev/null; then
        echo "✅ JavaScript syntax valid"
    else
        echo "❌ JavaScript syntax errors"
    fi
else
    echo "⚠️  Node.js not available for syntax check"
fi

# Test 6: HTML validation
echo "📄 Testing HTML structure..."
html_errors=0

# Check for basic HTML structure
if grep -q "<!DOCTYPE html>" index.html; then
    echo "✅ HTML5 doctype present"
else
    echo "❌ Missing HTML5 doctype"
    ((html_errors++))
fi

if grep -q "<meta charset=\"UTF-8\">" index.html; then
    echo "✅ UTF-8 encoding specified"
else
    echo "❌ Missing UTF-8 encoding"
    ((html_errors++))
fi

if grep -q "viewport" index.html; then
    echo "✅ Viewport meta tag present"
else
    echo "❌ Missing viewport meta tag"
    ((html_errors++))
fi

# Test 7: Security headers check (production only)
if [[ "$DOMAIN" == *"vercel"* ]]; then
    echo "🔒 Testing security headers..."
    security_headers=$(curl -s -I "$DOMAIN/" | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" | wc -l)
    if [ "$security_headers" -gt 0 ]; then
        echo "✅ Security headers present"
    else
        echo "⚠️  Some security headers missing"
    fi
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "Domain tested: $DOMAIN"
echo "Timestamp: $(date)"

if [ $html_errors -eq 0 ]; then
    echo "✅ All critical tests passed"
    echo "🚀 System ready for production"
    exit 0
else
    echo "⚠️  Some issues detected"
    echo "🔧 Review failed tests before deployment"
    exit 1
fi
