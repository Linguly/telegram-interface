# Use the official Node.js image as the base image
FROM node:18

# Set the environment variables
ARG BOT_TOKEN
ENV BOT_TOKEN=$BOT_TOKEN


ARG LINGULY_CORE_BASE_URL=http://localhost:8000
ENV LINGULY_CORE_BASE_URL=$LINGULY_CORE_BASE_URL

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3002

# Command to run the application
CMD ["npm", "start"]