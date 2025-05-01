// Constante para el dominio de la API
const API_URL = 'http://127.0.0.1:5000'; // Cambia a la URL global cuando sea necesario

// Función para realizar solicitudes a la API
const fetchApi = async (endpoint, method, data) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la API:', error);
    throw error;
  }
};

// Funciones específicas para cada operación de la API
export const loginUser = (email, password, type) => {
  return fetchApi('/login', 'POST', { email, password, type });
};

export const getUsersByType = (type) => {
  return fetchApi('/get_users', 'POST', { type });
};

export const getUserByCode = (code) => {
  return fetchApi('/get_user', 'POST', { code });
};

export const deleteUser = (code) => {
  return fetchApi('/delete_user', 'POST', { code });
};

export const deleteMultipleUsers = (codes) => {
  return fetchApi('/delete_users', 'POST', { codes });
};

export const registerUser = (name, email, password, type) => {
  return fetchApi('/register_user', 'POST', { name, email, password, type });
};

export const editUser = (code, name, email, type) => {
  return fetchApi('/edit_user', 'PUT', { code, name, email, type });
};