# Build stage: install deps and compile TypeScript
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage: copy compiled output and run with a minimal runtime
FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=build /app/swagger.yaml ./swagger.yaml
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/server.js"]

