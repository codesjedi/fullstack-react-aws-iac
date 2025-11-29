import { useState, type FormEvent } from 'react';

import { createdSolicitud } from '../services/api';
import type { CreateSolicitudRequest } from 'shared';

export const SolicitudForm = () => {
  const [formData, setFormData] = useState<CreateSolicitudRequest>({
    name: '',
    email: '',
    amount: 0,
    type: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await createdSolicitud(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        amount: 0,
        type: '',
        comments: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="solicitud-form">
        <div className="form-group">
          <label htmlFor="name">Nombre completo *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Juan Pérez"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo de solicitud *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Seleccione un tipo</option>
            <option value="prestamo">Préstamo</option>
            <option value="credito">Crédito</option>
            <option value="inversion">Inversión</option>
            <option value="consulta">Consulta</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Monto (PYG) *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={loading}
            min="0"
            step="1000"
            placeholder="1000000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comentarios</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            disabled={loading}
            placeholder="Información adicional sobre tu solicitud..."
            rows={4}
          />
        </div>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            ✓ Solicitud enviada correctamente. Nos pondremos en contacto pronto.
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
};
