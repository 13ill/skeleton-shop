/**
 * Frontend test script for Jump-1
 * Tests API endpoints and data fetching
 */

const API_BASE_URL = 'http://localhost:3001';

// Test helper functions
async function testAPI(name, testFn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    const result = await testFn();
    console.log(`✅ PASSED: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

// Test cases
async function testHealthCheck() {
  const response = await fetch(`${API_BASE_URL}/`);
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error('Health check failed');
  }
}

async function testGetProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Products should be a non-empty array');
  }
  console.log(`   Found ${data.length} products`);
}

async function testGetProductsInterleaved() {
  const response = await fetch(`${API_BASE_URL}/products?mode=interleaved`);
  if (!response.ok) {
    throw new Error('Failed to fetch products in interleaved mode');
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Products should be an array');
  }
  console.log(`   Found ${data.length} products in interleaved mode`);
}

async function testGetProductsGrouped() {
  const response = await fetch(`${API_BASE_URL}/products?mode=grouped`);
  if (!response.ok) {
    throw new Error('Failed to fetch products in grouped mode');
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Products should be an array');
  }
  console.log(`   Found ${data.length} products in grouped mode`);
}

async function testGetProductById() {
  const response = await fetch(`${API_BASE_URL}/products/GEM1`);
  if (!response.ok) {
    throw new Error('Failed to fetch product by ID');
  }
  const data = await response.json();
  if (!data.id || !data.name) {
    throw new Error('Product should have id and name');
  }
  console.log(`   Product: ${data.name}`);
}

async function testGetCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Categories should be a non-empty array');
  }
  console.log(`   Found ${data.length} categories`);
}

async function testImageServing() {
  const response = await fetch(`${API_BASE_URL}/Product/GEM1/S__18235446_0_0.jpg`);
  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }
  const contentType = response.headers.get('Content-Type');
  if (!contentType || !contentType.startsWith('image/')) {
    throw new Error('Response should be an image');
  }
  console.log(`   Content-Type: ${contentType}`);
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Frontend Tests');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Get Products (Interleaved)', fn: testGetProductsInterleaved },
    { name: 'Get Products (Grouped)', fn: testGetProductsGrouped },
    { name: 'Get Product by ID', fn: testGetProductById },
    { name: 'Get Categories', fn: testGetCategories },
    { name: 'Image Serving', fn: testImageServing },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testAPI(test.name, test.fn);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
