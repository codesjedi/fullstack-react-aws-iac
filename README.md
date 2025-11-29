# Fullstack React + AWS IaC

Esta es la solución para la prueba técnica de Fullstack Developer. El proyecto implementa una aplicación para gestionar solicitudes utilizando una arquitectura Serverless en AWS, con infraestructura como código (IaC) y un frontend en React.

##  Documentación

- **[Instrucciones de Despliegue](./docs/README.md)**: Guía paso a paso para desplegar toda la infraestructura y aplicaciones en AWS.
- **[Arquitectura](./docs/architecture-diagram.md)**: Diagrama y justificación de las decisiones técnicas.
- **[Requerimientos Originales](./REQUIREMENTS.md)**: El enunciado original de la prueba técnica.

##  Estructura del Proyecto

El repositorio está organizado como un monorepo utilizando pnpm workspaces:

- **`/frontend`**: Aplicación React (Vite + TypeScript) para usuarios y administradores.
- **`/backend`**: Funciones AWS Lambda (Node.js + TypeScript) para la lógica de negocio.
- **`/infrastructure`**: Código AWS CDK para definir y desplegar los recursos en la nube.
- **`/shared`**: Tipos y utilidades compartidas entre frontend y backend.
- **`/docs`**: Documentación detallada del proyecto.

##  Inicio Rápido

Para levantar el proyecto desde cero, por favor consulta la guía detallada en [`docs/README.md`](./docs/README.md).

### Prerrequisitos
- Node.js 18+
- pnpm
- AWS CLI configurado
- AWS CDK CLI

### Instalación General

```bash
# Instalar dependencias de todo el monorepo
pnpm install
```

##  Tecnologías Principales

- **Frontend**: React, TypeScript, Vite, AWS Amplify Auth.
- **Backend**: AWS Lambda, API Gateway, DynamoDB.
- **Infraestructura**: AWS CDK (TypeScript).
- **CI/CD & Tooling**: pnpm workspaces, ESLint.
