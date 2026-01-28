import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import Catalogo from '../pages/public/Catalogo';
import LibroDetalle from '../pages/public/LibroDetalle';
import Contacto from '../pages/public/Contacto';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import MisPrestamos from '../pages/public/MisPrestamos';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import LibrosAdmin from '../pages/admin/LibrosAdmin';
import CategoriasAdmin from '../pages/admin/CategoriasAdmin';
import UsuariosAdmin from '../pages/admin/UsuariosAdmin';
import PrestamosAdmin from '../pages/admin/PrestamosAdmin';
import MensajesAdmin from '../pages/admin/MensajesAdmin';

// Protected Route
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="libro/:id" element={<LibroDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="mis-prestamos"
          element={
            <ProtectedRoute requiredRoles={['USER', 'ADMIN']}>
              <MisPrestamos />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Rutas del Admin - Protegidas */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="libros" element={<LibrosAdmin />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="prestamos" element={<PrestamosAdmin />} />
        <Route path="mensajes" element={<MensajesAdmin />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UsuariosAdmin />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">404</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
              <p className="text-gray-600 mb-4">La página que buscas no existe.</p>
              <a
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
