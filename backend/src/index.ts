import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

dotenv.config();

const prisma = new PrismaClient();
const app = new Hono();

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.get('/uploads/:filename', (c) => {
  const filename = c.req.param('filename');
  const filepath = join(uploadsDir, filename);

  if (!existsSync(filepath)) {
    return c.json({ error: 'File not found' }, 404);
  }

  const file = readFileSync(filepath);
  const ext = filename.split('.').pop();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };

  c.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  return c.body(file);
});

// Serve static files from Product directory
app.get('/Product/:category/:filename', (c) => {
  const category = c.req.param('category');
  const filename = c.req.param('filename');
  const filepath = join(uploadsDir, 'Product', category, filename);

  if (!existsSync(filepath)) {
    return c.json({ error: 'File not found' }, 404);
  }

  const file = readFileSync(filepath);
  const ext = filename.split('.').pop();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };

  c.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  return c.body(file);
});

// Auth middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('userId', decoded.userId);
  c.set('email', decoded.email);
  await next();
};

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Jump-1 API is running' });
});

// Auth: Register
app.post('/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email,
      },
    });

    const token = generateToken(user.id, user.email);
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

// Auth: Login
app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = generateToken(user.id, user.email);
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

// Get product by ID
app.get('/products/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    return c.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Get products by category
app.get('/products/category/:category', async (c) => {
  const category = c.req.param('category');
  try {
    const products = await prisma.product.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Create product (requires auth)
app.post('/products', authMiddleware, async (c) => {
  try {
    const { id, name, category, price, description, fullDescription, material, materials, specifications, images } = await c.req.json();

    if (!id || !name || !category) {
      return c.json({ error: 'ID, name, and category are required' }, 400);
    }

    const product = await prisma.product.create({
      data: {
        id,
        name,
        category,
        price: price || null,
        description,
        fullDescription: fullDescription || description,
        material,
        specifications: specifications || null,
        images: images || [],
      },
    });

    return c.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Reorder product by moving from one position to another (requires auth)
app.put('/products/reorder', authMiddleware, async (c) => {
  try {
    const { mode, fromIndex, toIndex, productId } = await c.req.json();

    if (!mode || fromIndex === undefined || toIndex === undefined || !productId) {
      return c.json({ error: 'Mode, fromIndex, toIndex, and productId are required' }, 400);
    }

    // Fetch all products with current order
    const products = await prisma.product.findMany({
      orderBy: mode === 'interleaved' ? { globalOrder: 'asc' } : { categoryOrder: 'asc' },
    });

    // Filter out products without order (null values)
    const orderedProducts = products.filter(p => 
      mode === 'interleaved' ? p.globalOrder !== null : p.categoryOrder !== null
    );

    // Find the product to move
    const productIndex = orderedProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return c.json({ error: 'Product not found or has no order' }, 404);
    }

    // Remove from old position and insert at new position
    const [movedProduct] = orderedProducts.splice(productIndex, 1);
    orderedProducts.splice(toIndex, 0, movedProduct);

    // Update all orders in a transaction
    const updatedProducts = await prisma.$transaction(
      orderedProducts.map((product, index) => {
        const data = mode === 'interleaved' 
          ? { globalOrder: index + 1 }
          : { categoryOrder: index + 1 };
        
        return prisma.product.update({
          where: { id: product.id },
          data,
        });
      })
    );

    return c.json(updatedProducts);
  } catch (error) {
    console.error('Error reordering products:', error);
    return c.json({ error: 'Failed to reorder products' }, 500);
  }
});

// Update product (requires auth)
app.put('/products/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const { name, category, price, description, fullDescription, material, materials, specifications, images } = await c.req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(price !== undefined && { price }),
        ...(description && { description }),
        ...(fullDescription && { fullDescription }),
        ...(material && { material }),
        ...(specifications && { specifications }),
        ...(images && { images }),
      },
    });

    return c.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product (requires auth)
app.delete('/products/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    await prisma.product.delete({
      where: { id },
    });
    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Get all categories (ordered by priority)
app.get('/categories', async (c) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { priority: 'asc' },
    });
    return c.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Create category (requires auth)
app.post('/categories', authMiddleware, async (c) => {
  try {
    const { name, slug, priority } = await c.req.json();

    if (!name || !slug) {
      return c.json({ error: 'Name and slug are required' }, 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        priority: priority || 0,
      },
    });

    return c.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Update category priority (requires auth)
app.put('/categories/:id/priority', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const { priority } = await c.req.json();

    const category = await prisma.category.update({
      where: { id },
      data: { priority },
    });

    return c.json(category);
  } catch (error) {
    console.error('Error updating category priority:', error);
    return c.json({ error: 'Failed to update category priority' }, 500);
  }
});

// Update product global order (requires auth)
app.put('/products/:id/globalOrder', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const { globalOrder } = await c.req.json();

    const product = await prisma.product.update({
      where: { id },
      data: { globalOrder },
    });

    return c.json(product);
  } catch (error) {
    console.error('Error updating product global order:', error);
    return c.json({ error: 'Failed to update product global order' }, 500);
  }
});

