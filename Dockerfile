# Etapa 1: Construcción
FROM node:22-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar código y construir
COPY . .
RUN npm run build

# Etapa 2: Imagen final para producción
FROM node:22-alpine
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production

# Copiar archivos necesarios desde la etapa de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Instalar dependencias de producción
RUN npm ci --omit=dev --legacy-peer-deps

# Crear usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]