# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port (change if needed)
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
