# Jump-1 Developer Guide

## Project Structure

```
Jump-1/
├── backend/                 # Node.js/Express backend
│   ├── prisma/             # Database schema and migrations
│   │   └── schema.prisma  # Prisma schema definition
│   ├── src/               # Source code
│   │   ├── index.ts       # Main server file
│   │   ├── auth.ts        # Authentication utilities
│   │   └── seed.ts        # Database seeding script
│   ├── uploads/           # User uploaded files
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
├── public/                # Static files
│   └── Product/          # Product images and JSON data
├── src/                   # Frontend source code
│   ├── app/              # React application
│   │   ├── admin/        # Admin dashboard components
│   │   ├── components/   # Shared components
│   │   └── data/         # Generated product data
│   ├── config/           # Configuration files
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── scripts/              # Build scripts
├── docs/                 # Documentation
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
└── TODO.md              # Project TODO list
```

---

## Technology Stack

### Frontend
- **React 18.3.1**: UI framework
- **Vite 6.3.5**: Build tool and dev server
- **TypeScript 5.7.2**: Type safety
- **Tailwind CSS 4.1.12**: Styling
- **React Router 7.13.0**: Routing
- **Radix UI**: Component library
- **Motion 12.23.24**: Animations

### Backend
- **Node.js 20.13.1**: Runtime
- **Hono 4.6.14**: Web framework
- **Prisma 6.1.0**: ORM
- **SQLite**: Database (development)
- **JWT**: Authentication

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Frontend (.env.local)
   VITE_API_BASE_URL=http://localhost:3001
   VITE_SITE_NAME=Jump-1

   # Backend (.env)
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=your-secret-key
   ```

4. Initialize database:
   ```bash
   cd backend
   npx prisma migrate dev
   npm run seed
   ```

5. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

---

## Database Schema

### Models

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Category
```prisma
model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  priority  Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  products  Product[]
}
```

#### Product
```prisma
model Product {
  id              String   @id
  name            String
  category        String
  categoryId      String?
  globalOrder     Int?
  categoryOrder   Int?
  price           Int?
  description     String
  fullDescription String
  material        String?
  specifications   Json?
  images          Json
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  categoryRelation Category? @relation(fields: [categoryId], references: [id])
}
```

---

## API Development

### Adding New Endpoints

1. Open `backend/src/index.ts`
2. Add your endpoint using Hono's routing:

```typescript
app.get('/your-endpoint', async (c) => {
  try {
    // Your logic here
    return c.json({ data: 'response' });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ error: 'Failed' }, 500);
  }
});
```

3. For protected endpoints, use the auth middleware:

```typescript
app.post('/protected-endpoint', authMiddleware, async (c) => {
  const userId = c.get('userId');
  // Your logic here
});
```

### Database Operations

Use Prisma Client for database operations:

```typescript
const prisma = new PrismaClient();

// Create
await prisma.product.create({
  data: {
    name: 'Product Name',
    category: 'ring',
    // ... other fields
  }
});

// Read
const products = await prisma.product.findMany();
const product = await prisma.product.findUnique({
  where: { id: 'product-id' }
});

// Update
await prisma.product.update({
  where: { id: 'product-id' },
  data: { name: 'Updated Name' }
});

// Delete
await prisma.product.delete({
  where: { id: 'product-id' }
});
```

---

## Frontend Development

### Component Structure

Follow this pattern for new components:

```typescript
import { useState, useEffect } from 'react';

interface ComponentProps {
  // Define your props here
}

export function YourComponent({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
  }, [dependencies]);

  const handleAction = () => {
    // Event handlers here
  };

  return (
    <div className="your-styles">
      {/* JSX here */}
    </div>
  );
}
```

### API Calls

Use the existing service pattern in `src/services/`:

```typescript
// src/services/yourService.ts
import { env } from '../config/env';

export async function yourApiFunction() {
  try {
    const response = await fetch(`${env.API_BASE_URL}/your-endpoint`);
    if (!response.ok) throw new Error('Failed');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

For retry logic, use the utility function:

```typescript
import { fetchWithRetry } from '../utils/api';

const response = await fetchWithRetry(`${env.API_BASE_URL}/your-endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  retries: 3,
  retryDelay: 1000,
});
```

### Styling

Use Tailwind CSS for styling:

```typescript
<div className="flex items-center gap-4 p-4 rounded-lg border-2">
  {/* Content */}
