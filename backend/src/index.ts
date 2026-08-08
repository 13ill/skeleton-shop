import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import sharp from 'sharp';

dotenv.config();

const prisma = new PrismaClient();

const DEMO_SOCIAL_LINKS = [
  { id: 'demo-line', platform: 'line', url: 'https://line.me/R/ti/p/@niwelry', isActive: true },
  { id: 'demo-facebook', platform: 'facebook', url: 'https://facebook.com/niwelry', isActive: true },
  { id: 'demo-instagram', platform: 'instagram', url: 'https://instagram.com/niwelry', isActive: true },
  { id: 'demo-phone', platform: 'phone', url: '02-123-4567', isActive: true },
];

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

  c.header('Content-Type', ext && mimeTypes[ext] ? mimeTypes[ext] : 'application/octet-stream');
  return c.body(file);
});

// Serve static files from Product directory
app.get('/Product/:category/:filename', (c) => {
  const category = c.req.param('category');
  const filename = c.req.param('filename');
  const filepath = join(process.cwd(), '../public/Product', category, filename);

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

  c.header('Content-Type', ext && mimeTypes[ext] ? mimeTypes[ext] : 'application/octet-stream');
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

// Detailed health check for Railway
app.get('/health', async (c) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    return c.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, 503);
  }
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
    // Parse images from JSON string to array for frontend
    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    return c.json({ ...product, images: parsedImages });
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
    // Parse images from JSON string to array for each product
    const parsedProducts = products.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images
    }));
    return c.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Create product (requires auth)
app.post('/products', authMiddleware, async (c) => {
  try {
    const { id, name, category, price, description, fullDescription, material, materials, specifications, images, metaTitle, metaDescription } = await c.req.json();

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
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      },
    });

    // Parse images from JSON string to array for frontend
    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    return c.json({ ...product, images: parsedImages });
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
    const { name, category, price, description, fullDescription, material, materials, specifications, images, metaTitle, metaDescription } = await c.req.json();

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
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
      },
    });

    // Parse images from JSON string to array for frontend
    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    return c.json({ ...product, images: parsedImages });
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

// Update category (requires auth) — แก้ไข name/slug/isActive
app.put('/categories/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const { name, slug, isActive } = await c.req.json();

    // ตรวจว่า slug ซ้ำกับ category อื่นไหม (ถ้ามีการเปลี่ยน slug)
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return c.json({ error: 'Slug already exists' }, 400);
      }
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (isActive !== undefined) data.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return c.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

// Delete category (requires auth) — กันลบถ้ามีสินค้าอยู่
app.delete('/categories/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    // ตรวจว่ามีสินค้าอยู่ใน category นี้ไหม
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return c.json({
        error: `Cannot delete category with ${productCount} product(s). Please move or delete the products first.`,
        productCount,
      }, 400);
    }

    await prisma.category.delete({
      where: { id },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ error: 'Failed to delete category' }, 500);
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

    // Parse images from JSON string to array for frontend
    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    return c.json({ ...product, images: parsedImages });
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

    // Parse images from JSON string to array for frontend
    const parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    return c.json({ ...product, images: parsedImages });
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
    console.log('📡 Fetching products with mode:', mode);

    if (mode === 'interleaved') {
      // Interleaved mode: sort by globalOrder, then interleave by category priority
      console.log('📡 Fetching categories...');
      const categories = await prisma.category.findMany({
        orderBy: { priority: 'asc' },
      });
      console.log('✅ Categories fetched:', categories.length);

      console.log('📡 Fetching products...');
      const products = await prisma.product.findMany({
        orderBy: { globalOrder: 'asc' },
      });
      console.log('✅ Products fetched:', products.length);

      // Create category priority map
      const categoryPriorityMap = new Map<string, number>();
      for (const category of categories) {
        categoryPriorityMap.set(category.id, category.priority);
      }

      // Sort products by globalOrder first, then by category priority
      const sortedProducts = [...products].sort((a, b) => {
        // First sort by globalOrder
        if ((a.globalOrder || 0) !== (b.globalOrder || 0)) {
          return (a.globalOrder || 0) - (b.globalOrder || 0);
        }
        // Then sort by category priority
        const aPriority = a.categoryId ? (categoryPriorityMap.get(a.categoryId) || 999) : 999;
        const bPriority = b.categoryId ? (categoryPriorityMap.get(b.categoryId) || 999) : 999;
        return aPriority - bPriority;
      });

      // Parse images from JSON string to array for each product
      const parsedProducts = sortedProducts.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images
      }));
      return c.json(parsedProducts);
    } else {
      // Grouped mode: ring1, ring2, ring3..., necklace1, necklace2...
      console.log('📡 Fetching categories for grouped mode...');
      const categories = await prisma.category.findMany({
        orderBy: { priority: 'asc' },
      });
      console.log('✅ Categories fetched:', categories.length);

      const grouped: any[] = [];
      for (const category of categories) {
        console.log('📡 Fetching products for category:', category.name);
        const products = await prisma.product.findMany({
          where: { categoryId: category.id },
          orderBy: { categoryOrder: 'asc' },
        });
        console.log('✅ Products for category:', products.length);
        grouped.push(...products);
      }

      console.log('✅ Returning grouped products:', grouped.length);
      // Parse images from JSON string to array for each product
      const parsedProducts = grouped.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images
      }));
      return c.json(parsedProducts);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Responsive image widths used to generate WebP variants on upload.
