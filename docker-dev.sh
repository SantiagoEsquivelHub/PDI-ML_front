#!/bin/bash

# Script para desarrollo local con Docker
# Clasificador de Flores Iris - Frontend

set -e

# Configuración
IMAGE_NAME="iris-classifier-frontend"
CONTAINER_NAME="iris-classifier-dev"
PORT="3000"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando desarrollo local con Docker${NC}"
echo "=============================================="

# Detener y eliminar contenedor existente si existe
if docker ps -a --format 'table {{.Names}}' | grep -q $CONTAINER_NAME; then
    echo -e "${YELLOW}🛑 Deteniendo contenedor existente...${NC}"
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# Construir imagen
echo -e "${YELLOW}🏗️  Construyendo imagen Docker...${NC}"
docker build -t $IMAGE_NAME .

# Ejecutar contenedor
echo -e "${YELLOW}🚀 Iniciando contenedor...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    $IMAGE_NAME

echo ""
echo -e "${GREEN}✅ Aplicación corriendo en: http://localhost:$PORT${NC}"
echo ""
echo "Comandos útiles:"
echo "• Ver logs: docker logs $CONTAINER_NAME"
echo "• Detener: docker stop $CONTAINER_NAME"
echo "• Reiniciar: docker restart $CONTAINER_NAME"
echo "• Eliminar: docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME"
