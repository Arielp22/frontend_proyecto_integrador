import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { usersService, UpdateUserData } from '../../services/usersService';
import { User } from '../../utils/types';
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

export default function UsuariosAdmin() {
  const { hasRole, user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  
  const pagination = usePagination({ initialLimit: 10 });

  const [formData, setFormData] = useState<UpdateUserData>({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    role: 'USER',
    isActive: true,
  });

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await usersService.getAll(params);
      setUsuarios(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search]);

  useEffect(() => {
    fetchUsuarios();
  }, [pagination.page, pagination.search]);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      role: 'USER',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '', // No mostrar la contraseña actual
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      role: user.role?.toUpperCase() || 'USER',
      isActive: user.isActive,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.username?.trim()) {
      toast.error('El nombre de usuario es requerido');
      return;
    }
    if (!formData.email?.trim()) {
      toast.error('El email es requerido');
      return;
    }
    if (!selectedUser && !formData.password?.trim()) {
      toast.error('La contraseña es requerida para crear un usuario');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    try {
      if (selectedUser) {
        // Editar usuario existente
        const dataToSend: UpdateUserData = {
          role: formData.role?.toUpperCase(),
          isActive: formData.isActive,
        };
        
        if (formData.username?.trim()) dataToSend.username = formData.username.trim();
        if (formData.email?.trim()) dataToSend.email = formData.email.trim();
        if (formData.password?.trim()) dataToSend.password = formData.password;
        if (formData.nombre?.trim()) dataToSend.nombre = formData.nombre.trim();
        if (formData.apellido?.trim()) dataToSend.apellido = formData.apellido.trim();
        
        await usersService.update(selectedUser.id, dataToSend);
        toast.success('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        const dataToSend = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password!,
          nombre: formData.nombre?.trim(),
          apellido: formData.apellido?.trim(),
          role: formData.role?.toUpperCase(),
        };
        
        await usersService.create(dataToSend);
        toast.success('Usuario creado correctamente');
      }
      
      handleCloseModal();
      fetchUsuarios();
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
        (selectedUser ? 'Error al actualizar el usuario' : 'Error al crear el usuario');
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      await usersService.delete(selectedUser.id);
      toast.success('Usuario eliminado correctamente');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const columns = [
    { key: 'username', header: 'Usuario' },
    { key: 'email', header: 'Email' },
    { 
      key: 'nombre', 
      header: 'Nombre Completo',
      render: (user: User) => `${user.nombre || ''} ${user.apellido || ''}`.trim() || '-'
    },
    { 
      key: 'role', 
      header: 'Rol',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.role}
        </span>
      )
    },
    { 
      key: 'isActive', 
      header: 'Estado',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (user: User) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleOpenModal(user)}>
            Editar
          </Button>
          {hasRole(['admin']) && user.id !== currentUser?.id && (
            <Button size="sm" variant="danger" onClick={() => openDeleteDialog(user)}>
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
            <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
            <Button onClick={handleOpenCreateModal}>
              + Crear Usuario
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-6">
            <SearchBar
              onSearch={pagination.updateSearch}
              placeholder="Buscar por usuario o email..."
            />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <Table
                columns={columns}
                data={usuarios}
                keyExtractor={(user) => user.id}
                emptyMessage="No hay usuarios registrados"
              />
              {pagination.meta && (
                <Pagination meta={pagination.meta} onPageChange={pagination.goToPage} />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Modal de Editar/Crear Usuario */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? "Editar Usuario" : "Crear Usuario"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Usuario"
            value={formData.username || ''}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Nombre de usuario"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@ejemplo.com"
          />
          <Input
            label={selectedUser ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
            type="password"
            value={formData.password || ''}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Nombre"
            />
            <Input
              label="Apellido"
              value={formData.apellido || ''}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              placeholder="Apellido"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {selectedUser ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.username}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={saving}
      />
    </div>
  );
}