// Serving an appropriately sized image (instead of the full original)
// dramatically reduces bandwidth / R2 egress cost.
const IMAGE_WIDTHS = [400, 800, 1200];

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

    // Keep the original (full quality) file for the lightbox / downloads
    writeFileSync(filepath, buffer);

    // Generate responsive WebP variants: "<path-without-ext>-<width>.webp"
    const ext = extname(filename);
    const base = ext ? filename.slice(0, -ext.length) : filename;
    const variants: { width: number; url: string }[] = [];
    try {
      const meta = await sharp(buffer).metadata();
      for (const width of IMAGE_WIDTHS) {
        // Skip variants larger than the source (avoid duplicate upscaled files)
        if (meta.width && meta.width < width && variants.length > 0) continue;
        const variantName = `${base}-${width}.webp`;
        const variantPath = join(uploadsDir, variantName);
        const variantDir = dirname(variantPath);
        if (!existsSync(variantDir)) {
          mkdirSync(variantDir, { recursive: true });
        }
        await sharp(buffer)
          .rotate() // respect EXIF orientation
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(variantPath);
        variants.push({ width, url: `/${variantName}` });
      }
    } catch (variantError) {
      console.error('Failed to generate image variants:', variantError);
    }

    // Default url = the 800px variant (good for product cards); fall back to original
    const medium = variants.find((v) => v.width === 800) || variants[variants.length - 1];
    const fileUrl = medium ? medium.url : `/${filename}`;
    const srcset = variants.map((v) => `${v.url} ${v.width}w`).join(', ');

    return c.json({ url: fileUrl, srcset, variants, original: `/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Social Links CRUD endpoints
app.get('/social-links', authMiddleware, async (c) => {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return c.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return c.json({ error: 'Failed to fetch social links' }, 500);
  }
});

app.post('/social-links', authMiddleware, async (c) => {
  try {
    const { platform, url, isActive } = await c.req.json();
    
    const socialLink = await prisma.socialLink.create({
      data: {
        platform,
        url,
        isActive: isActive ?? true,
      },
    });
    
    return c.json(socialLink);
  } catch (error) {
    console.error('Error creating social link:', error);
    return c.json({ error: 'Failed to create social link' }, 500);
  }
});

app.put('/social-links/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const { platform, url, isActive } = await c.req.json();
    
    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: {
        platform,
        url,
        isActive,
      },
    });
    
    return c.json(socialLink);
  } catch (error) {
    console.error('Error updating social link:', error);
    return c.json({ error: 'Failed to update social link' }, 500);
  }
});

app.delete('/social-links/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    
    await prisma.socialLink.delete({
      where: { id },
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return c.json({ error: 'Failed to delete social link' }, 500);
  }
});

// Public endpoint to get active social links
app.get('/public/social-links', async (c) => {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    // Demo fallback so the storefront looks complete before the owner adds real links
    if (socialLinks.length === 0) {
      return c.json(DEMO_SOCIAL_LINKS);
    }
    return c.json(socialLinks);
  } catch (error) {
    console.error('Error fetching public social links:', error);
    return c.json({ error: 'Failed to fetch social links' }, 500);
  }
});

// Site Settings endpoints
app.get('/site-settings', authMiddleware, async (c) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          brandName: 'Niwelry',
          tagline: 'เครื่องประดับเพชรพลอยคุณภาพสูง',
          address: '123 ถนนสุขุมวิท ซอย 11\nแขวงคลองเตยเหนือ เขตวัฒนา\nกรุงเทพมหานคร 10110',
          openingHours: 'จันทร์ - เสาร์  10:00 - 19:00 น.',
          phone: '02-123-4567',
          email: 'contact@niwelry.example',
          heroTitle: 'เครื่องประดับที่สะท้อน',
          heroSubtitle: 'ความเป็นคุณ\nเครื่องประดับเพชรพลอยคุณภาพสูง คัดสรรความพิเศษเพื่อคุณ',
          heroButtonText: 'ดูสินค้าทั้งหมด',
          heroTextStrokeColor: '#ffffff',
          heroTextStrokeWidth: 0.5,
          heroBorderColor: '#d4af37',
          heroShowBorder: false,
          newsletterTitle: 'รับข่าวสารและโปรโมชั่นพิเศษ',
          newsletterDescription: 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด',
          newsletterTextStrokeColor: '#ffffff',
          newsletterTextStrokeWidth: 0.5,
          newsletterBorderColor: '#d4af37',
          newsletterShowBorder: false,
          contactPageTitle: 'ติดต่อเรา',
          contactPageDescription: 'เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง',
          contactTextStrokeColor: '#ffffff',
          contactTextStrokeWidth: 0.5,
          contactBorderColor: '#d4af37',
          contactShowBorder: false,
        },
      });
    }
    
    return c.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return c.json({ error: 'Failed to fetch site settings' }, 500);
  }
});

app.put('/site-settings', authMiddleware, async (c) => {
  try {
    const { 
      brandName, 
      tagline, 
      address, 
      openingHours, 
      phone, 
      email,
      heroTitle,
      heroSubtitle,
      heroButtonText,
      heroBackgroundImage,
      heroTextStrokeColor,
      heroTextStrokeWidth,
      heroBorderColor,
      heroShowBorder,
      newsletterTitle,
      newsletterDescription,
      newsletterBackgroundImage,
      newsletterTextStrokeColor,
      newsletterTextStrokeWidth,
      newsletterBorderColor,
      newsletterShowBorder,
      contactPageTitle,
      contactPageDescription,
      contactBackgroundImage,
      contactTextStrokeColor,
      contactTextStrokeWidth,
      contactBorderColor,
      contactShowBorder,
      domain,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImageUrl,
      seoIndexable
    } = await c.req.json();
    
    let settings = await prisma.siteSettings.findFirst();
    
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          brandName,
          tagline,
          address,
          openingHours,
          phone,
          email,
          heroTitle,
          heroSubtitle,
          heroButtonText,
          heroBackgroundImage,
          heroTextStrokeColor,
          heroTextStrokeWidth,
          heroBorderColor,
          heroShowBorder,
          newsletterTitle,
          newsletterDescription,
          newsletterBackgroundImage,
          newsletterTextStrokeColor,
          newsletterTextStrokeWidth,
          newsletterBorderColor,
          newsletterShowBorder,
          contactPageTitle,
          contactPageDescription,
          contactBackgroundImage,
          contactTextStrokeColor,
          contactTextStrokeWidth,
          contactBorderColor,
          contactShowBorder,
          domain,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImageUrl,
          seoIndexable,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          brandName,
          tagline,
          address,
          openingHours,
          phone,
          email,
          heroTitle,
          heroSubtitle,
          heroButtonText,
          heroBackgroundImage,
          heroTextStrokeColor,
          heroTextStrokeWidth,
          heroBorderColor,
          heroShowBorder,
          newsletterTitle,
          newsletterDescription,
          newsletterBackgroundImage,
          newsletterTextStrokeColor,
          newsletterTextStrokeWidth,
          newsletterBorderColor,
          newsletterShowBorder,
          contactPageTitle,
          contactPageDescription,
          contactBackgroundImage,
          contactTextStrokeColor,
          contactTextStrokeWidth,
          contactBorderColor,
          contactShowBorder,
          domain,
          seoTitle,
          seoDescription,
          seoKeywords,
          ogImageUrl,
          seoIndexable,
        },
      });
    }
    
    return c.json(settings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return c.json({ error: 'Failed to update site settings' }, 500);
  }
});

// Public endpoint to get site settings
app.get('/public/site-settings', async (c) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    // Return default settings if none exist
    if (!settings) {
      settings = {
        id: 'default',
        project: 'jump1',
        createdAt: new Date(),
        updatedAt: new Date(),
        brandName: 'Niwelry',
        tagline: 'เครื่องประดับเพชรพลอยคุณภาพสูง',
        address: '123 ถนนสุขุมวิท ซอย 11\nแขวงคลองเตยเหนือ เขตวัฒนา\nกรุงเทพมหานคร 10110',
        openingHours: 'จันทร์ - เสาร์  10:00 - 19:00 น.',
        phone: '02-123-4567',
        email: 'contact@niwelry.example',
        heroTitle: 'เครื่องประดับที่สะท้อน',
        heroSubtitle: 'ความเป็นคุณ\nเครื่องประดับเพชรพลอยคุณภาพสูง คัดสรรความพิเศษเพื่อคุณ',
        heroButtonText: 'ดูสินค้าทั้งหมด',
        heroBackgroundImage: null,
        heroTextStrokeColor: '#ffffff',
        heroTextStrokeWidth: 0.5,
        heroBorderColor: '#d4af37',
        heroShowBorder: false,
        newsletterTitle: 'รับข่าวสารและโปรโมชั่นพิเศษ',
        newsletterDescription: 'สมัครรับจดหมายข่าวสารเพื่อไม่พลาดโปรโมชั่นและสินค้าใหม่ล่าสุด',
        newsletterBackgroundImage: null,
        newsletterTextStrokeColor: '#ffffff',
        newsletterTextStrokeWidth: 0.5,
        newsletterBorderColor: '#d4af37',
        newsletterShowBorder: false,
        contactPageTitle: 'ติดต่อเรา',
        contactPageDescription: 'เราพร้อมให้บริการคุณตลอด 24 ชั่วโมง',
        contactBackgroundImage: null,
        contactTextStrokeColor: '#ffffff',
        contactTextStrokeWidth: 0.5,
        contactBorderColor: '#d4af37',
        contactShowBorder: false,
        domain: null,
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
        ogImageUrl: null,
        seoIndexable: true,
      };
    }
    
    return c.json(settings);
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    return c.json({ error: 'Failed to fetch site settings' }, 500);
  }
});

// ── Public SEO endpoints (no auth — สำหรับ Google bot และ Vercel serverless) ──

// Helper: ดึง domain จาก query param หรือ headers
function resolveDomain(c: any): string {
  const queryDomain = c.req.query('domain');
  if (queryDomain) return queryDomain;

  const origin = c.req.header('Origin');
  if (origin) {
    try { return new URL(origin).hostname; } catch { /* ignore */ }
  }

  const referer = c.req.header('Referer');
  if (referer) {
    try { return new URL(referer).hostname; } catch { /* ignore */ }
  }

  return c.req.header('Host') || '';
}

// Helper: หา SiteSettings จาก domain
async function findSettingsByDomain(domain: string) {
  const cleanDomain = domain.replace(/^www\./, '');
  return prisma.siteSettings.findFirst({
    where: { domain: cleanDomain },
  });
}

// GET /public/seo — ดึงข้อมูล SEO ตาม domain (รวมสินค้าสำหรับ ItemList)
app.get('/public/seo', async (c) => {
  try {
    const domain = resolveDomain(c);
    const settings = await findSettingsByDomain(domain);

    if (!settings) {
      return c.json({
        title: 'Jewelry Showcase',
        description: 'Displays a stylish catalog of jewelry for easy browsing.',
        robots: 'noindex, nofollow',
        domain,
      });
    }

    const title = settings.seoTitle || settings.brandName;
    const description = settings.seoDescription || settings.tagline || `${settings.brandName} — ${settings.address || ''}`.trim();
    const robots = settings.seoIndexable ? 'index, follow' : 'noindex, nofollow';
    const baseUrl = `https://${settings.domain}`;

    // Store structured data
    const storeData: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: settings.brandName,
    };
    if (settings.phone) storeData.telephone = settings.phone;
    if (settings.address) storeData.address = { '@type': 'PostalAddress', streetAddress: settings.address };
    if (settings.domain) storeData.url = baseUrl;
    if (settings.email) storeData.email = settings.email;

    // ดึงสินค้าทั้งหมดสำหรับ ItemList (ฝังในหน้าแรกให้ Google เห็น)
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 100, // จำกัด 100 ชิ้น เพื่อไม่ให้ HTML ใหญ่เกินไป
    });

    const itemListElements = products.map((p, i) => {
      const item: Record<string, any> = {
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${baseUrl}/product/${p.id}`,
      };
      // ใช้รูปแรกเป็น image ถ้ามี
      const images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      if (Array.isArray(images) && images.length > 0) {
        const firstImage = images[0];
        item.image = firstImage.startsWith('http') ? firstImage : `${baseUrl}${firstImage}`;
      }
      if (p.description) item.description = p.description;
      if (p.price) {
        item.price = p.price;
        item.priceCurrency = 'THB';
      }
      return item;
    });

    const itemList: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${settings.brandName} — สินค้าทั้งหมด`,
      numberOfItems: products.length,
      itemListElement: itemListElements,
    };

    return c.json({
      title,
      description,
      keywords: settings.seoKeywords,
      ogImageUrl: settings.ogImageUrl,
      robots,
      storeName: settings.brandName,
      domain: settings.domain,
      phone: settings.phone,
      address: settings.address,
      email: settings.email,
      structuredData: storeData,
      itemList,
      productCount: products.length,
    });
  } catch (error) {
    console.error('Error fetching SEO:', error);
    return c.json({ error: 'Failed to fetch SEO' }, 500);
  }
});

