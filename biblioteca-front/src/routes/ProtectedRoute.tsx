import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // Usuario autenticado pero sin los roles necesarios
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta sección.</p>
          <a
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
