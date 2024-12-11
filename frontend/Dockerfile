FROM node:18

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port used by Vite
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev", "--", "--host"]
