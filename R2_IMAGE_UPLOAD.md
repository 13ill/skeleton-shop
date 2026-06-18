# Cloudflare R2 Image Upload Configuration

## Overview

The Jump-1 backend now uses Cloudflare R2 for image storage instead of local storage. This provides:
- Scalable object storage
- CDN-like performance
- Cost-effective storage
- Public URL access

## R2 Environment Variables

Add these variables in Railway dashboard:

```env
R2_ENDPOINT=https://6fc2659450d326addf8554c4d05aa835.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=jump-1-images
R2_PUBLIC_URL=https://pub-2d7e25b6f92840b9b82cc077b739efd8.r2.dev
```

## Getting R2 Credentials

1. Go to Cloudflare R2 dashboard
2. Create or select your R2 bucket
3. Go to "Settings" → "R2 API"
4. Create API Token or use existing Access Key ID and Secret Access Key
5. Enable "Public Development URL" for your bucket
6. Copy the public URL (R2_PUBLIC_URL)

## Upload Endpoint

The backend provides a `/upload` endpoint that accepts base64 encoded images:

```bash
POST /upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "filename": "product-image.jpg",
  "data": "base64_encoded_image_data"
}
```

Response:
```json
{
  "url": "https://pub-2d7e25b6f92840b9b82cc077b739efd8.r2.dev/Product/product-image.jpg"
}
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## File Organization

Images are organized in R2 with the following structure:
```
Product/
  ├── category1/
  │   ├── image1.jpg
  │   └── image2.jpg
  ├── category2/
  │   └── image3.jpg
  └── uploads/
      └── uploaded-image.jpg
```

## Testing Image Upload

Use the test script to verify R2 upload:

```bash
cd jump-1-backend
node test-upload-debug.cjs
```

## Troubleshooting

### Upload Returns Local Path

**Issue:** Upload endpoint returns local path instead of R2 URL

**Solution:**
- Verify R2 environment variables are set in Railway
- Check Railway deployment logs for errors
- Ensure `@aws-sdk/client-s3` is in package.json dependencies

### R2 Connection Error

**Issue:** Cannot connect to R2

**Solution:**
- Verify R2 credentials are correct
- Check R2 endpoint URL
- Ensure R2 bucket exists and is accessible

### CORS Errors

**Issue:** Images not accessible from frontend

**Solution:**
- Enable CORS rules in R2 bucket settings
- Use public development URL for R2 bucket
- Verify R2_PUBLIC_URL is correct

## Cost

- R2 Free Tier: 10 GB storage/month
- Class A Operations: 10 million/month
- Class B Operations: 1 million/month
- Egress: Free (unlimited)

## Migration from Local Storage

If migrating from local storage:

1. Upload existing images to R2
2. Update database URLs to use R2 URLs
3. Remove local upload directory code
4. Update frontend to use R2 URLs directly

## Security Notes

- R2 credentials should be kept secret
- Use environment variables, never hardcode credentials
- Enable CORS rules for your frontend domain
- Consider using presigned URLs for private content
