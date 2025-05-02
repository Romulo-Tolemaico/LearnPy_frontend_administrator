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
    type: 2, // Por defecto, docente (tipo 2)
  })

  // Estado para controlar la visibilidad de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  })

  // Estado para el modal de éxito
  const [modalExito, setModalExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")

  // Estado para controlar la visibilidad del sidebar
  const [sidebarVisible, setSidebarVisible] = useState(true)
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
          console.log("Datos del usuario cargados:", data) // Para depuración

          // Asegurarse de que el tipo se establezca correctamente
          setUsuario({
            ...data,
            type: data.type || 2, // Asegurarse de que type tenga un valor
          })
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

  // Función para validar un campo específico
  const validarCampo = (name, value) => {
    let errorMessage = ""

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "El nombre completo es obligatorio."
        } else if (!/^[a-zA-Z][a-zA-Z0-9_ .]{2,39}$/.test(value)) {
          errorMessage = "Debe comenzar con letra y solo usar letras, números, puntos o guiones bajos (3-40 caracteres)"
        }
        break

      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es obligatorio."
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
          errorMessage =
            'Debes ingresar un correo electrónico válido que termine en "@gmail.com". Ejemplo: usuario@gmail.com'
        }
        break

      case "password":
        if (!value) {
          errorMessage = "La contraseña es obligatoria."
        } else if (value.length < 8) {
          errorMessage = "La contraseña debe tener al menos 8 caracteres."
        } else if (!/[a-z]/.test(value)) {
          errorMessage = "La contraseña debe incluir al menos una letra minúscula."
        } else if (!/[A-Z]/.test(value)) {
          errorMessage = "La contraseña debe incluir al menos una letra mayúscula."
        } else if (!/\d/.test(value)) {
          errorMessage = "La contraseña debe incluir al menos un número."
        } else if (!/[@#$%^&+=!]/.test(value)) {
          errorMessage = "La contraseña debe incluir al menos un carácter especial (@#$%^&+=!)."
        }
        break

      default:
        break
    }

    return errorMessage
  }

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target

    // Actualizar el valor en el estado
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

      // Validar el campo y actualizar los errores
      const errorMessage = validarCampo(name, value)
      setErrors({
        ...errors,
        [name]: errorMessage,
      })
    }
  }

  // Función para validar todo el formulario
  const validarFormulario = () => {
    const newErrors = {
      name: validarCampo("name", usuario.name),
      email: validarCampo("email", usuario.email),
      password: usuario.code ? "" : validarCampo("password", usuario.password), // Solo validar contraseña para nuevos usuarios
      general: "",
    }

    setErrors(newErrors)

    // Verificar si hay errores
    return !Object.values(newErrors).some((error) => error !== "")
  }

  // Función para guardar los cambios
  const guardarCambios = async () => {
    // Validar todo el formulario antes de enviar
    if (!validarFormulario()) {
      return
    }

    setGuardando(true)
    setError(null)
    setErrors({ name: "", email: "", password: "", general: "" })

    try {
      if (usuario.code) {
        // Editar usuario existente (incluir una contraseña predeterminada)
        const response = await fetch(`${API_URL}/edit_user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: usuario.code,
            name: usuario.name,
            email: usuario.email,
            password: "Contraseña123!", // Incluir una contraseña predeterminada para evitar el error 500
            type: usuario.type,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (Array.isArray(data.message)) {
            setErrors({
              name: data.message[1] === false ? "El nombre enviado no es válido según el servidor." : "",
              email:
                data.message[2] === false
                  ? "El correo enviado no es válido."
                  : data.message[3] === false
                    ? "Este correo ya está registrado."
                    : "",
              password: "",
              general: "",
            })
          } else {
            setErrors({ ...errors, general: data.message || "Error desconocido al actualizar." })
          }
          return
        }

        // Mostrar modal de éxito
        setMensajeExito("Usuario actualizado correctamente")
        setModalExito(true)
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

        const data = await response.json()

        if (!response.ok) {
          if (Array.isArray(data.message)) {
            setErrors({
              name: data.message[1] === false ? "El nombre enviado no es válido según el servidor." : "",
              email:
                data.message[2] === false
                  ? "El correo enviado no es válido."
                  : data.message[3] === false
                    ? "Este correo ya está registrado."
                    : "",
              password: data.message[0] === false ? "La contraseña enviada no cumple los requisitos." : "",
              general: "",
            })
          } else {
            setErrors({ ...errors, general: data.message || "Error desconocido al registrar." })
          }
          return
        }

        // Mostrar modal de éxito
        setMensajeExito("Usuario creado correctamente")
        setModalExito(true)
      }
    } catch (err) {
      setError(err.message)
      console.error("Error al guardar usuario:", err)
    } finally {
      setGuardando(false)
    }
  }

  // Función para cerrar el modal de éxito y volver a la página principal
  const cerrarModalExito = () => {
    setModalExito(false)
    navigate("/")
  }

  // Función para cancelar la edición
  const cancelar = () => {
    navigate("/")
  }

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Función para alternar la visibilidad de la contraseña
  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword)
  }

  // Validar formulario
  const formularioValido = () => {
    if (usuario.code) {
      // Para edición, solo validar nombre y email
      return usuario.name && usuario.email && !errors.name && !errors.email
    } else {
      // Para creación, validar todo
      return usuario.name && usuario.email && usuario.password && !errors.name && !errors.email && !errors.password
    }
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
          <div className="sidebar-item">
            <i className="user-icon docente"></i> Docentes
          </div>
          <div className="sidebar-item">
            <i className="user-icon estudiante"></i> Estudiantes
          </div>
          <div className="sidebar-item">
            <i className="user-icon leccion"></i> Lecciones
          </div>
        </aside>

        <main className={`admin-main ${sidebarVisible ? "" : "expanded"}`}>
          <div className="form-container">
            <h2>{usuario.code ? "Editar Usuario" : "Añadir Usuario"}</h2>

            {error && <div className="error-message">Error: {error}</div>}
            {errors.general && <div className="error-message">{errors.general}</div>}

            {cargando ? (
              <div className="loading">Cargando datos del usuario...</div>
            ) : (
              <form className="form-editar" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Nombre de Usuario:</label>
                  <input
                    type="text"
                    name="name"
                    value={usuario.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                    required
                  />
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={usuario.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                    required
                  />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                {/* Mostrar campo de contraseña solo para nuevos usuarios */}
                {!usuario.code && (
                  <div className="form-group">
                    <label>Contraseña:</label>
                    <div className="password-input-container">
                      <input
                        type={mostrarPassword ? "text" : "password"}
                        name="password"
                        value={usuario.password}
                        onChange={handleChange}
                        className={errors.password ? "input-error" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={toggleMostrarPassword}
                        title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {mostrarPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {errors.password && <div className="error-text">{errors.password}</div>}
                    <div className="password-requirements">
                      La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y
                      caracteres especiales (@#$%^&+=!).
                    </div>
                  </div>
                )}

<div className="form-group">
  <label>Tipo:</label>
  <select name="type" value={usuario.type} onChange={handleChange}>
    {usuario.type === 2 ? (
      <>
        <option value={2}>Docente</option>
        <option value={1}>Estudiante</option>
      </>
    ) : (
      <>
        <option value={1}>Estudiante</option>
        <option value={2}>Docente</option>
      </>
    )}
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

      {/* Modal de éxito */}
      {modalExito && (
        <div className="modal-overlay">
          <div className="modal-content modal-success">
            <h2>¡Operación Exitosa!</h2>
            <p>{mensajeExito}</p>
            <div className="modal-actions">
              <button className="btn-confirmar" onClick={cerrarModalExito}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditarUsuario
