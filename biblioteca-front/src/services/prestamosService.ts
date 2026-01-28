import api from './api';
import { ApiResponse, PaginatedResponse, QueryParams } from '../utils/types';
import { usersService } from './usersService';
import { librosService } from './librosService';

export interface Prestamo {
  id: string;
  usuario_id: string;
  libro_id: string;
  fecha_prestamo: string;
  fecha_devolucion?: string;
  estado: string;
  usuario?: { id?: string; username: string; email?: string };
  libro?: { id?: string; titulo: string };
}

export interface UpdatePrestamoData {
  estado?: string;
  fecha_devolucion?: string;
}

const enrichPrestamos = async (prestamos: Prestamo[]): Promise<Prestamo[]> => {
  try {
    return await Promise.all(
      prestamos.map(async (prestamo) => {
        const enriched = { ...prestamo };

        // Obtener info del usuario si no viene incluida
        if (!enriched.usuario && prestamo.usuario_id) {
          try {
            const user = await usersService.getById(prestamo.usuario_id);
            enriched.usuario = {
              id: user.id,
              username: user.username,
              email: user.email,
            };
          } catch (error) {
            console.error(`Error fetching user ${prestamo.usuario_id}:`, error);
          }
        }

        // Obtener info del libro si no viene incluida
        if (!enriched.libro && prestamo.libro_id) {
          try {
            const libro = await librosService.getById(prestamo.libro_id);
            enriched.libro = {
              id: libro.id,
              titulo: libro.titulo,
            };
          } catch (error) {
            console.error(`Error fetching libro ${prestamo.libro_id}:`, error);
          }
        }

        return enriched;
      })
    );
  } catch (error) {
    console.error('Error enriching prestamos:', error);
    return prestamos;
  }
};

export const prestamosService = {
  async crearPrestamo(usuarioId: string, libroId: string) {
    const response = await api.post('/prestamos', {
      usuario_id: usuarioId,
      libro_id: libroId,
      fecha_prestamo: new Date(),
      estado: 'PENDIENTE',
    });
    return response.data;
  },

  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<Prestamo>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Prestamo>>>('/prestamos', {
      params,
    });
    const data = response.data.data;
    
    // Enriquecer los datos con info de usuario y libro
    const enrichedItems = await enrichPrestamos(data.items);
    
    return {
      ...data,
      items: enrichedItems,
    };
  },

  async getById(id: string): Promise<Prestamo> {
    const response = await api.get<ApiResponse<Prestamo>>(`/prestamos/${id}`);
    const prestamo = response.data.data;
    
    const enriched = await enrichPrestamos([prestamo]);
    return enriched[0];
  },

  async update(id: string, data: UpdatePrestamoData): Promise<Prestamo> {
    const response = await api.put<ApiResponse<Prestamo>>(`/prestamos/${id}`, data);
    const prestamo = response.data.data;
    
    const enriched = await enrichPrestamos([prestamo]);
    return enriched[0];
  },

  async delete(id: string): Promise<Prestamo> {
    const response = await api.delete<ApiResponse<Prestamo>>(`/prestamos/${id}`);
    return response.data.data;
  },
};
