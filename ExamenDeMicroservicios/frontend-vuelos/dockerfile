FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

EXPOSE 5172

CMD ["bunx", "serve", ".", "-l", "tcp://0.0.0.0:5172"]