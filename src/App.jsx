// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; 
import Home from './pages/Home/Home'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; 
import Usuarios from './pages/ListarUsuarios/usuarios';
import EditUser from './pages/EditUser/EditUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route
            path="/register"
            element={<PrivateRoute element={<Register />} />} 
          />
          <Route
            path="/listUsers"
            element={<PrivateRoute element={<Usuarios />} />} 
          />
         
          <Route
            path="/editar/:id"
            element={<PrivateRoute element={<EditUser />} />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
