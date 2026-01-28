import api from './api';
import { ApiResponse, PaginatedResponse, QueryParams } from '../utils/types';

export interface Mensaje {
  id: string;
  _id?: string;
  nombre: string;
  email: string;
  mensaje: string;
  createdAt: string;
  updatedAt?: string;
}

const normalizeMensaje = (mensaje: any): Mensaje => ({
  ...mensaje,
  id: mensaje.id || mensaje._id,
});

const normalizeMensajes = (mensajes: any[]): Mensaje[] =>
  mensajes.map(normalizeMensaje);

export const mensajesService = {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Mensaje>> {
    const response = await api.get<ApiResponse<PaginatedResponse<any>>>('/mensajes', { params });
    return {
      ...response.data.data,
      items: normalizeMensajes(response.data.data.items),
    };
  },

  async getById(id: string): Promise<Mensaje> {
    const response = await api.get<ApiResponse<any>>(`/mensajes/${id}`);
    return normalizeMensaje(response.data.data);
  },

  async delete(id: string): Promise<Mensaje> {
    const response = await api.delete<ApiResponse<any>>(`/mensajes/${id}`);
    return normalizeMensaje(response.data.data);
  },
};
