import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

function Header({ titulo }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // O usa navigate si usas react-router
  };

  return (
    <header className="header">
      <h1 className="header-title">{titulo}</h1>
      <button onClick={handleLogout} className="logout-button">
        Cerrar sesión
      </button>
    </header>
  );
}

export default Header;
