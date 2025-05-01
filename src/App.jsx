import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from "./pages/ListarUsuarios/usuarios";
function App() {
  return (
    <Router>
      {/* Barra de navegación */}

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Usuarios />} />
      </Routes>
    </Router>
  );
}

export default App;

