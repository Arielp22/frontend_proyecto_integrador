import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { mensajesService, Mensaje } from '../../services/mensajesService';
import Card, { CardBody, CardHeader } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { usePagination } from '../../hooks/usePagination';

const formatDateTime = (dateString: string): string => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  } catch {
    return '-';
  }
};

export default function MensajesAdmin() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMensaje, setSelectedMensaje] = useState<Mensaje | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const pagination = usePagination();

  const fetchMensajes = async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await mensajesService.getAll(params);
      setMensajes(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      toast.error('Error al cargar los mensajes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, [pagination.page, pagination.limit, pagination.search]);

  const handleOpenModal = (mensaje: Mensaje) => {
    setSelectedMensaje(mensaje);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMensaje(null);
  };

  const handleDelete = async () => {
    if (!selectedMensaje) return;

    setDeleteLoading(true);
    try {
      await mensajesService.delete(selectedMensaje.id);
      toast.success('Mensaje eliminado correctamente');
      handleCloseModal();
      fetchMensajes();
    } catch (error) {
      toast.error('Error al eliminar el mensaje');
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (mensaje: Mensaje) => mensaje.nombre,
    },
    {
      key: 'email',
      header: 'Email',
      render: (mensaje: Mensaje) => mensaje.email,
    },
    {
      key: 'mensaje',
      header: 'Mensaje',
      render: (mensaje: Mensaje) => (
        <div className="truncate max-w-xs" title={mensaje.mensaje}>
          {mensaje.mensaje}
        </div>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (mensaje: Mensaje) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleOpenModal(mensaje)}
          >
            Ver
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">Mensajes de Contacto</h1>
            <span className="text-sm text-gray-600">
              Total: {pagination.meta?.totalItems || 0}
            </span>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Loader />
          ) : mensajes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay mensajes disponibles</p>
            </div>
          ) : (
            <div>
              <Table
                columns={columns}
                data={mensajes}
                keyExtractor={(mensaje, index) => mensaje.id || `mensaje-${index}`}
                emptyMessage="No hay mensajes"
              />

              {/* Paginación */}
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  disabled={pagination.page === 1}
                  onClick={pagination.prevPage}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 bg-gray-100 rounded">
                  Página {pagination.page} de {pagination.meta?.totalPages || 1}
                </span>
                <Button
                  variant="secondary"
                  disabled={pagination.page >= (pagination.meta?.totalPages || 1)}
                  onClick={pagination.nextPage}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal para ver detalles y eliminar */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={`Mensaje de ${selectedMensaje?.nombre}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <p className="text-gray-900">{selectedMensaje?.nombre}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <a
              href={`mailto:${selectedMensaje?.email}`}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              {selectedMensaje?.email}
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <p className="text-gray-900">
              {formatDateTime(selectedMensaje?.createdAt || '')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
              <p className="text-gray-900 whitespace-pre-wrap">{selectedMensaje?.mensaje}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={deleteLoading}
            >
              Cerrar
            </Button>
            <Button
              variant="danger"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
