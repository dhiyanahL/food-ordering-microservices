# Step 1: Use official Node.js LTS version as base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the backend code into the container
COPY . .

# Step 6: Expose the backend port (update if different)
EXPOSE 5400

# Step 7: Command to run the backend server
CMD ["npm", "run", "dev"]
