# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:18-alpine

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy Prisma schema and generate client
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
