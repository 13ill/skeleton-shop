/**
 * Product service - handles data fetching for products
 * Currently uses static JSON files, will switch to API in production
 */

import { env } from '../config/env';
import type { Product, ProductWithImages, Category } from '../types/product';

// Product directories (static JSON)
const PRODUCT_BASE_PATH = '/Product';

// Get all product directories
async function getProductDirectories(): Promise<string[]> {
  try {
    const response = await fetch(`${PRODUCT_BASE_PATH}/.template/product.json`);
    if (!response.ok) {
      // Fallback: try to list known directories
      return ['GEM1', 'gem2', 'gem3', 'Gem4', 'Gem5', 'Gem6'];
    }
    return [];
  } catch {
    // Fallback list
    return ['GEM1', 'gem2', 'gem3', 'Gem4', 'Gem5', 'Gem6'];
  }
}

// Get product images from directory
async function getProductImages(productId: string): Promise<string[]> {
  const images: string[] = [];
  
  // Try to find images with common naming patterns
  const commonNames = ['main.jpg', 'main.png', '1.jpg', '1.png', 'image.jpg', 'image.png'];
  
  for (const name of commonNames) {
    try {
      const response = await fetch(`${PRODUCT_BASE_PATH}/${productId}/${name}`);
      if (response.ok) {
        images.push(`${PRODUCT_BASE_PATH}/${productId}/${name}`);
      }
    } catch {
      // Continue to next image
    }
  }
  
  // If no images found, return placeholder
  if (images.length === 0) {
    images.push('/placeholder.jpg');
  }
  
  return images;
}

// Get all products
export async function getAllProducts(): Promise<ProductWithImages[]> {
  // If API is configured, use it
  if (env.API_BASE_URL) {
    try {
      const response = await fetch(`${env.API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API fetch failed, falling back to static:', error);
    }
  }

  // Fallback to static JSON
  const directories = await getProductDirectories();
  const products: ProductWithImages[] = [];

  for (const dir of directories) {
    try {
      const response = await fetch(`${PRODUCT_BASE_PATH}/${dir}/product.json`);
      if (!response.ok) continue;
      
      const product: Product = await response.json();
      const images = await getProductImages(dir);
      
      products.push({ ...product, images });
    } catch (error) {
      console.error(`Failed to load product ${dir}:`, error);
    }
  }

  return products;
}

// Get product by ID
export async function getProductById(id: string): Promise<ProductWithImages | null> {
  // If API is configured, use it
  if (env.API_BASE_URL) {
    try {
      const response = await fetch(`${env.API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('API fetch failed, falling back to static:', error);
    }
  }

  // Fallback to static JSON
  try {
    const response = await fetch(`${PRODUCT_BASE_PATH}/${id}/product.json`);
    if (!response.ok) return null;
    
    const product: Product = await response.json();
    const images = await getProductImages(id);
    
    return { ...product, images };
  } catch (error) {
    console.error(`Failed to load product ${id}:`, error);
    return null;
  }
}

// Get products by category
export async function getProductsByCategory(category: Category): Promise<ProductWithImages[]> {
  const allProducts = await getAllProducts();
  
  if (category === 'all') {
    return allProducts;
  }
  
  return allProducts.filter(p => p.category === category);
}

// Get products with display mode
export async function getProductsWithMode(mode: 'interleaved' | 'grouped'): Promise<ProductWithImages[]> {
  // If API is configured, use it
  if (env.API_BASE_URL) {
    try {
      const response = await fetch(`${env.API_BASE_URL}/products?mode=${mode}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API fetch failed, falling back to static:', error);
    }
  }

  // Fallback to static JSON (no interleaved support)
  const allProducts = await getAllProducts();
  
  if (mode === 'grouped') {
    return allProducts;
  }
  
  // For interleaved mode with static data, just return all products
  // (true interleaved requires database)
  return allProducts;
}

// Get product counts by category (dynamic — รองรับ category ใหม่ที่เพิ่มจาก admin)
// ใช้ getProductsWithMode('interleaved') ให้ตรงกับที่หน้า Home แสดงจริง
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const allProducts = await getProductsWithMode('interleaved');

  const counts: Record<string, number> = { all: allProducts.length };

  for (const product of allProducts) {
    const cat = product.category;
    if (!cat) continue;
    counts[cat] = (counts[cat] || 0) + 1;
  }

  return counts;
}
