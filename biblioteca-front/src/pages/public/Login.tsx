import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardBody } from '../../components/common/Card';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const from = location.state?.from?.pathname;

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const loggedUser = await login(formData);
      const target = from || (loggedUser?.role === 'ADMIN' ? '/admin' : '/');
      toast.success('Sesión iniciada correctamente');
      navigate(target, { replace: true });
    } catch (error) {
      toast.error('Credenciales inválidas');
      console.error('Error de login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
            <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Usuario"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Ingresa tu usuario"
              error={errors.username}
              autoComplete="username"
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Ingresa tu contraseña"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} className="w-full mt-6">
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
