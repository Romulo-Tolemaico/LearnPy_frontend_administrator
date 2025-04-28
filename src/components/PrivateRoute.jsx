// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de importar el contexto correctamente

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext); // Consumir el contexto

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, muestra el componente solicitado
  return element;
};

export default PrivateRoute;
