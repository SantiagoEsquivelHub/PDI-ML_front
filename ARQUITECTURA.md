# Arquitectura del Sistema Frontend - Clasificador Iris

### **Capa de Presentación (Frontend)**
- **React Components**: Componentes funcionales con hooks para gestión de estado
- **Tailwind CSS**: Framework de utilidades para diseño responsivo
- **Gestión de Estado**: React hooks (useState, useEffect) para estado local

### **Capa de Comunicación**
- **Fetch API**: Cliente HTTP nativo para comunicación asíncrona
- **CORS Handling**: Manejo de políticas de origen cruzado
- **Error Handling**: Gestión robusta de errores de red y API

### **Capa de Servicios (Backend)**
- **API REST**: Servicios de machine learning expuestos via HTTP
- **Health Check**: Monitoreo de estado del servicio
- **ML Inference**: Motor de predicción de especies Iris

### **Flujo de Datos**
1. **Entrada**: Usuario ingresa medidas morfológicas
2. **Validación**: Validación client-side de datos
3. **Comunicación**: Petición HTTP POST al endpoint de predicción
4. **Procesamiento**: Modelo ML procesa datos y genera predicción
5. **Respuesta**: Resultados con especies, confianza y probabilidades
6. **Visualización**: Presentación de resultados en interfaz usuario

