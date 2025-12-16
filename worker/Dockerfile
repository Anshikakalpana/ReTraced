# Use Node Alpine image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Start the server with compiled JS
CMD ["npm", "start"]
