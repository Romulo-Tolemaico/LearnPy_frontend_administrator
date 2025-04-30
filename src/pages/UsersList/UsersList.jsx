import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersList.css";

import avatarDefault from "../../assets/usuario.png";
import iconoPapelera from "../../assets/delete.png";
import iconoEditar from "../../assets/edit.png";
import iconoEliminar from "../../assets/delete.png"; 
import iconoAgregar from "../../assets/agregar.png";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const USUARIO_PRUEBA_ID = 1;

  useEffect(() => {
    fetch("/api/usuarios")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          data = [
            {
              id: USUARIO_PRUEBA_ID,
              nombre: "Usuario Prueba",
              email: "prueba@ejemplo.com"
            }
          ];
        }
        setUsuarios(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        setUsuarios([
          {
            id: USUARIO_PRUEBA_ID,
            nombre: "Usuario Prueba",
            email: "prueba@ejemplo.com"
          }
        ]);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const manejarSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const seleccionarTodos = () => {
    if (seleccionados.length === usuarios.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(usuarios.map(u => u.id));
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este usuario?")) {
      try {
        if (id === USUARIO_PRUEBA_ID) {
          setUsuarios(usuarios.filter(user => user.id !== id));
          setSeleccionados(seleccionados.filter(uid => uid !== id));
          setMensaje("Usuario eliminado correctamente.");
          return;
        }

        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        setUsuarios(usuarios.filter(user => user.id !== id));
        setSeleccionados(seleccionados.filter(uid => uid !== id));
        setMensaje("Usuario eliminado correctamente.");
      } catch (err) {
        console.error(err);
        setMensaje("No se pudo eliminar el usuario.");
      }
    }
  };

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;

    if (window.confirm("¿Seguro que deseas eliminar los usuarios seleccionados?")) {
      try {
        const idsAEliminar = [...seleccionados];
        for (const id of idsAEliminar) {
          if (id === USUARIO_PRUEBA_ID) continue;
          await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        }
        setUsuarios(usuarios.filter(u => !seleccionados.includes(u.id)));
        setSeleccionados([]);
        setMensaje("Usuarios eliminados correctamente.");
      } catch (err) {
        console.error("Error eliminando usuarios:", err);
        setMensaje("Ocurrió un error al eliminar los usuarios.");
      }
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-contenido">
  <div className="contenido-flex">
    {/* Menú lateral interno */}
    <div className="menu-lateral">
      <ul>
      
        <li onClick={() => navigate("/")}>Usuarios</li>
        <li onClick={() => navigate("/docentes")}>Docentes</li>
        <li onClick={() => navigate("/estudiantes")}>Estudiantes</li>
      </ul>
    </div>

    {/* Contenido principal de usuarios */}
    <div className="contenido-principal">
      <h2 className="titulo-usuarios">Lista de Usuarios</h2>

      {mensaje && <div className="mensaje-exito">{mensaje}</div>}

      <div className="acciones-superiores">
        <button className="btn-crear-superior" onClick={() => navigate("/crear")}>
          <img src={iconoAgregar} alt="Agregar" className="icono-papelera" />
          Añadir Usuario
        </button>

        <button
          className="btn-eliminar-superior"
          onClick={eliminarSeleccionados}
          disabled={usuarios.length === 0 || seleccionados.length === 0}
        >
          <img src={iconoPapelera} alt="Eliminar" className="icono-papelera" />
          Eliminar seleccionados ({seleccionados.length})
        </button>
      </div>

      {!cargando && (
        <div className="cabecera-usuarios">
          <input
            type="checkbox"
            checked={seleccionados.length === usuarios.length && usuarios.length > 0}
            onChange={seleccionarTodos}
            className="checkbox-cabecera"
          />
          <span></span>
          <span>ID</span>
          <span>Nombre</span>
          <span>Email</span>
          <span>Acciones</span>
        </div>
      )}

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="usuarios-lista">
          {usuarios.map(usuario => (
            <div key={usuario.id} className="usuario-card">
              <input
                type="checkbox"
                checked={seleccionados.includes(usuario.id)}
                onChange={() => manejarSeleccion(usuario.id)}
              />
              <img
                src={avatarDefault}
                alt={`Avatar de ${usuario.nombre}`}
                className="usuario-avatar"
              />
              <span>{usuario.id}</span>
              <span>{usuario.nombre}</span>
              <span>{usuario.email || "-"}</span>
              <div>
                <button className="editar-btn" onClick={() => navigate(`/editar/${usuario.id}`)}>
                  <img src={iconoEditar} alt="Editar" className="icono-btn" />
                  Editar
                </button>
                <button className="eliminar-btn" onClick={() => eliminarUsuario(usuario.id)}>
                  <img src={iconoEliminar} alt="Eliminar" className="icono-btn" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
}

export default Usuarios;