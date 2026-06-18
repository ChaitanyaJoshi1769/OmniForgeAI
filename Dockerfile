# Multi-stage build for backend and frontend
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

# Install dependencies
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Build stage
FROM dependencies AS builder
COPY . .
RUN npm run build

# Production image - backend
FROM base AS backend-runtime
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["node", "dist/apps/backend/main.js"]

# Production image - frontend
FROM node:20-alpine AS frontend-runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/frontend
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["npm", "start"]
