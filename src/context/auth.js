// src/context/auth.js

// Función para guardar el token en localStorage o cookies
export const saveAuthToken = (token) => {
  localStorage.setItem("authToken", token); // Usamos localStorage como ejemplo
};

// Función para obtener el token desde localStorage
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Función para eliminar el token (logout)
export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
