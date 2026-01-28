# Biblioteca Frontend

Sistema de gestión de biblioteca desarrollado con React + TypeScript + Vite.

## Requisitos

- Node.js 18+
- Backend API en `http://localhost:3000`

## Tecnologías

- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Axios

## Instalación

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración

Crear archivo `.env` con:
```
VITE_API_URL=http://localhost:3000
```

## Funcionalidades

### Área Pública
- Catálogo de libros con búsqueda y paginación
- Detalle de libro
- Login/Registro

### Área Administrativa
- Dashboard con estadísticas
- CRUD de libros
- CRUD de categorías
- Gestión de usuarios (solo admin)

## Endpoints API

**Autenticación**
- `POST /auth/login` - Login
- `POST /auth/register` - Registro

**Libros**
- `GET /libros` - Listar
- `GET /libros/:id` - Ver detalle
- `POST /libros` - Crear (admin)
- `PUT /libros/:id` - Actualizar (admin)
- `DELETE /libros/:id` - Eliminar (admin)

**Categorías**
- `GET /categorias` - Listar
- `POST /categorias` - Crear (admin)
- `PUT /categorias/:id` - Actualizar (admin)
- `DELETE /categorias/:id` - Eliminar (admin)

**Usuarios**
- `GET /users` - Listar (admin)
- `PUT /users/:id` - Actualizar
- `DELETE /users/:id` - Eliminar (admin)

## Seguridad

- Autenticación con JWT almacenado en localStorage
- Rutas protegidas por rol
- Token adjuntado automáticamente en peticiones

## Autores

Proyecto Integrador - Programación 3  
Integrantes: Ariel Paucar, Dario Simbaña, Anthony Gualotuña

