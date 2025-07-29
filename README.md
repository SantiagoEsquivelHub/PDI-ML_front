# Clasificador de Flores Iris

Aplicación web para clasificar especies de flores Iris utilizando machine learning.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

## Ejecución

```bash
npm start
```

La aplicación se ejecutará en [http://localhost:3000](http://localhost:3000)

## Características

- Interfaz sencilla para ingresar medidas de flores Iris
- Clasificación en tiempo real usando machine learning
- Visualización de resultados con porcentajes de confianza
- Datos de ejemplo incluidos
- Monitoreo de estado de la API backend
- Diseño responsivo y user-friendly

## Arquitectura

Para una descripción detallada de la arquitectura del sistema, consulta:
📋 **[Documentación de Arquitectura](./ARQUITECTURA.md)**


## Tecnologías Utilizadas

- React
- Tailwind CSS
- Lucide Icons

## Docker

### Desarrollo Local
```bash
./docker-dev.sh
```

### Deploy a AWS ECR
```bash
# Configurar AWS CLI primero
aws configure

# Subir imagen
./deploy-to-ecr.sh [tag]
```
