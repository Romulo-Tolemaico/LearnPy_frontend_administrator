import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./usuarios.css";

const API_URL = "http://localhost:5000/user";

const Usuarios = () => {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState(2);
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const todosSeleccionados = seleccionados.length === usuarios.length && usuarios.length > 0;
  const haySeleccionados = seleccionados.length > 0;

  const tipoTexto = (tipo) => {
    switch (tipo) {
      case 3: return "Administrador";
      case 1: return "Estudiante";
      case 2: return "Docente";
      default: return "Desconocido";
    }
  };

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/get_users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tipoUsuario }),
      });
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsuarios(data);
      setSeleccionados([]);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar usuarios:", err);
    } finally {
      setCargando(false);
    }
  }, [tipoUsuario]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const eliminarUsuarios = async (endpoint, body) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar: ${response.status}`);
    }
  };

  const confirmarEliminar = async () => {
    setCargando(true);
    setError(null);
    try {
      if (haySeleccionados) {
        await eliminarUsuarios("delete_users", { codes: seleccionados });
        setSeleccionados([]);
      } else {
        await eliminarUsuarios("delete_user", { code: usuarioEliminar.code });
      }
      cargarUsuarios();
      setModalEliminar(false);
    } catch (err) {
      setError(err.message);
      console.error("Error al eliminar:", err);
    } finally {
      setCargando(false);
    }
  };

  const irAEditar = (usuario) => navigate(`/editar/${usuario.code}`);
  const añadirUsuario = () => navigate("/register");

  const handleSeleccion = (code) => {
    setSeleccionados((prev) =>
      prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
    );
  };

  const seleccionarTodos = () => {
    setSeleccionados(todosSeleccionados ? [] : usuarios.map((u) => u.code));
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioEliminar(usuario);
    setModalEliminar(true);
  };

  const eliminarSeleccionados = () => {
    setModalEliminar(true);
    setUsuarioEliminar({ name: `${seleccionados.length} usuarios` });
  };

  const claseSidebar = (tipo) => `sidebar-item${tipoUsuario === tipo ? " active" : ""}`;

  const renderUsuarioFila = (usuario) => (
    <tr key={usuario.code}>
      <td>
        <input
          type="checkbox"
          checked={seleccionados.includes(usuario.code)}
          onChange={() => handleSeleccion(usuario.code)}
        />
      </td>
      <td>{usuario.name}</td>
      <td>{usuario.email}</td>
      <td>{tipoTexto(tipoUsuario)}</td>
      <td className="acciones">
        <button className="btn-editar" onClick={() => irAEditar(usuario)} title="Editar usuario">
          <i className="edit-icon">✏️</i>
        </button>
        <button className="btn-eliminar" onClick={() => abrirModalEliminar(usuario)} title="Eliminar usuario">
          <i className="delete-icon" style={{ color: "red" }}>🗑️</i>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="admin-container">
      <Header titulo="LearnPy Administrator" />
      <div className="admin-content">
        <aside className="admin-sidebar">
          <div className={claseSidebar(2)} onClick={() => setTipoUsuario(2)}>
            <i className="user-icon docente"></i> Docentes
          </div>
          <div className={claseSidebar(1)} onClick={() => setTipoUsuario(1)}>
            <i className="user-icon estudiante"></i> Estudiantes
          </div>
          <div className="sidebar-item">
            <i className="user-icon leccion"></i> Lecciones
          </div>
        </aside>

        <main className="admin-main">
          {error && <div className="error-message">Error: {error}</div>}

          <div className="table-actions">
            <button
              className="btn-eliminar-seleccionados"
              onClick={eliminarSeleccionados}
              disabled={!haySeleccionados || cargando}
            >
              Eliminar Seleccionados <i className="delete-icon">🗑</i>
            </button>
            <button className="btn-añadir" onClick={añadirUsuario} disabled={cargando}>
              Añadir <i className="add-icon">+</i>
            </button>
          </div>

          {cargando ? (
            <div className="loading">Cargando usuarios...</div>
          ) : (
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={todosSeleccionados}
                      onChange={seleccionarTodos}
                    />
                  </th>
                  <th>Nombre de Usuario</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map(renderUsuarioFila)
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No hay usuarios para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </main>
      </div>

      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar eliminación</h2>
            <p>
              {haySeleccionados
                ? `¿Está seguro que desea eliminar ${seleccionados.length} usuarios seleccionados?`
                : `¿Está seguro que desea eliminar al usuario ${usuarioEliminar.name}?`}
            </p>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setModalEliminar(false)} disabled={cargando}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarEliminar} disabled={cargando}>
                {cargando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
