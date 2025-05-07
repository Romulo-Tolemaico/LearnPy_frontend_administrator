import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './UsersList.css';

function UsersList() {
  
  const navigate = useNavigate();
  const [role, setRole] = useState('Estudiante');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Datos de ejemplo para la tabla
  const mockUsers = [
    { id: 1, nombre: "Ana García", email: "ana@example.com", activo: true },
    { id: 2, nombre: "Carlos López", email: "carlos@example.com", activo: true },
    { id: 3, nombre: "Laura Martínez", email: "laura@example.com", activo: false },
    { id: 4, nombre: "Miguel Hernández", email: "miguel@example.com", activo: true },
  ];

  return (
    <div className="page-container">
      <Header titulo="LearnPy Administrator - Lista de usuarios" />

      <div className="content-container">
        
        <div className="sidebar">
          <button
            onClick={() => handleRoleChange("Estudiante")}
            className={role === "Estudiante" ? "selected-button" : "button"}
          >
            Estudiante
          </button>
          <button
            onClick={() => handleRoleChange("Docente")}
            className={role === "Docente" ? "selected-button" : "button"}
          >
            Docente
          </button>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Cerrar sesión
          </button>
        </div>

        <main className="main-content">
          <div className="actions-container">
            <button
              onClick={goToRegister}
              className="create-button"
            >
              Crear nuevo usuario
            </button>
            <button className="delete-button">
              Eliminar usuario
            </button>
          </div>

          <p className="role-message">Rol seleccionado: {role}</p>

          {/* Tabla de usuarios */}
          <table className="users-table">
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id}>
                  <td className="checkbox-container">
                    <input type="checkbox" className="custom-checkbox" />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.activo ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default UsersList;