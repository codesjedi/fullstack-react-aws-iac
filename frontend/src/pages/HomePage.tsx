import { Link } from 'react-router-dom';

import { SolicitudForm } from '../components/SolicitudForm';

export const HomePage = () => {
  return (
    <div className="page">
      <header className="header">
        <h1>Sistema de Solicitudes</h1>
        <Link to="/login" className="admin-link">
          Acceso Admin
        </Link>
      </header>

      <main className="main-content">
        <div className="hero">
          <h2>Envía tu solicitud</h2>
          <p>Completa el formulario a continuación para enviar tu solicitud</p>
        </div>
        
        <SolicitudForm />
      </main>
    </div>
  );
};
