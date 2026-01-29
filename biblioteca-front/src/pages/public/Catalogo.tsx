import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { librosService } from '../../services/librosService';
import { Libro } from '../../utils/types';
import { usePagination } from '../../hooks/usePagination';
import Card, { CardBody } from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';

export default function Catalogo() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pagination = usePagination({ initialLimit: 8 });

  const fetchLibros = useCallback(async () => {
    setLoading(true);
    try {
      const params = pagination.getQueryParams();
      const response = await librosService.getAll(params);
      setLibros(response.items);
      pagination.setMeta(response.meta);
    } catch (error) {
      console.error('Error al cargar libros:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, pagination.search]);

  useEffect(() => {
    fetchLibros();
  }, [pagination.page, pagination.search]);

  const handleSearch = (query: string) => {
    pagination.updateSearch(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Catálogo de Libros</h1>

      {/* Barra de Búsqueda */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar por título o autor..."
        />
      </div>

      {/* Cuadrícula de Libros */}
      {loading ? (
        <Loader />
      ) : libros.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600">No se encontraron libros</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {libros.map((libro) => (
              <Link key={libro.id} to={`/libro/${libro.id}`}>
                <Card className="h-full hover:shadow-lg transition">
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden">
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
                    <span className={`text-6xl text-white opacity-80 ${libro.imagen_url ? 'hidden' : ''}`}>📖</span>
                  </div>
                  <CardBody>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{libro.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-2">{libro.autor || 'Autor desconocido'}</p>
                    {libro.anio_publicacion && (
                      <p className="text-gray-500 text-sm">Año: {libro.anio_publicacion}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          libro.cantidad_disponible > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {libro.cantidad_disponible > 0
                          ? `${libro.cantidad_disponible} disponibles`
                          : 'No disponible'}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {pagination.meta && (
            <div className="mt-8">
              <Pagination meta={pagination.meta} onPageChange={pagination.goToPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
