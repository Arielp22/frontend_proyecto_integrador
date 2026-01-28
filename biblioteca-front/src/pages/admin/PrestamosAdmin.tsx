import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { prestamosService, Prestamo, UpdatePrestamoData } from '../../services/prestamosService';
import { usePagination } from '../../hooks/usePagination';
import Card, { CardBody, CardHeader } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ESTADOS = {
  PENDIENTE: 'PENDIENTE',
  ACTIVO: 'ACTIVO',
  RECHAZADO: 'RECHAZADO',
  DEVUELTO: 'DEVUELTO',
};

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  ACTIVO: 'bg-green-100 text-green-800',
  RECHAZADO: 'bg-red-100 text-red-800',
  DEVUELTO: 'bg-blue-100 text-blue-800',
};

export default function PrestamosAdmin() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [saving, setSaving] = useState(false);
  const [newEstado, setNewEstado] = useState('');

  const pagination = usePagination({ initialLimit: 10 });

  const fetchPrestamos = useCallback(async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await prestamosService.getAll(params);
      setPrestamos(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      toast.error('Error al cargar préstamos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search]);

  useEffect(() => {
    fetchPrestamos();
  }, [pagination.page, pagination.search]);

  const handleOpenModal = (prestamo: Prestamo) => {
    setSelectedPrestamo(prestamo);
    setNewEstado(prestamo.estado);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPrestamo(null);
  };

  const handleUpdateEstado = async () => {
    if (!selectedPrestamo || !newEstado) return;

    setSaving(true);
    try {
      const updateData: UpdatePrestamoData = { estado: newEstado };
      
      // Si es DEVUELTO, registrar la fecha de devolución
      if (newEstado === ESTADOS.DEVUELTO) {
        updateData.fecha_devolucion = new Date().toISOString();
      }

      await prestamosService.update(selectedPrestamo.id, updateData);
      toast.success('Estado del préstamo actualizado correctamente');
      handleCloseModal();
      fetchPrestamos();
    } catch (error) {
      toast.error('Error al actualizar el préstamo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPrestamo) return;

    setSaving(true);
    try {
      await prestamosService.delete(selectedPrestamo.id);
      toast.success('Préstamo eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedPrestamo(null);
      fetchPrestamos();
    } catch (error) {
      toast.error('Error al eliminar el préstamo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (prestamo: Prestamo) => {
    setSelectedPrestamo(prestamo);
    setDeleteDialogOpen(true);
  };

  const columns = [
    { 
      key: 'usuario_id', 
      header: 'Usuario',
      render: (prestamo: Prestamo) => prestamo.usuario?.username || '-'
    },
    { 
      key: 'libro_id', 
      header: 'Libro',
      render: (prestamo: Prestamo) => prestamo.libro?.titulo || '-'
    },
    { 
      key: 'fecha_prestamo', 
      header: 'Fecha Préstamo',
      render: (prestamo: Prestamo) => new Date(prestamo.fecha_prestamo).toLocaleDateString()
    },
    { 
      key: 'estado', 
      header: 'Estado',
      render: (prestamo: Prestamo) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[prestamo.estado] || 'bg-gray-100 text-gray-800'}`}>
          {prestamo.estado}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (prestamo: Prestamo) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleOpenModal(prestamo)}>
            Cambiar Estado
          </Button>
          <Button size="sm" variant="danger" onClick={() => openDeleteDialog(prestamo)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Gestión de Préstamos</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6">
            <SearchBar
              onSearch={pagination.updateSearch}
              placeholder="Buscar por usuario o libro..."
            />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Table
                columns={columns}
                data={prestamos}
                keyExtractor={(prestamo) => prestamo.id}
                emptyMessage="No hay préstamos registrados"
              />
              {pagination.meta && (
                <Pagination meta={pagination.meta} onPageChange={pagination.goToPage} />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal de Cambiar Estado del Préstamo */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Cambiar Estado del Préstamo"
        size="md"
      >
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Usuario:</strong> {selectedPrestamo?.usuario?.username}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Libro:</strong> {selectedPrestamo?.libro?.titulo}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Estado Actual:</strong>{' '}
              <span className={`px-2 py-1 rounded text-xs font-medium ${ESTADO_COLORS[selectedPrestamo?.estado || ''] || 'bg-gray-100 text-gray-800'}`}>
                {selectedPrestamo?.estado}
              </span>
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado
            </label>
            <select
              value={newEstado}
              onChange={(e) => setNewEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar estado</option>
              <option value={ESTADOS.PENDIENTE}>Pendiente</option>
              <option value={ESTADOS.ACTIVO}>Activo</option>
              <option value={ESTADOS.RECHAZADO}>Rechazado</option>
              <option value={ESTADOS.DEVUELTO}>Devuelto</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="button" loading={saving} onClick={handleUpdateEstado}>
              Actualizar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Préstamo"
        message={`¿Estás seguro de que deseas eliminar este préstamo? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={saving}
      />
    </div>
  );
}