</div>
```

For custom styles, use the existing color scheme:
- Primary: `#c8a96e` (gold)
- Hover: `#b0955e` (darker gold)
- Background: white/gray-50
- Text: gray-900/gray-500

### Type Definitions

Add new types to `src/types/`:

```typescript
// src/types/yourType.ts
export interface YourType {
  id: string;
  name: string;
  // ... other fields
}
```

---

## Display Order Management

### Understanding the System

The display order system uses two types of ordering:

1. **Category Priority**: Determines order of categories in interleaved mode
2. **Product Orders**:
   - `globalOrder`: Overall position across all products (interleaved mode)
   - `categoryOrder`: Position within category (grouped mode)

### Adding New Display Modes

1. **Backend**: Add the mode logic in `backend/src/index.ts`:

```typescript
if (mode === 'your-new-mode') {
  // Your ordering logic here
  const products = await prisma.product.findMany({
    orderBy: { yourField: 'asc' },
  });
  return c.json(products);
}
```

2. **Frontend**: Add the mode to the service:

```typescript
// src/services/productService.ts
export async function getProductsWithMode(mode: 'interleaved' | 'grouped' | 'your-new-mode') {
  // Add your mode handling
}
```

3. **UI**: Add the mode toggle in the relevant components:

```typescript
const [displayMode, setDisplayMode] = useState<'interleaved' | 'grouped' | 'your-new-mode'>('interleaved');
```

---

## Testing

### Frontend Tests

Run the frontend test script:

```bash
npm test
```

This tests:
- API health check
- Product fetching (all, interleaved, grouped)
- Product by ID
- Categories
- Image serving

### Backend Tests

Run the backend test script:

```bash
cd backend
npm test
```

This tests:
- Category reordering
- Product reordering

### Adding New Tests

Add new test cases to `frontend-test.js`:

```javascript
async function testYourNewFeature() {
  const response = await fetch(`${API_BASE_URL}/your-endpoint`);
  if (!response.ok) {
    throw new Error('Failed to test your feature');
  }
  const data = await response.json();
  // Add your assertions here
}

// Add to the tests array
{ name: 'Your New Feature', fn: testYourNewFeature },
```

---

## Performance Optimization

### Frontend

1. **Memoization**: Use `React.memo` for components that re-render unnecessarily:

```typescript
const YourComponent = memo(({ prop1, prop2 }: Props) => {
  // Component logic
});
```

2. **useCallback**: Memoize event handlers:

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

3. **useRef**: Use refs to track values that don't need re-renders:

```typescript
const valueRef = useRef(initialValue);
```

### Backend

1. **Database Indexing**: Add indexes to frequently queried fields in `schema.prisma`:

```prisma
model Product {
  // ...
  @@index([categoryId])
  @@index([globalOrder])
  @@index([categoryOrder])
}
```

2. **Pagination**: Implement pagination for large datasets:

```typescript
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

---

## Deployment

### Environment Variables

Production environment variables:

```bash
# Frontend
VITE_API_BASE_URL=https://your-api-domain.com
VITE_SITE_NAME=Jump-1

# Backend
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-secret
NODE_ENV=production
```

### Build Process

1. **Frontend**:
   ```bash
   npm run build
   ```
   This creates a `dist/` directory with optimized production files.

2. **Backend**:
   ```bash
   cd backend
   npm run build
   ```
   This compiles TypeScript to JavaScript in `dist/`.

### Running in Production

1. **Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Frontend**:
   Serve the `dist/` directory using a web server like nginx or serve:
   ```bash
   npx serve dist
   ```

---

## Troubleshooting

### Common Issues

**Prisma Client Not Generated**
```bash
cd backend
npx prisma generate
```

**Database Migration Issues**
```bash
cd backend
npx prisma migrate reset
npm run seed
```

**Port Already in Use**
```bash
# Find and kill the process using the port
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Images Not Loading**
- Check backend is running on correct port
- Verify `VITE_API_BASE_URL` in `.env.local`
- Ensure image files exist in `public/Product/`

---

## Contributing

### Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Use Tailwind CSS for styling
- Add comments for complex logic
- Keep functions small and focused

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create a pull request

### Commit Message Format

```
type: subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Hono Documentation](https://hono.dev/)

---

## Support

For questions or issues:
1. Check existing documentation
2. Review the TODO.md for known issues
3. Contact the development team

---

## License

This project is proprietary. All rights reserved.
