# Jump-1 API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
Most endpoints require authentication using Bearer token.

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "ok",
  "message": "Jump-1 API is running"
}
```

---

### Authentication

#### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

---

### Categories

#### Get All Categories
```http
GET /categories
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "category_id",
    "name": "แหวน",
    "slug": "ring",
    "priority": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Category
```http
POST /categories
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "แหวน",
  "slug": "ring",
  "priority": 1
}
```

**Response:**
```json
{
  "id": "category_id",
  "name": "แหวน",
  "slug": "ring",
  "priority": 1,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Category Priority
```http
PUT /categories/:id/priority
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "priority": 5
}
```

**Response:**
```json
{
  "id": "category_id",
  "name": "แหวน",
  "slug": "ring",
  "priority": 5,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Reorder Categories
```http
PUT /categories/reorder
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fromIndex": 0,
  "toIndex": 2,
  "categoryId": "category_id"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Products

#### Get All Products
```http
GET /products
```

**Query Parameters:**
- `mode` (optional): `interleaved` or `grouped` (default: `grouped`)

**Example:**
```http
GET /products?mode=interleaved
```

**Response:**
```json
[
  {
    "id": "GEM1",
    "name": "Product Name",
    "category": "ring",
    "categoryId": "category_id",
    "globalOrder": 1,
    "categoryOrder": 1,
    "price": 10000,
    "description": "Short description",
    "fullDescription": "Full description",
    "material": "Gold",
    "specifications": {
      "size": "15mm"
    },
    "images": [
      "/Product/GEM1/image1.jpg",
      "/Product/GEM1/image2.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Product by ID
```http
GET /products/:id
```

**Response:**
```json
{
  "id": "GEM1",
  "name": "Product Name",
  "category": "ring",
  "categoryId": "category_id",
  "globalOrder": 1,
  "categoryOrder": 1,
  "price": 10000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Products by Category
```http
GET /products/category/:category
```

**Response:**
```json
[
  {
    "id": "GEM1",
    "name": "Product Name",
    "category": "ring",
    "categoryId": "category_id",
    "globalOrder": 1,
    "categoryOrder": 1,
    "price": 10000,
    "description": "Short description",
    "fullDescription": "Full description",
    "material": "Gold",
    "specifications": {
      "size": "15mm"
    },
    "images": [
      "/Product/GEM1/image1.jpg",
      "/Product/GEM1/image2.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Product
```http
POST /products
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "GEM1",
  "name": "Product Name",
  "category": "ring",
  "price": 10000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ]
}
```

**Response:**
```json
{
  "id": "GEM1",
  "name": "Product Name",
  "category": "ring",
  "categoryId": "category_id",
  "globalOrder": 1,
  "categoryOrder": 1,
  "price": 10000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Product
```http
PUT /products/:id
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 15000
}
```

**Response:**
```json
{
  "id": "GEM1",
  "name": "Updated Product Name",
  "category": "ring",
  "categoryId": "category_id",
  "globalOrder": 1,
  "categoryOrder": 1,
  "price": 15000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Product Global Order
```http
PUT /products/:id/globalOrder
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "globalOrder": 5
}
```

**Response:**
```json
{
  "id": "GEM1",
  "name": "Product Name",
  "category": "ring",
  "categoryId": "category_id",
  "globalOrder": 5,
  "categoryOrder": 1,
  "price": 10000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Product Category Order
```http
PUT /products/:id/categoryOrder
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categoryOrder": 3
}
```

**Response:**
```json
{
  "id": "GEM1",
  "name": "Product Name",
  "category": "ring",
  "categoryId": "category_id",
  "globalOrder": 1,
  "categoryOrder": 3,
  "price": 10000,
  "description": "Short description",
  "fullDescription": "Full description",
  "material": "Gold",
  "specifications": {
    "size": "15mm"
  },
  "images": [
    "/Product/GEM1/image1.jpg",
    "/Product/GEM1/image2.jpg"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Reorder Products
```http
PUT /products/reorder
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "mode": "interleaved",
  "fromIndex": 0,
  "toIndex": 2,
  "productId": "GEM1"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Delete Product
```http
DELETE /products/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

### Static Files

#### Get Product Image
```http
GET /Product/:category/:filename
```

**Example:**
```http
GET /Product/GEM1/S__18235446_0_0.jpg
```

**Response:**
- Content-Type: `image/jpeg` (or appropriate image type)
- Binary image data

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `400` Bad Request
- `401` Unauthorized
- `404` Not Found
- `500` Internal Server Error

---

## Display Modes

### Interleaved Mode
Products are displayed by alternating between categories based on category priority:
- Ring 1, Necklace 1, Earring 1, Ring 2, Necklace 2, Earring 2, ...

**Request:**
```http
GET /products?mode=interleaved
```

### Grouped Mode
Products are displayed grouped by category:
- Ring 1, Ring 2, Ring 3, ..., Necklace 1, Necklace 2, Necklace 3, ...

**Request:**
```http
GET /products?mode=grouped
```

---

## Testing

Run the frontend test script:
```bash
npm test
```

This will test all API endpoints and verify:
- Health check
- Product fetching (all, interleaved, grouped)
- Product by ID
- Categories
- Image serving
