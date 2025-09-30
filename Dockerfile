# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only the dependency files first for caching
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files for production
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
