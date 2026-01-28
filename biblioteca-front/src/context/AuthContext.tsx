import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../utils/types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<Partial<User>>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getUser();
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<Partial<User>> => {
    const { user } = await authService.login(credentials);
    setUser(user);
    return user;
  };

  const register = async (data: RegisterData) => {
    const { user } = await authService.register(data);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    const userRole = user.role.toUpperCase();
    return roles.some((role) => role.toUpperCase() === userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isLoading,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
