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
    navigate('/logout'); // Ajusta esto según tu ruta real
  };

  return (
    <div className="page-container">
      <Header titulo="LearnPy Administrator - Lista de usuarios" />

      <div className="content-container">
        <aside className="sidebar">
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
        </aside>

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

          {/* Aquí irá la lista de usuarios */}
        </main>
      </div>
    </div>
  );
}

export default UsersList;
