# Diagrama de Arquitectura - Aplicación Fullstack React + AWS

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USUARIOS                                       │
│                                                                          │
│  ┌──────────────────┐              ┌──────────────────┐                │
│  │ Usuario Anónimo  │              │  Admin Usuario   │                │
│  └────────┬─────────┘              └────────┬─────────┘                │
│           │                                  │                           │
└───────────┼──────────────────────────────────┼───────────────────────────┘
            │                                  │
            │                                  │
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                                  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    CloudFront CDN                             │      │
│  │                   (Distribución Global)                       │      │
│  └───────────────────────┬──────────────────────────────────────┘      │
│                          │                                              │
│  ┌───────────────────────▼──────────────────────────────────────┐      │
│  │                      S3 Bucket                                │      │
│  │              (Static Website Hosting)                         │      │
│  │                                                               │      │
│  │  • index.html                                                 │      │
│  │  • React App (SPA)                                            │      │
│  │  • /            → Formulario público                          │      │
│  │  • /admin       → Login + Dashboard                           │      │
│  └───────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
            │
            │ HTTPS
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATION LAYER                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                   Amazon Cognito                              │      │
│  │                                                               │      │
│  │  • User Pool (Admin único)                                    │      │
│  │  • JWT Token Generation                                       │      │
│  │  • Identity Provider                                          │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
            │
            │ JWT Token
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                                    │
│                      (Serverless Architecture)                           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    API Gateway (REST)                         │      │
│  │                                                               │      │
│  │  Endpoints:                                                   │      │
│  │  • POST   /solicitudes  (Público)                             │      │
│  │  • GET    /solicitudes  (Protegido - Cognito Authorizer)     │      │
│  └───────────────────────┬──────────────────────────────────────┘      │
│                          │                                              │
│           ┌──────────────┴──────────────┐                              │
│           │                             │                              │
│           ▼                             ▼                              │
│  ┌────────────────────┐      ┌────────────────────┐                   │
│  │  Lambda Function   │      │  Lambda Function   │                   │
│  │ createSolicitud    │      │  getSolicitudes    │                   │
│  │                    │      │                    │                   │
│  │ • Validación       │      │ • Auth verificada  │                   │
│  │ • Guardado en DB   │      │ • Consulta DB      │                   │
│  │ • Respuesta 201    │      │ • Retorna lista    │                   │
│  └─────────┬──────────┘      └─────────┬──────────┘                   │
│            │                           │                              │
└────────────┼───────────────────────────┼──────────────────────────────┘
             │                           │
             │                           │
             ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                      DynamoDB                                 │      │
│  │                 (NoSQL Database)                              │      │
│  │                                                               │      │
│  │  Table: Solicitudes                                           │      │
│  │  ┌───────────────────────────────────────────────┐           │      │
│  │  │ PK: id (UUID)                                 │           │      │
│  │  │ Attributes:                                   │           │      │
│  │  │  - nombre: string                             │           │      │
│  │  │  - email: string                              │           │      │
│  │  │  - monto: number                              │           │      │
│  │  │  - tipo: string                               │           │      │
│  │  │  - comentarios: string                        │           │      │
│  │  │  - fechaCreacion: string (ISO)                │           │      │
│  │  └───────────────────────────────────────────────┘           │      │
│  │                                                               │      │
│  │  • On-Demand Billing                                          │      │
│  │  • No servidor que administrar                                │      │
│  │  • Escalamiento automático                                    │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      SECURITY & IAM                                      │
│                                                                          │
│  • Lambda Execution Role → DynamoDB (PutItem, Scan)                     │
│  • API Gateway Cognito Authorizer → Valida JWT                          │
│  • CloudFront → S3 (OAI - Origin Access Identity)                       │
│  • Principle of Least Privilege en todos los roles                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Flujo Usuario Anónimo - Crear Solicitud

```
Usuario → CloudFront → S3 (React App)
    ↓
Completa formulario
    ↓
POST /solicitudes → API Gateway
    ↓
Lambda: createSolicitud
    ↓
Validación de datos
    ↓
DynamoDB.putItem()
    ↓
Respuesta 201 Created
    ↓
Mensaje de confirmación en UI
```

### 2. Flujo Admin - Ver Solicitudes

```
Admin → CloudFront → S3 (React App)
    ↓
Navega a /admin
    ↓
Login Form → Cognito
    ↓
Cognito valida credenciales
    ↓
Retorna JWT Token
    ↓
Token guardado en Context
    ↓
GET /solicitudes + JWT → API Gateway
    ↓
API Gateway Authorizer valida JWT
    ↓
Lambda: getSolicitudes
    ↓
DynamoDB.scan()
    ↓
Respuesta 200 + lista de solicitudes
    ↓
Tabla renderizada en UI
```

## Componentes de Infraestructura (AWS CDK)

### Stack 1: Frontend Stack

- **S3 Bucket**: Hosting estático
- **CloudFront Distribution**: CDN global
- **OAI**: Acceso seguro S3 → CloudFront

### Stack 2: Auth Stack

- **Cognito User Pool**: Autenticación
- **App Client**: Configuración para React
- **Admin User**: Pre-creado

### Stack 3: Database Stack

- **DynamoDB Table**: Solicitudes
- **GSI (opcional)**: Índices para queries

### Stack 4: Backend Stack

- **API Gateway**: REST API
- **Lambda Functions**:
  - createSolicitud
  - getSolicitudes
- **IAM Roles**: Permisos Lambda → DynamoDB
- **Cognito Authorizer**: Protección endpoints

## Justificación de Arquitectura Serverless

### Ventajas Elegidas

1. **Costo-Eficiencia**: Pay-per-use, ideal para cargas variables
2. **Escalamiento Automático**: Lambda escala según demanda
3. **Sin Administración de Servidores**: AWS maneja infraestructura
5. **Alta Disponibilidad**: Multi-AZ por defecto
6. **Integración Nativa**: Cognito + API Gateway + Lambda

### Caso de Uso Específico

Para este proyecto:

- **Tráfico Esperado**: Bajo a medio
- **Endpoints**: Solo 2 (crear y listar)
- **Complejidad**: Baja

**Conclusión**: Serverless es la opción óptima.

## Seguridad

### Medidas Implementadas

1. **HTTPS**: CloudFront + Certificate Manager
2. **JWT**: Tokens firmados por Cognito
3. **IAM Roles**: Least privilege principle
4. **API Gateway Throttling**: Rate limiting
5. **CORS**: Configurado para origen específico
6. **Input Validation**: En Lambda functions
7. **Environment Variables**: Secrets en AWS SSM/Secrets Manager

## Monitoreo y Logs

- **CloudWatch Logs**: Logs de Lambda
- **CloudWatch Metrics**: Métricas de API Gateway
- **CloudWatch Alarms**: Alertas en errores

---

**Fecha de creación**: Noviembre 2025  
**Versión**: 1.0
