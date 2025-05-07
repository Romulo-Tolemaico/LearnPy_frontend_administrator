import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Panel</h2>
      <nav className="sidebar-menu">
        <a href="/estudiante" className="sidebar-item estudiante">Estudiante</a>
        <a href="/docente" className="sidebar-item docente">Docente</a>
        <a href="/administrador" className="sidebar-item administrador">Administrador</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
