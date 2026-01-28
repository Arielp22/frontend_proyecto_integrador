import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { categoriasService } from '../../services/categoriasService';
import { Categoria, CreateCategoriaData } from '../../utils/types';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../context/AuthContext';
import Card, { CardBody, CardHeader } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function CategoriasAdmin() {
  const { hasRole } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [saving, setSaving] = useState(false);
  
  const pagination = usePagination({ initialLimit: 10 });

  const [formData, setFormData] = useState<CreateCategoriaData>({
    nombre: '',
    descripcion: '',
  });

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await categoriasService.getAll(params);
      setCategorias(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      toast.error('Error al cargar categorías');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search]);

  useEffect(() => {
    fetchCategorias();
  }, [pagination.page, pagination.search]);

  const handleOpenModal = (categoria?: Categoria) => {
    if (categoria) {
      setSelectedCategoria(categoria);
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
      });
    } else {
      setSelectedCategoria(null);
      setFormData({
        nombre: '',
        descripcion: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategoria(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      if (selectedCategoria) {
        await categoriasService.update(selectedCategoria.id, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await categoriasService.create(formData);
        toast.success('Categoría creada correctamente');
      }
      handleCloseModal();
      fetchCategorias();
    } catch (error) {
      toast.error('Error al guardar la categoría');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategoria) return;

    setSaving(true);
    try {
      await categoriasService.delete(selectedCategoria.id);
      toast.success('Categoría eliminada correctamente');
      setDeleteDialogOpen(false);
      setSelectedCategoria(null);
      fetchCategorias();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setDeleteDialogOpen(true);
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { 
      key: 'descripcion', 
      header: 'Descripción',
      render: (cat: Categoria) => (
        <span className="text-gray-600 truncate max-w-xs block">
          {cat.descripcion || '-'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (categoria: Categoria) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleOpenModal(categoria)}>
            Editar
          </Button>
          {hasRole(['admin']) && (
            <Button size="sm" variant="danger" onClick={() => openDeleteDialog(categoria)}>
              Eliminar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
            <Button onClick={() => handleOpenModal()}>
              + Nueva Categoría
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6">
            <SearchBar
              onSearch={pagination.updateSearch}
              placeholder="Buscar por nombre..."
            />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Table
                columns={columns}
                data={categorias}
                keyExtractor={(cat) => cat.id}
                emptyMessage="No hay categorías registradas"
              />
              {pagination.meta && (
                <Pagination meta={pagination.meta} onPageChange={pagination.goToPage} />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal de Crear/Editar Categoría */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            placeholder="Nombre de la categoría"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descripción de la categoría"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {selectedCategoria ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar "${selectedCategoria?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={saving}
      />
    </div>
  );
}
