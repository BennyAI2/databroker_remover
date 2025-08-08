# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]