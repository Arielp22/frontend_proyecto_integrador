import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-700 text-white shadow-lg">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              Biblioteca Nacional
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-primary-200 transition">
                Inicio
              </Link>
              <Link to="/catalogo" className="hover:text-primary-200 transition">
                Catálogo
              </Link>
              <Link to="/contacto" className="hover:text-primary-200 transition">
                Contacto
              </Link>
              
              {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'admin') && (
                <Link to="/admin" className="hover:text-primary-200 transition">
                  Panel Admin
                </Link>
              )}
              
              {isAuthenticated && (
                <Link to="/mis-prestamos" className="hover:text-primary-200 transition">
                  Mis Préstamos
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <span className="text-primary-200">
                    Hola, {user?.username}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-primary-700 px-4 py-2 rounded font-medium hover:bg-primary-100 transition"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>

      {/* Pie de Página */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Biblioteca Nacional</h3>
              <p className="text-gray-400">
                Sistema de gestión de biblioteca nacional con catálogo digital y préstamos en línea.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
                <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@biblioteca.com</li>
                <li>Teléfono: (123) 456-7890</li>
                <li>Dirección: Calle Principal 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Biblioteca Nacional. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
