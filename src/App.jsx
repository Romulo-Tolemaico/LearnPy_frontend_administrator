import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Usuarios from "./pages/UsersList/UsersList";
import UserEdit from "./pages/UsersEdit/UsersEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Usuarios />} />
        <Route path="/editar/:id" element={<UserEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
