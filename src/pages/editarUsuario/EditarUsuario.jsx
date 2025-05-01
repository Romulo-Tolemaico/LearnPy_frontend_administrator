"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./EditarUsuario.css"

// URL base de la API
const API_URL = "http://localhost:5000/user"

const EditarUsuario = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Estado para el usuario que se está editando
  const [usuario, setUsuario] = useState({
    code: null,
    name: "",
    email: "",
    password: "",
    type: 2, // Por defecto, docente (ahora es tipo 2)
  })

  // Estados para manejar la carga y errores
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  // Función para convertir el tipo numérico a texto para la UI
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

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    const cargarUsuario = async () => {
      if (id) {
        setCargando(true)
        setError(null)

        try {
          const response = await fetch(`${API_URL}/get_user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: Number.parseInt(id) }),
          })

          if (!response.ok) {
            throw new Error(`Error al cargar usuario: ${response.status}`)
          }

          const data = await response.json()
          setUsuario(data)
        } catch (err) {
          setError(err.message)
          console.error("Error al cargar usuario:", err)
        } finally {
          setCargando(false)
        }
      }
    }

    cargarUsuario()
  }, [id])

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target

    // Si el campo es type, convertir a número
    if (name === "type") {
      setUsuario({
        ...usuario,
        [name]: Number.parseInt(value),
      })
    } else {
      setUsuario({
        ...usuario,
        [name]: value,
      })
    }
  }

  // Función para guardar los cambios
  const guardarCambios = async () => {
    setGuardando(true)
    setError(null)

    try {
      if (usuario.code) {
        // Editar usuario existente
        const response = await fetch(`${API_URL}/edit_user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: usuario.code,
            name: usuario.name,
            email: usuario.email,
            type: usuario.type,
          }),
        })

        if (!response.ok) {
          throw new Error(`Error al actualizar usuario: ${response.status}`)
        }
      } else {
        // Crear nuevo usuario
        const response = await fetch(`${API_URL}/register_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: usuario.name,
            email: usuario.email,
            password: usuario.password,
            type: usuario.type,
          }),
        })

        if (!response.ok) {
          throw new Error(`Error al registrar usuario: ${response.status}`)
        }
      }

      // Volver a la página principal
      navigate("/")
    } catch (err) {
      setError(err.message)
      console.error("Error al guardar usuario:", err)
    } finally {
      setGuardando(false)
    }
  }

  // Función para cancelar la edición
  const cancelar = () => {
    navigate("/")
  }

  // Validar formulario
  const formularioValido = () => {
    return usuario.name && usuario.email && (usuario.code || usuario.password)
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>LearnPy Administrator</h1>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <div className="sidebar-item">
            <i className="user-icon"></i> Usuarios
          </div>
          <div className="sidebar-item">Docentes</div>
          <div className="sidebar-item">Estudiantes</div>
          <div className="sidebar-item">Lecciones</div>
        </aside>

        <main className="admin-main">
          <div className="form-container">
            <h2>{usuario.code ? "Editar Usuario" : "Añadir Usuario"}</h2>

            {error && <div className="error-message">Error: {error}</div>}

            {cargando ? (
              <div className="loading">Cargando datos del usuario...</div>
            ) : (
              <form className="form-editar" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Nombre de Usuario:</label>
                  <input type="text" name="name" value={usuario.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={usuario.email} onChange={handleChange} required />
                </div>
                {!usuario.code && (
                  <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                      type="password"
                      name="password"
                      value={usuario.password}
                      onChange={handleChange}
                      required={!usuario.code}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Tipo:</label>
                  <select name="type" value={usuario.type} onChange={handleChange}>
                    <option value={1}>Estudiante</option>
                    <option value={2}>Docente</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancelar" onClick={cancelar} disabled={guardando}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn-confirmar"
                    onClick={guardarCambios}
                    disabled={!formularioValido() || guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default EditarUsuario
