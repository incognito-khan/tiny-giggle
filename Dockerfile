# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy remaining files
COPY . .

# Build the Next.js app
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies (optional, if you care about image size)
COPY package.json package-lock.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Required by Next.js at runtime
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Use Next.js built-in start command
CMD ["npm", "start"]
