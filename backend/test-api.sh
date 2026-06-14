#!/bin/bash
# Test Script for Jump-1 Backend API
# Run this script after starting the backend server on port 3001

BASE_URL="http://localhost:3001"

echo "=== Testing Jump-1 Backend API ==="
echo ""

# 1. Health Check
echo "1. Health Check"
curl -s "$BASE_URL/" | head -c 200
echo ""
echo ""

# 2. Register User
echo "2. Register User"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","name":"Admin User"}')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
  echo "✓ User registered successfully"
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "✓ Token: ${TOKEN:0:20}..."
else
  echo "✗ Register failed, trying login..."
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"password123"}')
  
  if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✓ Login successful"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "✓ Token: ${TOKEN:0:20}..."
  else
    echo "✗ Login also failed"
    TOKEN=""
  fi
fi
echo ""

# 3. Get All Products
echo "3. Get All Products"
curl -s "$BASE_URL/products" | head -c 200
echo ""
echo ""

# 4. Get Product by ID
echo "4. Get Product by ID (Gem4)"
curl -s "$BASE_URL/products/Gem4" | head -c 200
echo ""
echo ""

# 5. Create Product (requires auth)
echo "5. Create Product (requires auth)"
if [ -n "$TOKEN" ]; then
  CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/products" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "id":"test-product-1",
      "name":"Test Product",
      "category":"ring",
      "price":1000,
      "description":"Test description",
      "fullDescription":"Test full description",
      "material":"Gold",
      "specifications":{"size":"Medium"},
      "images":["/placeholder.jpg"]
    }')
  
  if echo "$CREATE_RESPONSE" | grep -q "name"; then
    echo "✓ Product created successfully"
  else
    echo "✗ Create failed"
  fi
else
  echo "✗ Skipped (no token)"
fi
echo ""

# 6. Update Product (requires auth)
echo "6. Update Product (requires auth)"
if [ -n "$TOKEN" ]; then
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/products/test-product-1" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"name":"Test Product Updated","price":1500}')
  
  if echo "$UPDATE_RESPONSE" | grep -q "name"; then
    echo "✓ Product updated successfully"
  else
    echo "✗ Update failed"
  fi
else
  echo "✗ Skipped (no token)"
fi
echo ""

# 7. Delete Product (requires auth)
echo "7. Delete Product (requires auth)"
if [ -n "$TOKEN" ]; then
  DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/products/test-product-1" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$DELETE_RESPONSE" | grep -q "deleted"; then
    echo "✓ Product deleted successfully"
  else
    echo "✗ Delete failed"
  fi
else
  echo "✗ Skipped (no token)"
fi
echo ""

echo "=== Test Complete ==="
