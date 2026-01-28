import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { librosService } from '../../services/librosService';
import { categoriasService } from '../../services/categoriasService';
import { usersService } from '../../services/usersService';
import Card, { CardBody } from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

interface Stats {
  totalLibros: number;
  totalCategorias: number;
  totalUsuarios: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalLibros: 0, totalCategorias: 0, totalUsuarios: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [librosRes, categoriasRes, usersRes] = await Promise.all([
          librosService.getAll({ limit: 1 }),
          categoriasService.getAll({ limit: 1 }),
          usersService.getAll({ limit: 1 }),
        ]);

        setStats({
          totalLibros: librosRes.meta.totalItems,
          totalCategorias: categoriasRes.meta.totalItems,
          totalUsuarios: usersRes.meta.totalItems,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const statsCards = [
    {
      title: 'Total Libros',
      value: stats.totalLibros,
      icon: '📚',
      color: 'bg-blue-500',
      link: '/admin/libros',
    },
    {
      title: 'Categorías',
      value: stats.totalCategorias,
      icon: '🏷️',
      color: 'bg-green-500',
      link: '/admin/categorias',
    },
    {
      title: 'Usuarios',
      value: stats.totalUsuarios,
      icon: '👥',
      color: 'bg-purple-500',
      link: '/admin/usuarios',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.username}
        </h1>
        <p className="text-gray-600">Panel de administración de la Biblioteca Nacional</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition">
              <CardBody>
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg text-white text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/libros"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Agregar Libro
            </Link>
            <Link
              to="/admin/categorias"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Nueva Categoría
            </Link>
            <Link
              to="/admin/usuarios"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Gestionar Usuarios
            </Link>
            <Link
              to="/admin/mensajes"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Mensajes de Contacto
            </Link>
            <Link
              to="/"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Ver Sitio Público
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
