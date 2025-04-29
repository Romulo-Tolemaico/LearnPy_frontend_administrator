// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken } from './auth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken()); // 👈 así leemos al inicio

  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token); // 👈 Revalidar por si el token cambia
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
