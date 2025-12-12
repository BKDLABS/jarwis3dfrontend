# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables (can be overridden in docker-compose)
ENV NODE_ENV=production
ENV FOLIO_EMAIL=
ENV FOLIO_PASSWORD=

# Install ts-node globally to run TypeScript server
RUN npm install -g ts-node typescript

# Start the server
CMD ["ts-node", "server/index.ts"]