// GET /public/robots — สร้าง robots.txt ตาม domain
app.get('/public/robots', async (c) => {
  try {
    const domain = resolveDomain(c);
    const settings = await findSettingsByDomain(domain);
    const baseUrl = settings?.domain ? `https://${settings.domain}` : `https://${domain}`;

    let content: string;
    if (settings && !settings.seoIndexable) {
      content = 'User-agent: *\nDisallow: /\n';
    } else {
      content = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
    }

    c.header('Content-Type', 'text/plain');
    c.header('Cache-Control', 'public, max-age=3600');
    return c.body(content);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return c.body('User-agent: *\nAllow: /\n', 200, { 'Content-Type': 'text/plain' });
  }
});

// GET /public/sitemap — สร้าง sitemap.xml ตาม domain (ดึงสินค้า + หมวดหมู่)
app.get('/public/sitemap', async (c) => {
  try {
    const domain = resolveDomain(c);
    const settings = await findSettingsByDomain(domain);

    if (!settings || !settings.seoIndexable) {
      c.header('Content-Type', 'application/xml');
      return c.body('<?xml version="1.0" encoding="UTF-8"?>\n<urlset></urlset>');
    }

    const baseUrl = `https://${settings.domain}`;
    const urls: string[] = [];

    // หน้าหลัก
    urls.push(`  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`);

    // หมวดหมู่
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });
    for (const cat of categories) {
      urls.push(`  <url>\n    <loc>${baseUrl}/?category=${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
    }

    // สินค้า
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    for (const prod of products) {
      const lastmod = prod.updatedAt.toISOString();
      urls.push(`  <url>\n    <loc>${baseUrl}/product/${prod.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600');
    return c.body(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    c.header('Content-Type', 'application/xml');
    return c.body('<?xml version="1.0" encoding="UTF-8"?>\n<urlset></urlset>');
  }
});

// ── Admin Backup endpoint (ต้อง login — สำหรับ super admin backup ได้เอง) ──

// GET /admin/backup — ดาวน์โหลดข้อมูลทั้งหมดเป็น JSON
app.get('/admin/backup', authMiddleware, async (c) => {
  try {
    const backup: Record<string, any> = {
      _meta: {
        timestamp: new Date().toISOString(),
        exportedBy: (c as any).get('email') || 'unknown',
        version: '1.0',
      },
    };

    const tables = [
      { name: 'users', fetch: () => prisma.user.findMany() },
      { name: 'categories', fetch: () => prisma.category.findMany() },
      { name: 'products', fetch: () => prisma.product.findMany() },
      { name: 'socialLinks', fetch: () => prisma.socialLink.findMany() },
      { name: 'siteSettings', fetch: () => prisma.siteSettings.findMany() },
    ];

    let totalRows = 0;
    for (const table of tables) {
      const data = await table.fetch();
      backup[table.name] = data;
      totalRows += Array.isArray(data) ? data.length : (data ? 1 : 0);
    }

    backup._meta.totalRows = totalRows;

    const json = JSON.stringify(backup, null, 2);
    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;

    c.header('Content-Type', 'application/json');
    c.header('Content-Disposition', `attachment; filename="${filename}"`);
    c.header('Cache-Control', 'no-store');
    return c.body(json);
  } catch (error) {
    console.error('Error creating backup:', error);
    return c.json({ error: 'Failed to create backup' }, 500);
  }
});

// GET /admin/backup/info — ดูสรุปข้อมูลใน DB (ไม่ดาวน์โหลด)
app.get('/admin/backup/info', authMiddleware, async (c) => {
  try {
    const [users, categories, products, socialLinks, siteSettings] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.product.count(),
      prisma.socialLink.count(),
      prisma.siteSettings.count(),
    ]);

    return c.json({
      timestamp: new Date().toISOString(),
      tables: {
        users,
        categories,
        products,
        socialLinks,
        siteSettings,
      },
      total: users + categories + products + socialLinks + siteSettings,
    });
  } catch (error) {
    console.error('Error getting backup info:', error);
    return c.json({ error: 'Failed to get backup info' }, 500);
  }
});

const port = parseInt(process.env.PORT || '3001');
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
