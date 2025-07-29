# Dockerfile para aplicación React - Clasificador de Flores Iris

# Etapa de construcción
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
