import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { contactoService } from '../../services/contactoService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card, { CardBody } from '../../components/common/Card';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('El email es requerido');
      return;
    }
    if (!formData.mensaje.trim()) {
      toast.error('El mensaje es requerido');
      return;
    }

    setLoading(true);
    try {
      await contactoService.enviarMensaje(formData);
      toast.success('Mensaje enviado correctamente. Te contactaremos pronto.');
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar el mensaje. Intenta nuevamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Contáctanos</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Formulario de Contacto */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Tu nombre completo"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="tu@email.com"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                Enviar Mensaje
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Dirección</h3>
                  <p className="text-gray-600">Calle Principal 123, Ciudad</p>
                </div>
                <div>
                  <h3 className="font-medium">Teléfono</h3>
                  <p className="text-gray-600">(123) 456-7890</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">info@biblioteca.com</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-6">Horarios de Atención</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo</span>
                  <span className="font-medium">Cerrado</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">Síguenos</h2>
              <div className="flex gap-4">
                <a href="#" className="font-medium hover:text-primary-600 transition">Facebook</a>
                <a href="#" className="font-medium hover:text-primary-600 transition">Instagram</a>
                <a href="#" className="font-medium hover:text-primary-600 transition">Twitter</a>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
