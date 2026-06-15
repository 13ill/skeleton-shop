/**
 * Performance test script for Jump-1
 * Tests API response times and measures performance metrics
 */

const API_BASE_URL = 'http://localhost:3001';

// Performance measurement utilities
function measureTime(fn) {
  const start = performance.now();
  return fn().then(result => {
    const end = performance.now();
    return { result, time: end - start };
  });
}

function formatTime(ms) {
  return ms.toFixed(2) + 'ms';
}

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  healthCheck: 100,
  getProducts: 500,
  getProductsInterleaved: 500,
  getProductsGrouped: 500,
  getProductById: 200,
  getCategories: 200,
  imageServing: 1000,
  reorderCategory: 1000,
  reorderProduct: 1000,
};

// Test helper functions
async function testPerformance(name, testFn, threshold) {
  try {
    console.log(`\n⚡ Testing: ${name}`);
    const { result, time } = await measureTime(testFn);
    const passed = time <= threshold;
    
    console.log(`   Time: ${formatTime(time)}`);
    console.log(`   Threshold: ${threshold}ms`);
    console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!passed) {
      console.log(`   ⚠️  Exceeded threshold by ${formatTime(time - threshold)}`);
    }
    
    return { passed, time, threshold };
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    return { passed: false, time: Infinity, threshold };
  }
}

// Performance test cases
async function testHealthCheckPerformance() {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) throw new Error('Health check failed');
  return await response.json();
}

async function testGetProductsPerformance() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return await response.json();
}

async function testGetProductsInterleavedPerformance() {
  const response = await fetch(`${API_BASE_URL}/products?mode=interleaved`);
  if (!response.ok) throw new Error('Failed to fetch products in interleaved mode');
  return await response.json();
}

async function testGetProductsGroupedPerformance() {
  const response = await fetch(`${API_BASE_URL}/products?mode=grouped`);
  if (!response.ok) throw new Error('Failed to fetch products in grouped mode');
  return await response.json();
}

async function testGetProductByIdPerformance() {
  const response = await fetch(`${API_BASE_URL}/products/GEM1`);
  if (!response.ok) throw new Error('Failed to fetch product by ID');
  return await response.json();
}

async function testGetCategoriesPerformance() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
}

async function testImageServingPerformance() {
  const response = await fetch(`${API_BASE_URL}/Product/GEM1/S__18235446_0_0.jpg`);
  if (!response.ok) throw new Error('Failed to fetch image');
  return response.blob();
}

async function testReorderCategoryPerformance() {
  // First, get auth token (this would normally come from login)
  // For performance testing, we'll skip auth and measure the endpoint directly
  const response = await fetch(`${API_BASE_URL}/categories/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Note: This will fail without auth, but we're measuring the response time
    },
    body: JSON.stringify({
      fromIndex: 0,
      toIndex: 1,
      categoryId: 'test-id',
    }),
  });
  // We expect this to fail due to auth, but we're measuring response time
  return response;
}

async function testReorderProductPerformance() {
  const response = await fetch(`${API_BASE_URL}/products/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Note: This will fail without auth, but we're measuring the response time
    },
    body: JSON.stringify({
      mode: 'interleaved',
      fromIndex: 0,
      toIndex: 1,
      productId: 'GEM1',
    }),
  });
  // We expect this to fail due to auth, but we're measuring response time
  return response;
}

// Load test helper
async function loadTest(endpoint, concurrency, requests) {
  console.log(`\n🔥 Load Testing: ${endpoint}`);
  console.log(`   Concurrency: ${concurrency}`);
  console.log(`   Total Requests: ${requests}`);
  
  const results = [];
  const startTime = performance.now();
  
  for (let i = 0; i < requests; i++) {
    const batch = [];
    for (let j = 0; j < concurrency && i * concurrency + j < requests; j++) {
      batch.push(
        fetch(endpoint)
          .then(response => ({ status: response.status, success: response.ok }))
          .catch(error => ({ status: 0, success: false, error: error.message }))
      );
    }
    
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    if (results.length >= requests) break;
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const avgTime = totalTime / results.length;
  const requestsPerSecond = (results.length / totalTime) * 1000;
  
  console.log(`   Total Time: ${formatTime(totalTime)}`);
  console.log(`   Successful: ${successful}/${results.length}`);
  console.log(`   Failed: ${failed}/${results.length}`);
  console.log(`   Average Time: ${formatTime(avgTime)}`);
  console.log(`   Requests/Second: ${requestsPerSecond.toFixed(2)}`);
  
  return {
    total: results.length,
    successful,
    failed,
    avgTime,
    requestsPerSecond,
  };
}

// Memory usage helper
function getMemoryUsage() {
  if (process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`,
    };
  }
  return null;
}

// Run all performance tests
async function runPerformanceTests() {
  console.log('🚀 Starting Performance Tests');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  
  const memoryBefore = getMemoryUsage();
  if (memoryBefore) {
    console.log(`💾 Memory Before: ${memoryBefore.heapUsed} / ${memoryBefore.heapTotal}`);
  }
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheckPerformance, threshold: THRESHOLDS.healthCheck },
    { name: 'Get Products', fn: testGetProductsPerformance, threshold: THRESHOLDS.getProducts },
    { name: 'Get Products (Interleaved)', fn: testGetProductsInterleavedPerformance, threshold: THRESHOLDS.getProductsInterleaved },
    { name: 'Get Products (Grouped)', fn: testGetProductsGroupedPerformance, threshold: THRESHOLDS.getProductsGrouped },
    { name: 'Get Product by ID', fn: testGetProductByIdPerformance, threshold: THRESHOLDS.getProductById },
    { name: 'Get Categories', fn: testGetCategoriesPerformance, threshold: THRESHOLDS.getCategories },
    { name: 'Image Serving', fn: testImageServingPerformance, threshold: THRESHOLDS.imageServing },
    { name: 'Reorder Category (Auth Required)', fn: testReorderCategoryPerformance, threshold: THRESHOLDS.reorderCategory },
    { name: 'Reorder Product (Auth Required)', fn: testReorderProductPerformance, threshold: THRESHOLDS.reorderProduct },
  ];
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  for (const test of tests) {
    const result = await testPerformance(test.name, test.fn, test.threshold);
    results.push({ ...test, ...result });
    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Load tests
  console.log('\n🔥 Load Tests');
  await loadTest(`${API_BASE_URL}/products`, 5, 20);
  await loadTest(`${API_BASE_URL}/categories`, 5, 20);
  
  const memoryAfter = getMemoryUsage();
  if (memoryAfter) {
    console.log(`\n💾 Memory After: ${memoryAfter.heapUsed} / ${memoryAfter.heapTotal}`);
  }
  
  // Summary
  console.log('\n📊 Performance Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  
  // Detailed results
  console.log('\n📋 Detailed Results:');
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    const diff = result.passed ? '' : ` (+${formatTime(result.time - result.threshold)})`;
    console.log(`   ${status} ${result.name}: ${formatTime(result.time)}${diff}`);
  });
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  results.forEach(result => {
    if (!result.passed) {
      console.log(`   ⚠️  ${result.name} exceeded threshold of ${result.threshold}ms`);
      console.log(`      Consider: Caching, database indexing, or query optimization`);
    }
  });
  
  if (failed === 0) {
    console.log('\n🎉 All performance tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some performance tests failed');
    process.exit(1);
  }
}

// Run performance tests
runPerformanceTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
