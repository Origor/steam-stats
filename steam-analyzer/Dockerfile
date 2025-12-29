# Build Stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime Stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx config to handle SPA routing (fallback to index.html)
# We can overwrite the default config or add a new one.
# For simplicity, we'll use a basic config inline.
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        # This is strictly for when Nginx itself proxies, but in K8s, Ingress likely handles this. \
        # However, if we run this container alone, we might want to proxy. \
        # For now, we assume Ingress handles /api, so this location block might not be hit \
        # if the ingress splits traffic before it reaches this pod. \
        # But if we use this container as the main entrypoint without ingress splitting, we need a proxy pass. \
        # Since we are designing for K8s with separate backend image, Ingress is the right place. \
        return 404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
