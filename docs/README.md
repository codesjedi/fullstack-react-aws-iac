# Fullstack React + AWS Infrastructure

Sistema de gestión de solicitudes con frontend en React y backend serverless en AWS.

## Arquitectura

- **Frontend**: React + Vite (S3 + CloudFront)
- **Backend**: Lambda + API Gateway
- **Base de datos**: DynamoDB
- **Autenticación**: Cognito
- **IaC**: AWS CDK (TypeScript)

## Prerequisitos

- Node.js 18+
- pnpm
- AWS CLI configurado
- AWS CDK CLI: `npm install -g aws-cdk`

## Instalación

### Instalar dependencias

```bash
pnpm install
```

## Bootstrap CDK (solo primera vez)

```bash
cd infrastructure
pnpm cdk bootstrap
```

## Deployment

### 1. Compilar backend

```bash
pnpm backend:build
```

### 2. Desplegar infraestructura

```bash
cd infrastructure
pnpm cdk deploy --all
```

Esto desplegará:

- `SolicitudesAuthStack` - Cognito User Pool
- `SolicitudesDbStack` - DynamoDB
- `SolicitudesBackendStack` - Lambda + API Gateway
- `SolicitudesFrontendStack` - S3 + CloudFront

### 3. Configurar variables de entorno del frontend

Después del deploy, copia los outputs de CDK:

```bash
frontend/.env
VITE_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/
VITE_USER_POOL_ID=us-east-1_xxxxxxx
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxx
```

### 4. Crear usuario admin

```bash
aws cognito-idp admin-create-user
--user-pool-id <USER_POOL_ID>
--username admin
--user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true
--temporary-password TempPassword123!

aws cognito-idp admin-set-user-password
--user-pool-id <USER_POOL_ID>
--username admin
--password Admin123!
--permanent
```

### 5. Compilar y desplegar frontend

```bash
pnpm frontend:build
```
