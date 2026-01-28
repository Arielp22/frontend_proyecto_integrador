import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/libros', label: 'Libros' },
  { path: '/admin/categorias', label: 'Categorías' },
  { path: '/admin/prestamos', label: 'Préstamos' },
  { path: '/admin/usuarios', label: 'Usuarios', roles: ['ADMIN'] },
  { path: '/admin/mensajes', label: 'Mensajes', roles: ['ADMIN'] },
];

export default function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="text-xl font-bold">
            Biblioteca Nacional
          </Link>
          <p className="text-sm text-gray-400 mt-1">Panel de Administración</p>
        </div>
        
        <nav className="mt-4">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 transition ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <Link
            to="/"
            className="text-gray-300 hover:text-white mb-3 block"
          >
            Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {filteredMenuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {user?.username} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
