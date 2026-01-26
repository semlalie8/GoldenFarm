# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app/server

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "run", "dev"]
