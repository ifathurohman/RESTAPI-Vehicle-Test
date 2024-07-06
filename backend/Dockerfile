# Use the official Node.js image with LTS (Long Term Support) version
FROM node:16-alpine

# Create and set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install
RUN npm install -g dotenv-cli

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application with nodemon
CMD ["npm", "run", "dev"]
