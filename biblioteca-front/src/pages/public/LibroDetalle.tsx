import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { librosService } from '../../services/librosService';
import { Libro } from '../../utils/types';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { prestamosService } from '../../services/prestamosService';
import toast from 'react-hot-toast';

export default function LibroDetalle() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [loanLoading, setLoanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibro = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await librosService.getById(id);
        setLibro(data);
      } catch (err) {
        setError('No se pudo cargar el libro');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibro();
  }, [id]);

  const handlePrestamo = async () => {
    if (!id || !user?.id) return;
    setLoanLoading(true);
    try {
      await prestamosService.crearPrestamo(user.id, id);
      toast.success('Préstamo solicitado correctamente');
      // Opcional: refrescar disponibilidad
      const data = await librosService.getById(id);
      setLibro(data);
    } catch (err: any) {
      console.error('Error al solicitar préstamo:', err);
      const message = err?.response?.data?.message || 'No se pudo solicitar el préstamo';
      toast.error(message);
    } finally {
      setLoanLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !libro) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Libro no encontrado'}
        </h1>
        <Link
          to="/catalogo"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navegación */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/catalogo" className="text-gray-500 hover:text-primary-600">
              Catálogo
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-800 font-medium">{libro.titulo}</li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Portada del Libro */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg aspect-[3/4] flex items-center justify-center shadow-lg overflow-hidden">
            {libro.imagen_url ? (
              <img 
                src={libro.imagen_url} 
                alt={libro.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-9xl text-white opacity-80 ${libro.imagen_url ? 'hidden' : ''}`}>📖</span>
          </div>
        </div>

        {/* Detalles del Libro */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{libro.titulo}</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <span className="text-gray-600 w-40">Autor:</span>
              <span className="font-medium">{libro.autor || 'Desconocido'}</span>
            </div>
            
            {libro.anio_publicacion && (
              <div className="flex items-center">
                <span className="text-gray-600 w-40">Año de publicación:</span>
                <span className="font-medium">{libro.anio_publicacion}</span>
              </div>
            )}
            
            {libro.numero_paginas && (
              <div className="flex items-center">
                <span className="text-gray-600 w-40">Número de páginas:</span>
                <span className="font-medium">{libro.numero_paginas}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="text-gray-600 w-40">Disponibilidad:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  libro.cantidad_disponible > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {libro.cantidad_disponible > 0
                  ? `${libro.cantidad_disponible} ejemplares disponibles`
                  : 'No disponible'}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4">
            {libro.cantidad_disponible > 0 ? (
              isAuthenticated ? (
                <Button size="lg" loading={loanLoading} onClick={handlePrestamo}>
                  Solicitar Préstamo
                </Button>
              ) : (
                <Link to="/login">
                  <Button size="lg">
                    Iniciar sesión para solicitar
                  </Button>
                </Link>
              )
            ) : (
              <Button size="lg" disabled>
                No disponible
              </Button>
            )}
            <Link to="/catalogo">
              <Button variant="secondary" size="lg">
                Volver al catálogo
              </Button>
            </Link>
          </div>

          {/* Descripción */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Descripción</h3>
            <p className="text-gray-600">
              Este libro forma parte de nuestro catálogo y está disponible para préstamo 
              a todos los usuarios registrados de la biblioteca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
