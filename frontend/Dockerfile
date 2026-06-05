FROM node:20-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci

COPY . .
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5173
CMD ["npm", "run", "dev"]