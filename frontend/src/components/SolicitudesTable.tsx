import type { Solicitud } from 'shared';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { getSolicitudes } from '../services/api';

export const SolicitudesTable = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await getSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load solicitudes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Solicitudes Recibidas</h2>
        <button onClick={logout} className="btn-secondary">
          Cerrar Sesión
        </button>
      </div>

      <div className="stats">
        <p>
          Total de solicitudes: <strong>{solicitudes.length}</strong>
        </p>
      </div>

      <div className="table-container">
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{formatDate(solicitud.createdAt)}</td>
                <td>{solicitud.name}</td>
                <td>{solicitud.email}</td>
                <td>{solicitud.type}</td>
                <td>{formatCurrency(solicitud.amount)}</td>
                <td>{solicitud.comments || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {solicitudes.length === 0 && (
          <p className="no-data">No hay solicitudes registradas</p>
        )}
      </div>
    </div>
  );
};
