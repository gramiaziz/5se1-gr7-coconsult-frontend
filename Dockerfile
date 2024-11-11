# Stage 1: Build the Angular application
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the Angular project files to the container
COPY . .

# Install dependencies
RUN npm install

# Build the Angular app for production
RUN npm run build --prod

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine

# Copy the Angular build output to Nginx's default html directory
COPY --from=build /app/dist/your-angular-app-name /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
