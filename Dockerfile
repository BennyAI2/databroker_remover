# Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Run stage
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]
