// Tipos de usuario y autenticación
export interface User {
  id: string;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  role: string;
  isActive: boolean;
  profile?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
  };
}

// Tipos de libro
export interface Libro {
  id: string;
  titulo: string;
  autor?: string;
  anio_publicacion?: number;
  numero_paginas?: number;
  cantidad_disponible: number;
  categoria_id?: string;
  editorial_id?: string;
  idioma_id?: string;
  tipo_libro_id?: string;
  estado_id?: string;
  imagen_url?: string;
}

export interface CreateLibroData {
  titulo: string;
  autor?: string;
  anio_publicacion?: number;
  numero_paginas?: number;
  cantidad_disponible: number;
  categoria_id?: string;
  editorial_id?: string;
  idioma_id?: string;
  tipo_libro_id?: string;
  estado_id?: string;
  imagen_url?: string;
}

// Tipos de categoría
export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface CreateCategoriaData {
  nombre: string;
  descripcion?: string;
}

// Tipos de paginación
export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Tipos de query
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  searchField?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Roles de usuario
export type UserRole = 'ADMIN' | 'USER';

// Tipos de JWT decodificado
export interface DecodedToken {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}
