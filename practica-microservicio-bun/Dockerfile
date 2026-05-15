FROM oven/bun:1-alpine
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copiar el resto del código (incluyendo la carpeta src)
COPY . .

# Usar el usuario seguro integrado
USER bun

EXPOSE 3000

# Correr directamente el TypeScript (Bun lo hace rapidísimo)
CMD ["bun", "run", "src/index.ts"]