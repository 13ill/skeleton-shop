# Test Script for Jump-1 Backend API
# Run this script after starting the backend server on port 3001

$baseUrl = "http://localhost:3001"

Write-Host "=== Testing Jump-1 Backend API ===" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1. Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "✓ Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Register User
Write-Host "2. Register User" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@test.com"
        password = "password123"
        name = "Admin User"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ User registered: $($response.user.email)" -ForegroundColor Green
    $token = $response.token
    Write-Host "✓ Token: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    # Try login if register fails (user might already exist)
    try {
        $body = @{
            email = "admin@test.com"
            password = "password123"
        } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✓ Login successful: $($response.user.email)" -ForegroundColor Green
        $token = $response.token
    } catch {
        Write-Host "✗ Login also failed: $_" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Get All Products
Write-Host "3. Get All Products" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    Write-Host "✓ Found $($response.Count) products" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Get Product by ID
Write-Host "4. Get Product by ID (Gem4)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products/Gem4" -Method Get
    Write-Host "✓ Product: $($response.name)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Create Product (requires auth)
Write-Host "5. Create Product (requires auth)" -ForegroundColor Yellow
if ($token) {
    try {
        $body = @{
            id = "test-product-1"
            name = "Test Product"
            category = "ring"
            price = 1000
            description = "Test description"
            fullDescription = "Test full description"
            material = "Gold"
            specifications = @{
                size = "Medium"
            }
            images = @("/placeholder.jpg")
        } | ConvertTo-Json -Depth 10
        $headers = @{
            Authorization = "Bearer $token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "✓ Product created: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Skipped (no token)" -ForegroundColor Yellow
}
Write-Host ""

# 6. Update Product (requires auth)
Write-Host "6. Update Product (requires auth)" -ForegroundColor Yellow
if ($token) {
    try {
        $body = @{
            name = "Test Product Updated"
            price = 1500
        } | ConvertTo-Json
        $headers = @{
            Authorization = "Bearer $token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/products/test-product-1" -Method Put -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "✓ Product updated: $($response.name)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Skipped (no token)" -ForegroundColor Yellow
}
Write-Host ""

# 7. Delete Product (requires auth)
Write-Host "7. Delete Product (requires auth)" -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/products/test-product-1" -Method Delete -Headers $headers
        Write-Host "✓ Product deleted" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Skipped (no token)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
