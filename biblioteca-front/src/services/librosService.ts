import api from './api';
import { Libro, CreateLibroData, ApiResponse, PaginatedResponse, QueryParams } from '../utils/types';

export const librosService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Libro>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Libro>>>('/libros', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Libro> {
    const response = await api.get<ApiResponse<Libro>>(`/libros/${id}`);
    return response.data.data;
  },

  async create(data: CreateLibroData): Promise<Libro> {
    const response = await api.post<ApiResponse<Libro>>('/libros', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateLibroData>): Promise<Libro> {
    const response = await api.put<ApiResponse<Libro>>(`/libros/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<Libro> {
    const response = await api.delete<ApiResponse<Libro>>(`/libros/${id}`);
    return response.data.data;
  },
};
