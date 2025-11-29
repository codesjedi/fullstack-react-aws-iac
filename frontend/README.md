# Frontend - Aplicación de Solicitudes

Aplicación React construida con Vite y TypeScript. Permite a usuarios anónimos crear solicitudes y a administradores gestionarlas.

##  Prerrequisitos

- Node.js 18+
- pnpm

## ️ Configuración

Antes de iniciar la aplicación, necesitas configurar las variables de entorno.

### Opción A: Generación Automática (Recomendada después del deploy)

Si ya has desplegado la infraestructura con CDK, puedes generar el archivo `.env` automáticamente usando el script incluido en el proyecto raíz:

```bash
# Desde la raíz del proyecto
node scripts/generate-frontend-env.js
```

### Opción B: Configuración Manual

Crea un archivo `.env` en la carpeta `frontend/` con el siguiente contenido:

```env
VITE_API_URL=https://tu-api-id.execute-api.us-east-1.amazonaws.com/prod/
VITE_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

Puedes obtener estos valores desde la consola de AWS (CloudFormation > Outputs) o desde la terminal al finalizar el despliegue de CDK.

##  Ejecución Local

1. **Instalar dependencias** (si no lo has hecho en la raíz):
   ```bash
   pnpm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

3. **Abrir en el navegador**:
   La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la consola).

##  Build para Producción

Para compilar la aplicación para despliegue (esto es usado por el stack de CDK para subir a S3):

```bash
pnpm build
```

Los archivos generados estarán en la carpeta `dist/`.
