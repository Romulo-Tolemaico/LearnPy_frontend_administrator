import { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./EditUser.css";

const API_URL = "http://localhost:5000/user";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState(1);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false); // NUEVO

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch(`${API_URL}/get_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: parseInt(id) }),
        });

        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setNombre(data.name);
        setEmail(data.email);

        const tipoRecibido = parseInt(data.type);
        if ([1, 2, 3].includes(tipoRecibido)) {
          setTipo(tipoRecibido);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("No se pudo cargar el usuario.");
      }
    };

    cargarUsuario();
  }, [id]);

  const confirmSubmit = async () => {
    setCargando(true);
    setError(null);
    setMostrarModal(false);

    try {
      const response = await fetch(`${API_URL}/edit_user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: parseInt(id),
          name: nombre.trim(),
          email: email.trim(),
          type: tipo,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.errors?.join(", ") || data.error || "Error desconocido");
      }

      navigate("/ListUsers");
    } catch (err) {
      setError(`Error al editar usuario: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarModal(true);
  };

  return (
    <div className="admin-container">
      <Header titulo="Editar Usuario" />
      <div className="admin-content">
        <main className="admin-main">
          <form className="usuario-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email (solo @gmail.com)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Usuario</label>
              <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
                <option value={1}>Estudiante</option>
                <option value={2}>Docente</option>
              </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
              <button type="submit" disabled={cargando}>
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/ListUsers")}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Estás seguro de que deseas modificar este usuario?</p>
            <div className="modal-buttons">
              <button onClick={confirmSubmit}>Sí, confirmar</button>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
