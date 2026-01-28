import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { librosService } from '../../services/librosService';
import { categoriasService } from '../../services/categoriasService';
import { Libro, Categoria } from '../../utils/types';
import Card, { CardBody } from '../../components/common/Card';
import Loader from '../../components/common/Loader';

export default function Home() {
  const [librosDestacados, setLibrosDestacados] = useState<Libro[]>([]);
  const [categoriasDestacadas, setCategoriasDestacadas] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const librosResponse = await librosService.getAll({ limit: 4 });
        setLibrosDestacados(librosResponse.items);
        
        const categoriasResponse = await categoriasService.getAll({ limit: 6 });
        setCategoriasDestacadas(categoriasResponse.items);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Sección Principal */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bienvenido a la Biblioteca Nacional
          </h1>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Descubre miles de libros disponibles para préstamo. Tu próxima aventura literaria te espera.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/catalogo"
              className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-100 transition"
            >
              Ver Catálogo
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardBody>
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Amplio Catálogo</h3>
                <p className="text-gray-600">
                  Miles de títulos disponibles en diversas categorías y géneros literarios.
                </p>
              </CardBody>
            </Card>
            <Card className="text-center p-6">
              <CardBody>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Búsqueda Fácil</h3>
                <p className="text-gray-600">
                  Encuentra rápidamente el libro que buscas con nuestro sistema de búsqueda.
                </p>
              </CardBody>
            </Card>
            <Card className="text-center p-6">
              <CardBody>
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-semibold mb-2">Préstamos Online</h3>
                <p className="text-gray-600">
                  Reserva tus libros favoritos desde la comodidad de tu hogar.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Libros Destacados */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Libros Destacados
          </h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {librosDestacados.map((libro) => (
                <Link key={libro.id} to={`/libro/${libro.id}`}>
                  <Card className="h-full hover:shadow-lg transition">
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-6xl text-white opacity-80">📖</span>
                    </div>
                    <CardBody>
                      <h3 className="font-semibold text-lg mb-1 truncate">{libro.titulo}</h3>
                      <p className="text-gray-600 text-sm">{libro.autor || 'Autor desconocido'}</p>
                      <p className="text-primary-600 font-medium mt-2">
                        {libro.cantidad_disponible} disponibles
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/catalogo"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Ver Todos los Libros
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Categorías Destacadas
          </h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriasDestacadas.map((categoria) => (
                <Link key={categoria.id} to="/catalogo">
                  <Card className="h-full hover:shadow-lg transition">
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-6xl text-white opacity-80">📚</span>
                    </div>
                    <CardBody>
                      <h3 className="font-semibold text-lg mb-1 truncate">{categoria.nombre}</h3>
                      {categoria.descripcion && (
                        <p className="text-gray-600 text-sm line-clamp-2">{categoria.descripcion}</p>
                      )}
                      <p className="text-primary-600 font-medium mt-2">
                        Explorar →
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Llamada a la Acción */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Regístrate ahora y comienza a disfrutar de nuestra biblioteca.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-100 transition"
          >
            Registrarse Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
