/**
 * Test script for reorder endpoints
 */

const API_BASE_URL = 'http://localhost:3001';

// Test data
const testCredentials = {
  email: 'admin@test.com',
  password: 'password123'
};

async function login() {
  console.log('=== Testing Login ===');
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCredentials),
  });

  if (!response.ok) {
    console.error('❌ Login failed');
    return null;
  }

  const data = await response.json();
  console.log('✅ Login successful');
  return data.token;
}

async function testCategoriesReorder(token) {
  console.log('\n=== Testing Categories Reorder ===');
  
  // Get categories first
  const getResponse = await fetch(`${API_BASE_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!getResponse.ok) {
    console.error('❌ Failed to get categories');
    return;
  }

  const categories = await getResponse.json();
  console.log(`📋 Found ${categories.length} categories`);
  console.log('Categories:', categories.map(c => `${c.name} (priority: ${c.priority})`).join(', '));

  if (categories.length < 2) {
    console.log('⚠️  Need at least 2 categories to test reorder');
    return;
  }

  // Test reorder: move first category to last position
  const firstCategory = categories[0];
  const toIndex = categories.length - 1;

  console.log(`\n🔄 Reordering: ${firstCategory.name} from index 0 to index ${toIndex}`);

  const reorderResponse = await fetch(`${API_BASE_URL}/categories/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fromIndex: 0,
      toIndex,
      categoryId: firstCategory.id,
    }),
  });

  if (!reorderResponse.ok) {
    console.error('❌ Categories reorder failed');
    const error = await reorderResponse.json();
    console.error('Error:', error);
    return;
  }

  const updatedCategories = await reorderResponse.json();
  console.log('✅ Categories reorder successful');
  console.log('Updated categories:', updatedCategories.map(c => `${c.name} (priority: ${c.priority})`).join(', '));
}

async function testProductsReorder(token) {
  console.log('\n=== Testing Products Reorder ===');
  
  // Get products first
  const getResponse = await fetch(`${API_BASE_URL}/products?mode=interleaved`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!getResponse.ok) {
    console.error('❌ Failed to get products');
    return;
  }

  const products = await getResponse.json();
  console.log(`📋 Found ${products.length} products`);
  console.log('Products:', products.map(p => `${p.name} (globalOrder: ${p.globalOrder})`).join(', '));

  // Filter products with valid globalOrder
  const orderedProducts = products.filter(p => p.globalOrder !== null);
  console.log(`📋 Products with valid order: ${orderedProducts.length}`);

  if (orderedProducts.length < 2) {
    console.log('⚠️  Need at least 2 products with valid order to test reorder');
    return;
  }

  // Test reorder: move first product to last position
  const firstProduct = orderedProducts[0];
  const toIndex = orderedProducts.length - 1;

  console.log(`\n🔄 Reordering: ${firstProduct.name} from index 0 to index ${toIndex}`);

  const reorderResponse = await fetch(`${API_BASE_URL}/products/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mode: 'interleaved',
      fromIndex: 0,
      toIndex,
      productId: firstProduct.id,
    }),
  });

  if (!reorderResponse.ok) {
    console.error('❌ Products reorder failed');
    const error = await reorderResponse.json();
    console.error('Error:', error);
    return;
  }

  const updatedProducts = await reorderResponse.json();
  console.log('✅ Products reorder successful');
  console.log('Updated products:', updatedProducts.map(p => `${p.name} (globalOrder: ${p.globalOrder})`).join(', '));
}

async function main() {
  console.log('🧪 Starting Reorder Endpoint Tests\n');

  const token = await login();
  if (!token) {
    console.error('❌ Cannot proceed without token');
    process.exit(1);
  }

  await testCategoriesReorder(token);
  await testProductsReorder(token);

  console.log('\n✅ All tests completed');
}

main().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
