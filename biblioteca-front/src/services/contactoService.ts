import api from './api';

export interface ContactoData {
  nombre: string;
  email: string;
  mensaje: string;
}

export const contactoService = {
  async enviarMensaje(data: ContactoData) {
    const response = await api.post('/mensajes', data);
    return response.data;
  },
};
