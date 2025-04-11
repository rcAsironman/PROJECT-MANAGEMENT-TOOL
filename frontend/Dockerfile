# Use official Node.js image as base
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight image to serve the app
FROM node:22-alpine AS runner
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
