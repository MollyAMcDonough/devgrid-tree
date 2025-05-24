# Use official Node.js LTS image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose both Next.js and Socket.IO ports
EXPOSE 3000
EXPOSE 4000

# Start both Next.js and socket server concurrently
CMD ["npm", "run", "start:all"]
