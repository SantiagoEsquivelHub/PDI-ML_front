#!/bin/bash

# Script para construir y subir imagen Docker a AWS ECR
# Clasificador de Flores Iris - Frontend

set -e

# Configuración (puedes modificar estos valores)
AWS_REGION="us-east-2"
ECR_REPOSITORY_NAME="ml-santiago-frontend"
IMAGE_TAG="${1:-latest}"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando proceso de deployment a ECR${NC}"
echo "======================================================"

# Verificar que AWS CLI esté instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado. Por favor instálalo primero.${NC}"
    echo "Instalación: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Verificar que Docker esté instalado y corriendo
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker no está corriendo. Por favor inicia Docker.${NC}"
    exit 1
fi

# Obtener Account ID de AWS
echo -e "${YELLOW}📋 Obteniendo información de la cuenta AWS...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ No se pudo obtener el Account ID. Verifica tu configuración de AWS CLI.${NC}"
    exit 1
fi

echo "Account ID: $AWS_ACCOUNT_ID"
echo "Región: $AWS_REGION"
echo "Repositorio: $ECR_REPOSITORY_NAME"
echo "Tag: $IMAGE_TAG"

# Construir URI completa del repositorio ECR
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_NAME"

echo -e "${YELLOW}🔍 Verificando si el repositorio ECR existe...${NC}"
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION &> /dev/null; then
    echo -e "${YELLOW}📦 Creando repositorio ECR: $ECR_REPOSITORY_NAME${NC}"
    aws ecr create-repository \
        --repository-name $ECR_REPOSITORY_NAME \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true \
        --encryption-configuration encryptionType=AES256
    
    echo -e "${GREEN}✅ Repositorio ECR creado exitosamente${NC}"
else
    echo -e "${GREEN}✅ Repositorio ECR ya existe${NC}"
fi

# Login a ECR
echo -e "${YELLOW}🔐 Autenticando con ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Construir imagen Docker
echo -e "${YELLOW}🏗️  Construyendo imagen Docker...${NC}"
docker build -t $ECR_REPOSITORY_NAME:$IMAGE_TAG .

# Etiquetar imagen para ECR
echo -e "${YELLOW}🏷️  Etiquetando imagen para ECR...${NC}"
docker tag $ECR_REPOSITORY_NAME:$IMAGE_TAG $ECR_URI:$IMAGE_TAG

# Subir imagen a ECR
echo -e "${YELLOW}⬆️  Subiendo imagen a ECR...${NC}"
docker push $ECR_URI:$IMAGE_TAG

echo ""
echo -e "${GREEN}🎉 ¡Deployment exitoso!${NC}"
echo "======================================================"
echo -e "Imagen disponible en: ${GREEN}$ECR_URI:$IMAGE_TAG${NC}"
echo ""
echo "Para usar esta imagen:"
echo "docker pull $ECR_URI:$IMAGE_TAG"
echo "docker run -p 80:80 $ECR_URI:$IMAGE_TAG"
echo ""
echo -e "${YELLOW}📝 Comandos útiles:${NC}"
echo "• Ver imágenes en ECR: aws ecr list-images --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION"
echo "• Eliminar imagen: aws ecr batch-delete-image --repository-name $ECR_REPOSITORY_NAME --image-ids imageTag=$IMAGE_TAG --region $AWS_REGION"
echo "• Ver repositorios: aws ecr describe-repositories --region $AWS_REGION"
