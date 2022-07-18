# Install base image
FROM node:16-alpine AS deps

# Create new user on container for application
RUN mkdir -p /usr/app/
# Define working directory for application
WORKDIR /usr/app

# Copy application files into container
COPY ./ ./

# Install node dependencies and build application
RUN npm install

# Define port application runs on
EXPOSE 3000

# Start application server
CMD ["npm", "dev"]