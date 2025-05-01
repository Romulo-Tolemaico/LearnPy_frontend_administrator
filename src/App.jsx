import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from "./pages/ListarUsuarios/usuarios";
import EditarUsuario from './pages/editarUsuario/EditarUsuario';
function App() {
  return (
    <Router>
      {/* Barra de navegación */}

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Usuarios />} />
        <Route path="/editar/:id" element={<EditarUsuario />} />
        <Route path="/editar" element={<EditarUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;
