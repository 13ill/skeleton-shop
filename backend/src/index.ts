import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { dotenv from 'dotenv';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

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

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

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

// Get all products
app.get('/products', async (c) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return c.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
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

// Upload image (requires auth) - accepts base64 encoded image
app.post('/upload', authMiddleware, async (c) => {
  try {
    const { filename, data } = await c.req.json();

    if (!filename || !data) {
      return c.json({ error: 'Filename and data are required' }, 400);
    }

    // Decode base64
    const buffer = Buffer.from(data, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const ext = filename.split('.').pop();
    const uniqueFilename = `${timestamp}.${ext}`;
    const filepath = join(uploadsDir, uniqueFilename);

    // Save file
    writeFileSync(filepath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${uniqueFilename}`;
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
