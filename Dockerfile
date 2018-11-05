# Imagen Docker base/inicial
FROM node:latest

# Crear directorio del contenedor Docker
WORKDIR /docker-api

# Copiar archivos del proyecto en directorio del contenedor
ADD . /docker-api

# Instalar dependencias de producción
# RUN npm install --only=production

# Exponer puerto escucha del contenedor (mismo que definimos en nuestra API)
EXPOSE 3000

# Lanzar comandos para ejecutar nuesta app
CMD ["npm", "start"]
