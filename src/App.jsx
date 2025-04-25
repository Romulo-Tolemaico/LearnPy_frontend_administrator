import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from "./components/Usuarios";
import EditarUsuario from "./components/EditarUsuario";

function App() {
  return (
    <Router>
      {/* Barra de navegación */}
      

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Usuarios />} />
        <Route path="/editar/:id" element={<EditarUsuario />} />
        {/* Ruta temporal sin id */}
        <Route path="/editar" element={<EditarUsuario />} />
        {/*<Route path="/crear" element={<CrearUsuario />} />*/}
      </Routes>
    </Router>
  );
}

export default App
