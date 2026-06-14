// Test Script for Jump-1 Backend API
// Run: node test-api.js

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('=== Testing Jump-1 Backend API ===\n');

  let token = '';

  // 1. Health Check
  console.log('1. Health Check');
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    console.log(`✓ Status: ${data.status}\n`);
  } catch (error) {
    console.log(`✗ Failed: ${error.message}\n`);
  }

  // 2. Register User
  console.log('2. Register User');
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User'
      })
    });
    const data = await response.json();
    if (data.token) {
      console.log(`✓ User registered: ${data.user.email}`);
      token = data.token;
      console.log(`✓ Token: ${token.substring(0, 20)}...\n`);
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  } catch (error) {
    console.log(`✗ Register failed: ${error.message}`);
    // Try login
    console.log('Trying login...');
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@test.com',
          password: 'password123'
        })
      });
      const data = await response.json();
      if (data.token) {
        console.log(`✓ Login successful: ${data.user.email}`);
        token = data.token;
        console.log(`✓ Token: ${token.substring(0, 20)}...\n`);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (loginError) {
      console.log(`✗ Login also failed: ${loginError.message}\n`);
    }
  }

  // 3. Get All Products
  console.log('3. Get All Products');
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    console.log(`✓ Found ${data.length} products\n`);
  } catch (error) {
    console.log(`✗ Failed: ${error.message}\n`);
  }

  // 4. Get Product by ID
  console.log('4. Get Product by ID (Gem4)');
  try {
    const response = await fetch(`${BASE_URL}/products/Gem4`);
    const data = await response.json();
    console.log(`✓ Product: ${data.name}\n`);
  } catch (error) {
    console.log(`✗ Failed: ${error.message}\n`);
  }

  // 5. Create Product (requires auth)
  console.log('5. Create Product (requires auth)');
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: 'test-product-1',
          name: 'Test Product',
          category: 'ring',
          price: 1000,
          description: 'Test description',
          fullDescription: 'Test full description',
          material: 'Gold',
          specifications: { size: 'Medium' },
          images: ['/placeholder.jpg']
        })
      });
      const data = await response.json();
      console.log(`✓ Product created: ${data.name}\n`);
    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
    }
  } else {
    console.log('✗ Skipped (no token)\n');
  }

  // 6. Update Product (requires auth)
  console.log('6. Update Product (requires auth)');
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/products/test-product-1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Test Product Updated',
          price: 1500
        })
      });
      const data = await response.json();
      console.log(`✓ Product updated: ${data.name}\n`);
    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
    }
  } else {
    console.log('✗ Skipped (no token)\n');
  }

  // 7. Delete Product (requires auth)
  console.log('7. Delete Product (requires auth)');
  if (token) {
    try {
      const response = await fetch(`${BASE_URL}/products/test-product-1`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(`✓ Product deleted\n`);
    } catch (error) {
      console.log(`✗ Failed: ${error.message}\n`);
    }
  } else {
    console.log('✗ Skipped (no token)\n');
  }

  console.log('=== Test Complete ===');
}

testAPI().catch(console.error);
