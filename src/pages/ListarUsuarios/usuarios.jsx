"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./usuarios.css"

// URL base de la API
const API_URL = "http://localhost:5000/user"

const Usuarios = () => {
  const navigate = useNavigate()

  // Estado para controlar el tipo de usuario seleccionado (1=Estudiante, 2=Docente)
  const [tipoUsuario, setTipoUsuario] = useState(2) // Por defecto mostramos docentes (2)

  // Estado para almacenar los usuarios
  const [usuarios, setUsuarios] = useState([])

  // Estado para rastrear los usuarios seleccionados
  const [seleccionados, setSeleccionados] = useState([])

  // Estado para el modal de confirmación de eliminación
  const [modalEliminar, setModalEliminar] = useState(false)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)

  // Estados para manejar la carga y errores
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // Estado para controlar la visibilidad del sidebar
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // Modificar la función tipoTexto para reflejar los nuevos valores
  const tipoTexto = (tipo) => {
    switch (tipo) {
      case 3:
        return "Administrador"
      case 1:
        return "Estudiante"
      case 2:
        return "Docente"
      default:
        return "Desconocido"
    }
  }

  // Función para cargar usuarios desde la API
  const cargarUsuarios = async () => {
    setCargando(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/get_users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: tipoUsuario }),
      })

      if (!response.ok) {
        throw new Error(`Error al cargar usuarios: ${response.status}`)
      }

      const data = await response.json()
      setUsuarios(data)
      // Limpiar seleccionados al cambiar de tipo
      setSeleccionados([])
    } catch (err) {
      setError(err.message)
      console.error("Error al cargar usuarios:", err)
    } finally {
      setCargando(false)
    }
  }

  // Cargar usuarios cuando cambia el tipo seleccionado
  useEffect(() => {
    cargarUsuarios()
  }, [tipoUsuario])

  // Función para abrir el modal de eliminación
  const abrirModalEliminar = (usuario) => {
    setUsuarioEliminar(usuario)
    setModalEliminar(true)
  }

  // Función para confirmar la eliminación
  const confirmarEliminar = async () => {
    setCargando(true)
    setError(null)

    try {
      if (seleccionados.length > 0) {
        // Eliminar múltiples usuarios
        const response = await fetch(`${API_URL}/delete_users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codes: seleccionados }),
        })

        if (!response.ok) {
          throw new Error(`Error al eliminar usuarios: ${response.status}`)
        }

        // Actualizar la lista de usuarios
        cargarUsuarios()
        setSeleccionados([])
      } else {
        // Eliminar un solo usuario
        const response = await fetch(`${API_URL}/delete_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: usuarioEliminar.code }),
        })

        if (!response.ok) {
          throw new Error(`Error al eliminar usuario: ${response.status}`)
        }

        // Actualizar la lista de usuarios
        cargarUsuarios()
      }

      setModalEliminar(false)
    } catch (err) {
      setError(err.message)
      console.error("Error al eliminar:", err)
    } finally {
      setCargando(false)
    }
  }

  // Función para ir a la página de edición
  const irAEditar = (usuario) => {
    navigate(`/editar/${usuario.code}`)
  }

  // Función para ir a la página de creación
  const añadirUsuario = () => {
    navigate("/editar")
  }

  // Función para manejar la selección de usuarios
  const handleSeleccion = (code) => {
    if (seleccionados.includes(code)) {
      setSeleccionados(seleccionados.filter((itemId) => itemId !== code))
    } else {
      setSeleccionados([...seleccionados, code])
    }
  }

  // Función para seleccionar/deseleccionar todos
  const seleccionarTodos = () => {
    if (seleccionados.length === usuarios.length) {
      setSeleccionados([])
    } else {
      setSeleccionados(usuarios.map((usuario) => usuario.code))
    }
  }

  // Función para eliminar los usuarios seleccionados
  const eliminarSeleccionados = () => {
    setModalEliminar(true)
    setUsuarioEliminar({ name: `${seleccionados.length} usuarios` })
  }

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>LearnPy Administrator</h1>
      </header>

      <div className="admin-content">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {sidebarVisible ? "◀" : "▶"}
        </button>

        <aside className={`admin-sidebar ${sidebarVisible ? "" : "collapsed"}`}>
          <div className={`sidebar-item ${tipoUsuario === 2 ? "active" : ""}`} onClick={() => setTipoUsuario(2)}>
            <i className="user-icon docente"></i> Docentes
          </div>
          <div className={`sidebar-item ${tipoUsuario === 1 ? "active" : ""}`} onClick={() => setTipoUsuario(1)}>
            <i className="user-icon estudiante"></i> Estudiantes
          </div>
          <div className="sidebar-item">
            <i className="user-icon leccion"></i> Lecciones
          </div>
        </aside>

        <main className={`admin-main ${sidebarVisible ? "" : "expanded"}`}>
          {error && <div className="error-message">Error: {error}</div>}

          <div className="table-actions">
            <button
              className="btn-eliminar-seleccionados"
              onClick={eliminarSeleccionados}
              disabled={seleccionados.length === 0 || cargando}
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
                      checked={seleccionados.length === usuarios.length && usuarios.length > 0}
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
                  usuarios.map((usuario) => (
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
                      <td>{tipoTexto(usuario.type)}</td>
                      <td className="acciones">
                        <button className="btn-editar" onClick={() => irAEditar(usuario)} title="Editar usuario">
                          <i className="edit-icon">✏️</i>
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => abrirModalEliminar(usuario)}
                          title="Eliminar usuario"
                        >
                          <i className="delete-icon" style={{ color: "red" }}>
                            🗑️
                          </i>
                        </button>
                      </td>
                    </tr>
                  ))
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

      {/* Modal de confirmación para eliminar */}
      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar eliminación</h2>
            <p>
              {seleccionados.length > 0
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
  )
}

export default Usuarios
