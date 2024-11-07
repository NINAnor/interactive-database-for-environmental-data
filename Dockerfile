# Build stage
FROM node:20 as setup
WORKDIR /app
# Copy and install files into the container
COPY client/package*.json ./
RUN npm install
COPY client/. .
# Use default environment variables
ARG VITE_POSTGREST_URL="/postgrest"
ARG VITE_AUTH_URL="/api"
ARG VITE_UPLOAD_URL="/api"
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_ENV
ARG SENTRY_AUTH_TOKEN


from setup as build-stage

ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}
ENV VITE_SENTRY_ENV=${VITE_SENTRY_ENV}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# Build the app
RUN npm run build
# Prune dev dependencies
RUN npm prune --production


# Production stage
FROM nginx:stable-alpine as production-stage
# Copy the build files to the nginx server
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copy nginx.conf
COPY server/nginx.conf /etc/nginx/nginx.conf
# Copy error pages
COPY server/404.html /usr/share/nginx/html
COPY server/500.html /usr/share/nginx/html
# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
