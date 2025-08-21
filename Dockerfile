
FROM node:20 AS builder

RUN npm install -g pnpm

WORKDIR /frontend

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY .env* ./

COPY . .

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN pnpm build

FROM alpine:latest
COPY --from=builder /frontend/dist /dist

CMD ["find", "/dist", "-type", "f", "-name", "*.html", "-o", "-name", "*.js", "-o", "-name", "*.css", "-o", "-name", "manifest*"]