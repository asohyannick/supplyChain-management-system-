# Use a specific version of Node.js as a parent image
FROM node:22 as builder

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire project structure to the working directory
COPY . .

# Build the application
RUN npm run build

# Development stage
FROM node:22 as development
WORKDIR /usr/src/server

# Copy necessary files from the builder stage
COPY --from=builder /usr/src/server ./

# Set NODE_ENV to development
ENV NODE_ENV=development

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application (in development)
CMD ["npm", "run", "dev"]

# Production stage
FROM node:22 as production
WORKDIR /usr/src/server

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/server/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8080

# Run the production command
CMD ["npm", "start"]