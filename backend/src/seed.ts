import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Read product JSON files from public/Product directory
function loadProductsFromJson() {
  const productDir = join(process.cwd(), '../public/Product');
  const products: any[] = [];

  try {
    const directories = readdirSync(productDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => dirent.name !== '.template')
      .map(dirent => dirent.name);

    for (const dir of directories) {
      try {
        const productJsonPath = join(productDir, dir, 'product.json');
        const productData = JSON.parse(readFileSync(productJsonPath, 'utf-8'));
        
        // Get images from directory
        const images: string[] = [];
        try {
          const files = readdirSync(join(productDir, dir));
          const imageFiles = files.filter(f => 
            f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg')
          );
          for (const file of imageFiles) {
            images.push(`/Product/${dir}/${file}`);
          }
        } catch {
          // If directory read fails, skip images
        }

        products.push({
          id: productData.id,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          description: productData.description,
          fullDescription: productData.fullDescription || productData.description,
          material: productData.material,
          specifications: productData.specifications || {},
          images: images.length > 0 ? images : [productData.image || '/placeholder.jpg'],
        });
      } catch (error) {
        console.error(`Failed to load product from ${dir}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to read product directory:', error);
  }

  return products;
}

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.product.deleteMany();
  console.log('Cleared existing products');

  // Load products from JSON
  const products = loadProductsFromJson();
  console.log(`Found ${products.length} products from JSON files`);

  // Insert products
  for (const product of products) {
    try {
      await prisma.product.create({
        data: product,
      });
      console.log(`Created product: ${product.id}`);
    } catch (error) {
      console.error(`Failed to create product ${product.id}:`, error);
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
