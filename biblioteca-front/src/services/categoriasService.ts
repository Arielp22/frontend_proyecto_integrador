import api from './api';
import { Categoria, CreateCategoriaData, ApiResponse, PaginatedResponse, QueryParams } from '../utils/types';

export const categoriasService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Categoria>>>('/categorias', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Categoria> {
    const response = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoriaData): Promise<Categoria> {
    const response = await api.post<ApiResponse<Categoria>>('/categorias', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateCategoriaData>): Promise<Categoria> {
    const response = await api.put<ApiResponse<Categoria>>(`/categorias/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<Categoria> {
    const response = await api.delete<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data.data;
  },
};
