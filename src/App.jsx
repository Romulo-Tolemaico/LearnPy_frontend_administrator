// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; 
import Home from './pages/Home/Home'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; 
import UsersList from './pages/UsersList/UsersList';

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
            element={<PrivateRoute element={<UsersList />} />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
