
FROM node:20 AS builder
RUN npm install -g pnpm
WORKDIR /frontend
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY .env* ./
COPY . .
ENV NODE_OPTIONS="--openssl-legacy-provider"
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]