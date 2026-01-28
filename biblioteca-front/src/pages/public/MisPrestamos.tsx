import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { prestamosService, Prestamo } from '../../services/prestamosService';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  ACTIVO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
  DEVUELTO: 'bg-blue-100 text-blue-800',
};

const ESTADO_DESCRIPCION: Record<string, string> = {
  PENDIENTE: 'Tu solicitud está en espera de aprobación',
  ACTIVO: 'Préstamo aprobado - tienes el libro',
  RECHAZADO: 'Tu solicitud fue rechazada',
  DEVUELTO: 'Préstamo completado',
};

export default function MisPrestamos() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMisPrestamos = async () => {
      setLoading(true);
      try {
        // Obtener todos los préstamos y filtrar por usuario actual
        const response = await prestamosService.getAll({ limit: 100 });
        const misPrestamos = response.items.filter((p) => p.usuario_id === user?.id);
        setPrestamos(misPrestamos);
      } catch (error) {
        toast.error('Error al cargar tus préstamos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisPrestamos();
  }, [isAuthenticated, user?.id, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const columns = [
    {
      key: 'libro_id',
      header: 'Libro',
      render: (prestamo: Prestamo) => prestamo.libro?.titulo || '-',
    },
    {
      key: 'fecha_prestamo',
      header: 'Fecha Solicitud',
      render: (prestamo: Prestamo) => new Date(prestamo.fecha_prestamo).toLocaleDateString(),
    },
    {
      key: 'fecha_devolucion',
      header: 'Fecha Devolución',
      render: (prestamo: Prestamo) =>
        prestamo.fecha_devolucion
          ? new Date(prestamo.fecha_devolucion).toLocaleDateString()
          : '-',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (prestamo: Prestamo) => (
        <div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              ESTADO_COLORS[prestamo.estado] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {prestamo.estado}
          </span>
          <p className="text-xs text-gray-600 mt-1">
            {ESTADO_DESCRIPCION[prestamo.estado]}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Mis Préstamos</h2>
            <Button onClick={() => navigate('/catalogo')}>
              Volver al Catálogo
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loader />
          ) : prestamos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Aún no tienes solicitudes de préstamo</p>
              <Button onClick={() => navigate('/catalogo')}>
                Explorar Catálogo
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Información:</strong> Puedes ver el estado de tus solicitudes de préstamo aquí.
                  Los préstamos pendientes serán procesados por nuestro equipo.
                </p>
              </div>
              <Table
                columns={columns}
                data={prestamos}
                keyExtractor={(prestamo) => prestamo.id}
                emptyMessage="No hay préstamos"
              />

              {/* Resumen de estados */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {['PENDIENTE', 'ACTIVO', 'RECHAZADO', 'DEVUELTO'].map((estado) => {
                  const cantidad = prestamos.filter((p) => p.estado === estado).length;
                  return (
                    <div
                      key={estado}
                      className={`p-4 rounded-lg text-center ${ESTADO_COLORS[estado]}`}
                    >
                      <p className="text-2xl font-bold">{cantidad}</p>
                      <p className="text-sm">{estado}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
