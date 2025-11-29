# Documentación de API

Esta documentación describe los endpoints disponibles en la API de Solicitudes.

## Base URL

La URL base se obtiene tras el despliegue de la infraestructura (Output: `SolicitudesApiUrl`).
Ejemplo: `https://xyz123.execute-api.us-east-1.amazonaws.com/prod`

## Endpoints

### 1. Crear Solicitud

Crea una nueva solicitud en el sistema.

- **Método:** `POST`
- **Ruta:** `/solicitudes`
- **Acceso:** Público
- **Body (JSON):**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "amount": 1000000,
  "type": "prestamo",
  "comments": "Solicitud de prueba"
}
```

- **Respuesta Exitosa (201 Created):**

```json
{
  "message": "Solicitud creada",
  "solicitud": {
    "id": "uuid-v4",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "amount": 1000000,
    "type": "prestamo",
    "comments": "Solicitud de prueba",
    "createdAt": "2023-11-29T10:00:00.000Z"
  }
}
```

### 2. Listar Solicitudes

Obtiene el listado completo de solicitudes ordenadas por fecha (más recientes primero).

- **Método:** `GET`
- **Ruta:** `/solicitudes`
- **Acceso:** Privado (Requiere Token Bearer)
- **Headers:**
  - `Authorization`: `Bearer <COGNITO_ID_TOKEN>`

- **Respuesta Exitosa (200 OK):**

```json
{
  "count": 2,
  "data": [
    {
      "id": "uuid-1",
      "name": "Maria Gonzalez",
      "amount": 500000,
      "createdAt": "2023-11-29T11:00:00.000Z",
      ...
    },
    {
      "id": "uuid-2",
      "name": "Juan Pérez",
      "amount": 1000000,
      "createdAt": "2023-11-29T10:00:00.000Z",
      ...
    }
  ]
}
```

## Colección Postman

Se incluye un archivo de colección de Postman para facilitar las pruebas:
[postman_collection.json](./postman_collection.json)

Para usarla:
1. Importar el archivo en Postman.
2. Configurar la variable `baseUrl` con la URL de tu API Gateway.
3. Para el endpoint protegido, configurar la variable `authToken` con un ID Token válido (puedes obtenerlo logueándote en el frontend y revisando el LocalStorage o la consola de red).
