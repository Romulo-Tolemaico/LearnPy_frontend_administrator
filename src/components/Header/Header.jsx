
import { AuthContext } from '../../context/AuthContext'; // Importar el AuthContext
import './Header.css';  // Asegúrate de que la ruta es correcta

function Header({ titulo }) {
  

  return (
    <header>
      <h1>{titulo}</h1>
      
    </header>
  );
}

export default Header;
