# Biblioteca Frontend

Frontend desarrollado en React + TypeScript + Vite para el sistema de gestión de biblioteca.

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

## Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── common/         # Componentes comunes (Button, Modal, Table, etc.)
├── context/            # Contextos de React (AuthContext)
├── hooks/              # Hooks personalizados
├── layouts/            # Layouts (PublicLayout, AdminLayout)
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Páginas del panel de administración
│   └── public/         # Páginas públicas
├── routes/             # Configuración de rutas
├── services/           # Servicios para consumir la API
├── utils/              # Utilidades y tipos
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## Instalación

1. Clonar el repositorio

2. Instalar dependencias:
```bash
cd front
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con la URL de tu API:
```
VITE_API_URL=http://localhost:3000
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera la build de producción
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter

## Funcionalidades

### Parte Pública
- **Home**: Página principal con libros destacados
- **Catálogo**: Listado de todos los libros con búsqueda y paginación
- **Detalle de Libro**: Información detallada de cada libro
- **Contacto**: Formulario de contacto
- **Login/Registro**: Autenticación de usuarios

### Panel de Administración (requiere autenticación)
- **Dashboard**: Vista general con estadísticas
- **Gestión de Libros**: CRUD completo de libros
- **Gestión de Categorías**: CRUD completo de categorías
- **Gestión de Usuarios**: Administración de usuarios (solo admin)

## Control de Acceso por Roles

| Funcionalidad | Admin | Editor | Operador | User |
|--------------|-------|--------|----------|------|
| Ver Dashboard | ✅ | ✅ | ✅ | ❌ |
| Crear/Editar Libros | ✅ | ✅ | ✅ | ❌ |
| Eliminar Libros | ✅ | ❌ | ❌ | ❌ |
| Gestionar Categorías | ✅ | ✅ | ✅ | ❌ |
| Eliminar Categorías | ✅ | ❌ | ❌ | ❌ |
| Gestionar Usuarios | ✅ | ❌ | ❌ | ❌ |

## Consumo de API

El frontend consume los siguientes endpoints de la API:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Libros
- `GET /libros` - Listar libros (con paginación)
- `GET /libros/:id` - Obtener libro por ID
- `POST /libros` - Crear libro (admin)
- `PUT /libros/:id` - Actualizar libro (admin)
- `DELETE /libros/:id` - Eliminar libro (admin)

### Categorías
- `GET /categorias` - Listar categorías
- `GET /categorias/:id` - Obtener categoría por ID
- `POST /categorias` - Crear categoría (admin)
- `PUT /categorias/:id` - Actualizar categoría (admin)
- `DELETE /categorias/:id` - Eliminar categoría (admin)

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario (admin)

## Pruebas Funcionales

### Prueba de Login
1. Acceder a `/login`
2. Ingresar credenciales válidas
3. Verificar redirección y mensaje de éxito

### Prueba de Rutas Protegidas
1. Sin sesión iniciada, intentar acceder a `/admin`
2. Verificar redirección a `/login`
3. Iniciar sesión y verificar acceso al panel

### Prueba de Control de Roles
1. Iniciar sesión como usuario normal
2. Verificar que no puede acceder a funciones de admin
3. Iniciar sesión como admin
4. Verificar acceso completo a todas las funciones

### Prueba de CRUD de Libros
1. Crear un nuevo libro
2. Editar el libro creado
3. Verificar cambios en el listado
4. Eliminar el libro (solo admin)

## Notas Adicionales

- El token JWT se almacena en `localStorage`
- El token se adjunta automáticamente a todas las peticiones
- Si el token expira, el usuario es redirigido al login
- Las sesiones persisten al recargar la página

## Autor

Proyecto desarrollado como parte del curso de desarrollo web.
