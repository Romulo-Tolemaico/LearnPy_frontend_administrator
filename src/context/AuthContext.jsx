// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken } from './auth';  // Importa las funciones de auth.js

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Verifica si hay un token en el localStorage al montar el componente
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true); // Si existe token, el usuario está autenticado
    }
  }, []);

  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
