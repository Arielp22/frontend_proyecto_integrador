import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User, DecodedToken } from '../utils/types';

// Decodificar JWT manualmente (sin dependencias externas)
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: Partial<User> }> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const token = response.data.data.access_token;
    
    // Decodificar el token para obtener información del usuario
    const decoded = decodeToken(token);
    
    if (!decoded) {
      throw new Error('Token inválido');
    }

    const role = decoded.role?.toUpperCase?.() as string | undefined;

    const user: Partial<User> = {
      id: decoded.id,
      username: decoded.username,
      role,
    };

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  async register(data: RegisterData): Promise<{ token: string; user: Partial<User> }> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const token = response.data.data.access_token;
    
    const decoded = decodeToken(token);
    
    if (!decoded) {
      throw new Error('Token inválido');
    }

    const role = decoded.role?.toUpperCase?.() as string | undefined;

    const user: Partial<User> = {
      id: decoded.id,
      username: decoded.username,
      role,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): Partial<User> | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  },

  hasRole(requiredRoles: string[]): boolean {
    const user = this.getUser();
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  },
};
