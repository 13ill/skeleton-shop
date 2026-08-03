# Dockerfile for Render deployment
# Render รองรับทั้ง Node.js auto-detect และ Docker — ไฟล์นี้สำหรับทาง Docker

FROM node:20-slim

WORKDIR /app

# Install dependencies for sharp (native modules)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy prisma and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Render sets PORT env var automatically (default 10000)
# index.ts already uses: process.env.PORT || '3001'
ENV PORT=10000
EXPOSE $PORT

# Start server (tsx runs TypeScript directly, no build needed)
CMD ["npx", "tsx", "src/index.ts"]