// Update product category order (requires auth)
app.put('/products/:id/categoryOrder', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const { categoryOrder } = await c.req.json();

    const product = await prisma.product.update({
      where: { id },
      data: { categoryOrder },
    });

    return c.json(product);
  } catch (error) {
    console.error('Error updating product category order:', error);
    return c.json({ error: 'Failed to update product category order' }, 500);
  }
});

// Reorder category by moving from one position to another (requires auth)
app.put('/categories/reorder', authMiddleware, async (c) => {
  try {
    const { fromIndex, toIndex, categoryId } = await c.req.json();

    if (fromIndex === undefined || toIndex === undefined || !categoryId) {
      return c.json({ error: 'fromIndex, toIndex, and categoryId are required' }, 400);
    }

    // Fetch all categories with current priority
    const categories = await prisma.category.findMany({
      orderBy: { priority: 'asc' },
    });

    // Find the category to move
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
      return c.json({ error: 'Category not found' }, 404);
    }

    // Remove from old position and insert at new position
    const [movedCategory] = categories.splice(categoryIndex, 1);
    categories.splice(toIndex, 0, movedCategory);

    // Update all priorities in a transaction
    const updatedCategories = await prisma.$transaction(
      categories.map((category, index) => {
        return prisma.category.update({
          where: { id: category.id },
          data: { priority: index + 1 },
        });
      })
    );

    return c.json(updatedCategories);
  } catch (error) {
    console.error('Error reordering categories:', error);
    return c.json({ error: 'Failed to reorder categories' }, 500);
  }
});

// Bulk update category priorities (requires auth)
app.put('/categories/bulk-priority', authMiddleware, async (c) => {
  try {
    const { priorities } = await c.req.json();

    if (!Array.isArray(priorities)) {
      return c.json({ error: 'Priorities array is required' }, 400);
    }

    // Update all priorities in a transaction
    const updatedCategories = await prisma.$transaction(
      priorities.map((priority: { id: string; priority: number }) => {
        return prisma.category.update({
          where: { id: priority.id },
          data: { priority: priority.priority },
        });
      })
    );

    return c.json(updatedCategories);
  } catch (error) {
    console.error('Error bulk updating category priorities:', error);
    return c.json({ error: 'Failed to bulk update category priorities' }, 500);
  }
});

// Bulk update product orders (requires auth)
app.put('/products/bulk-order', authMiddleware, async (c) => {
  try {
    const { mode, orders } = await c.req.json();

    if (!mode || !Array.isArray(orders)) {
      return c.json({ error: 'Mode and orders array are required' }, 400);
    }

    // Update all orders in a transaction
    const updatedProducts = await prisma.$transaction(
      orders.map((order: { id: string; order: number }) => {
        const data = mode === 'interleaved' 
          ? { globalOrder: order.order }
          : { categoryOrder: order.order };
        
        return prisma.product.update({
          where: { id: order.id },
          data,
        });
      })
    );

    return c.json(updatedProducts);
  } catch (error) {
    console.error('Error bulk updating product orders:', error);
    return c.json({ error: 'Failed to bulk update product orders' }, 500);
  }
});

// Get products with mode (interleaved or grouped)
app.get('/products', async (c) => {
  try {
    const mode = c.req.query('mode') || 'grouped';

    if (mode === 'interleaved') {
      // Interleaved mode: ring1, necklace1, earring1, ring2, necklace2...
      const categories = await prisma.category.findMany({
        orderBy: { priority: 'asc' },
      });

      const products = await prisma.product.findMany({
        orderBy: { globalOrder: 'asc' },
      });

      // Interleave products based on category priority
      const interleaved: any[] = [];
      const categoryBuckets = new Map<string, any[]>();

      // Group products by category
      for (const product of products) {
        const category = categories.find(c => c.id === product.categoryId);
        if (category) {
          if (!categoryBuckets.has(category.id)) {
            categoryBuckets.set(category.id, []);
          }
          categoryBuckets.get(category.id)!.push(product);
        }
      }

      // Interleave
      let hasProducts = true;
      while (hasProducts) {
        hasProducts = false;
        for (const category of categories) {
          const bucket = categoryBuckets.get(category.id);
          if (bucket && bucket.length > 0) {
            interleaved.push(bucket.shift()!);
            hasProducts = true;
          }
        }
      }

      return c.json(interleaved);
    } else {
      // Grouped mode: ring1, ring2, ring3..., necklace1, necklace2...
      const categories = await prisma.category.findMany({
        orderBy: { priority: 'asc' },
      });

      const grouped: any[] = [];
      for (const category of categories) {
        const products = await prisma.product.findMany({
          where: { categoryId: category.id },
          orderBy: { categoryOrder: 'asc' },
        });
        grouped.push(...products);
      }

      return c.json(grouped);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Upload image (requires auth) - accepts base64 encoded image
app.post('/upload', authMiddleware, async (c) => {
  try {
    const { filename, data } = await c.req.json();

    if (!filename || !data) {
      return c.json({ error: 'Filename and data are required' }, 400);
    }

    // Decode base64
    const buffer = Buffer.from(data, 'base64');

    // Use the filename as-is (preserve directory structure)
    const filepath = join(uploadsDir, filename);

    // Ensure directory exists
    const dir = dirname(filepath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Save file
    writeFileSync(filepath, buffer);

    // Return file URL
    const fileUrl = `/${filename}`;
    return c.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

const port = parseInt(process.env.PORT || '3001');
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
