import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Usuarios.css"; 

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/usuarios")
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        setCargando(false);
      });
  }, []);

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este usuario?")) {
      try {
        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        setUsuarios(usuarios.filter(user => user.id !== id));
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el usuario.");
      }
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-contenido">
        <button className="crear-btn" onClick={() => navigate("/crear")}>
          Crear Usuario
        </button>
        {/*<button className="editar-btn" onClick={() => navigate("/crear")}>
          Editar Usuario
        </button>*/}
        <button className="editar-btn" onClick={() => navigate("/editar")}>
         Editar Usuario
        </button>
  
        <h2>Lista de Usuarios</h2>
  
        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <div className="usuarios-lista">
            {usuarios.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <div>
                  <strong>{usuario.nombre}</strong><br />
                  ID: {usuario.id}
                </div>
                <div>
                  <button className="editar-btn" onClick={() => navigate(`/editar/${usuario.id}`)}>
                    Editar
                  </button>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Usuarios;
