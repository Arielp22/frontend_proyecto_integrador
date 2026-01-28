import api from './api';
import { User, ApiResponse, PaginatedResponse, QueryParams } from '../utils/types';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  role?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  role?: string;
  isActive?: boolean;
}

export const usersService = {
  async getAll(params: QueryParams = {}, isActive?: boolean): Promise<PaginatedResponse<User>> {
    const queryParams = { ...params, ...(isActive !== undefined && { isActive: String(isActive) }) };
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: queryParams });
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<User> {
    const response = await api.delete<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async uploadProfile(id: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('profile', file);
    const response = await api.put<ApiResponse<User>>(`/users/profile/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
