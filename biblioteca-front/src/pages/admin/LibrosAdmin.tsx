import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { librosService } from '../../services/librosService';
import { categoriasService } from '../../services/categoriasService';
import { Libro, Categoria, CreateLibroData } from '../../utils/types';
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

export default function LibrosAdmin() {
  const { hasRole } = useAuth();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLibro, setSelectedLibro] = useState<Libro | null>(null);
  const [saving, setSaving] = useState(false);
  
  const pagination = usePagination({ initialLimit: 10 });

  const [formData, setFormData] = useState<CreateLibroData>({
    titulo: '',
    autor: '',
    anio_publicacion: undefined,
    numero_paginas: undefined,
    cantidad_disponible: 0,
    categoria_id: '',
    imagen_url: '',
  });

  const fetchLibros = useCallback(async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await librosService.getAll(params);
      setLibros(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      toast.error('Error al cargar libros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search]);

  const fetchCategorias = async () => {
    try {
      const response = await categoriasService.getAll({ limit: 100 });
      setCategorias(response.items);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchLibros();
  }, [pagination.page, pagination.search]);

  const handleOpenModal = (libro?: Libro) => {
    if (libro) {
      setSelectedLibro(libro);
      setFormData({
        titulo: libro.titulo,
        autor: libro.autor || '',
        anio_publicacion: libro.anio_publicacion,
        numero_paginas: libro.numero_paginas,
        cantidad_disponible: libro.cantidad_disponible,
        categoria_id: libro.categoria_id || '',
        imagen_url: libro.imagen_url || '',
      });
    } else {
      setSelectedLibro(null);
      setFormData({
        titulo: '',
        autor: '',
        anio_publicacion: undefined,
        numero_paginas: undefined,
        cantidad_disponible: 0,
        categoria_id: '',
        imagen_url: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLibro(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      toast.error('El título es requerido');
      return;
    }

    setSaving(true);
    try {
      if (selectedLibro) {
        await librosService.update(selectedLibro.id, formData);
        toast.success('Libro actualizado correctamente');
      } else {
        await librosService.create(formData);
        toast.success('Libro creado correctamente');
      }
      handleCloseModal();
      fetchLibros();
    } catch (error) {
      toast.error('Error al guardar el libro');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLibro) return;

    setSaving(true);
    try {
      await librosService.delete(selectedLibro.id);
      toast.success('Libro eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedLibro(null);
      fetchLibros();
    } catch (error) {
      toast.error('Error al eliminar el libro');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (libro: Libro) => {
    setSelectedLibro(libro);
    setDeleteDialogOpen(true);
  };

  const columns = [
    { key: 'titulo', header: 'Título' },
    { key: 'autor', header: 'Autor', render: (libro: Libro) => libro.autor || '-' },
    { key: 'anio_publicacion', header: 'Año', render: (libro: Libro) => libro.anio_publicacion || '-' },
    { 
      key: 'cantidad_disponible', 
      header: 'Disponibles',
      render: (libro: Libro) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          libro.cantidad_disponible > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {libro.cantidad_disponible}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (libro: Libro) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleOpenModal(libro)}>
            Editar
          </Button>
          {hasRole(['admin']) && (
            <Button size="sm" variant="danger" onClick={() => openDeleteDialog(libro)}>
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
            <h2 className="text-xl font-semibold">Gestión de Libros</h2>
            <Button onClick={() => handleOpenModal()}>
              + Nuevo Libro
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6">
            <SearchBar
              onSearch={pagination.updateSearch}
              placeholder="Buscar por título..."
            />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Table
                columns={columns}
                data={libros}
                keyExtractor={(libro) => libro.id}
                emptyMessage="No hay libros registrados"
              />
              {pagination.meta && (
                <Pagination meta={pagination.meta} onPageChange={pagination.goToPage} />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal de Crear/Editar Libro */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedLibro ? 'Editar Libro' : 'Nuevo Libro'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Título"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            placeholder="Título del libro"
          />
          <Input
            label="Autor"
            value={formData.autor || ''}
            onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
            placeholder="Nombre del autor"
          />
          <Input
            label="URL de la Imagen"
            value={formData.imagen_url || ''}
            onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Año de Publicación"
              type="number"
              value={formData.anio_publicacion || ''}
              onChange={(e) => setFormData({ ...formData, anio_publicacion: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ej: 2024"
            />
            <Input
              label="Número de Páginas"
              type="number"
              value={formData.numero_paginas || ''}
              onChange={(e) => setFormData({ ...formData, numero_paginas: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Ej: 350"
            />
          </div>
          <Input
            label="Cantidad Disponible"
            type="number"
            value={formData.cantidad_disponible}
            onChange={(e) => setFormData({ ...formData, cantidad_disponible: parseInt(e.target.value) || 0 })}
            required
            min={0}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={formData.categoria_id || ''}
              onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {selectedLibro ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Libro"
        message={`¿Estás seguro de que deseas eliminar "${selectedLibro?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={saving}
      />
    </div>
  );
}
