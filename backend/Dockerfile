FROM node:18

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code (ignores .dockerignore)
COPY . .

# Build the application
RUN npm run build

EXPOSE 3535

# Runs the application
CMD ["npm", "run", "start:prod"]
