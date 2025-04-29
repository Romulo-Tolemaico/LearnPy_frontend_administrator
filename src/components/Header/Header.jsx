import { useContext } from 'react'; // Importar useContext
import { AuthContext } from '../../context/AuthContext'; // Importar el AuthContext
import './Header.css';  // Asegúrate de que la ruta es correcta

function Header({ titulo }) {
  const { logout } = useContext(AuthContext); // Obtener la función de logout desde el contexto

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    // Redirigir a la página de login (si es necesario)
    window.location.href = '/login'; // O usa `navigate` si usas react-router
  };

  return (
    <header>
      <h1>{titulo}</h1>
      <button onClick={handleLogout} className="logout-button">
        Cerrar sesión
      </button>
    </header>
  );
}

export default Header;
