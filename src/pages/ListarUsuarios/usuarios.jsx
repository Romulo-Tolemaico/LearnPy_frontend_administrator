"use client"

import { useState } from "react"
import "./usuarios.css"

const Usuarios = () => {
  // Estado para controlar el tipo de usuario seleccionado (docentes o estudiantes)
  const [tipoUsuario, setTipoUsuario] = useState("docentes")

  // Estado para almacenar los usuarios
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Juan Carlos", email: "Email1@gmail.com", contraseña: "11111111", tipo: "docentes" },
    { id: 2, nombre: "Juan Carlos", email: "Email1@gmail.com", contraseña: "11111111", tipo: "docentes" },
    { id: 3, nombre: "Juan Carlos", email: "Email1@gmail.com", contraseña: "11111111", tipo: "docentes" },
    { id: 4, nombre: "Juan Carlos", email: "Email1@gmail.com", contraseña: "11111111", tipo: "docentes" },
    { id: 5, nombre: "Juan Carlos", email: "Email1@gmail.com", contraseña: "11111111", tipo: "docentes" },
    { id: 6, nombre: "María López", email: "maria@gmail.com", contraseña: "22222222", tipo: "estudiantes" },
    { id: 7, nombre: "Pedro Gómez", email: "pedro@gmail.com", contraseña: "33333333", tipo: "estudiantes" },
  ])

  // Estado para rastrear los usuarios seleccionados
  const [seleccionados, setSeleccionados] = useState([])

  // Estado para el modal de confirmación de eliminación
  const [modalEliminar, setModalEliminar] = useState(false)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)

  // Estado para el modal de edición
  const [modalEditar, setModalEditar] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState({
    id: null,
    nombre: "",
    email: "",
    contraseña: "",
    tipo: "",
  })

  // Función para abrir el modal de eliminación
  const abrirModalEliminar = (usuario) => {
    setUsuarioEliminar(usuario)
    setModalEliminar(true)
  }

  // Función para confirmar la eliminación
  const confirmarEliminar = () => {
    if (seleccionados.length > 0) {
      confirmarEliminarSeleccionados()
    } else {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== usuarioEliminar.id))
      setModalEliminar(false)
    }
  }

  // Función para abrir el modal de edición
  const abrirModalEditar = (usuario) => {
    setUsuarioEditar({ ...usuario })
    setModalEditar(true)
  }

  // Función para guardar los cambios de edición
  const guardarCambios = () => {
    setUsuarios(usuarios.map((usuario) => (usuario.id === usuarioEditar.id ? usuarioEditar : usuario)))
    setModalEditar(false)
  }

  // Función para manejar cambios en los inputs del formulario de edición
  const handleChange = (e) => {
    const { name, value } = e.target
    setUsuarioEditar({
      ...usuarioEditar,
      [name]: value,
    })
  }

  // Función para añadir un nuevo usuario
  const añadirUsuario = () => {
    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: "Nuevo Usuario",
      email: "nuevo@gmail.com",
      contraseña: "12345678",
      tipo: tipoUsuario,
    }

    setUsuarioEditar(nuevoUsuario)
    setModalEditar(true)
  }

  // Función para manejar la selección de usuarios
  const handleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((itemId) => itemId !== id))
    } else {
      setSeleccionados([...seleccionados, id])
    }
  }

  // Función para seleccionar/deseleccionar todos
  const seleccionarTodos = () => {
    if (seleccionados.length === usuariosFiltrados.length) {
      setSeleccionados([])
    } else {
      setSeleccionados(usuariosFiltrados.map((usuario) => usuario.id))
    }
  }

  // Función para eliminar los usuarios seleccionados
  const eliminarSeleccionados = () => {
    setModalEliminar(true)
    setUsuarioEliminar({ nombre: `${seleccionados.length} usuarios` })
  }

  // Función para confirmar la eliminación de seleccionados
  const confirmarEliminarSeleccionados = () => {
    setUsuarios(usuarios.filter((usuario) => !seleccionados.includes(usuario.id)))
    setSeleccionados([])
    setModalEliminar(false)
  }

  // Filtrar usuarios según el tipo seleccionado
  const usuariosFiltrados = usuarios.filter((usuario) => usuario.tipo === tipoUsuario)

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>LearnPy Administrator</h1>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <div
            className={`sidebar-item ${tipoUsuario === "usuarios" ? "active" : ""}`}
            onClick={() => setTipoUsuario("usuarios")}
          >
            <i className="user-icon"></i> Usuarios
          </div>
          <div
            className={`sidebar-item ${tipoUsuario === "docentes" ? "active" : ""}`}
            onClick={() => setTipoUsuario("docentes")}
          >
            Docentes
          </div>
          <div
            className={`sidebar-item ${tipoUsuario === "estudiantes" ? "active" : ""}`}
            onClick={() => setTipoUsuario("estudiantes")}
          >
            Estudiantes
          </div>
          <div className="sidebar-item">Lecciones</div>
        </aside>

        <main className="admin-main">
          <div className="table-actions">
            <button
              className="btn-eliminar-seleccionados"
              onClick={eliminarSeleccionados}
              disabled={seleccionados.length === 0}
            >
              Eliminar Seleccionados <i className="delete-icon">🗑</i>
            </button>
            <button className="btn-añadir" onClick={añadirUsuario}>
              Añadir <i className="add-icon">+</i>
            </button>
          </div>

          <table className="usuarios-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={seleccionados.length === usuariosFiltrados.length && usuariosFiltrados.length > 0}
                    onChange={seleccionarTodos}
                  />
                </th>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(usuario.id)}
                      onChange={() => handleSeleccion(usuario.id)}
                    />
                  </td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.contraseña}</td>
                  <td className="acciones">
                    <button className="btn-editar" onClick={() => abrirModalEditar(usuario)}>
                      <i className="edit-icon">✎</i>
                    </button>
                    <button className="btn-eliminar" onClick={() => abrirModalEliminar(usuario)}>
                      <i className="delete-icon">🗑</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                : `¿Está seguro que desea eliminar al usuario ${usuarioEliminar.nombre}?`}
            </p>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setModalEliminar(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{usuarioEditar.id ? "Editar Usuario" : "Añadir Usuario"}</h2>
            <form className="form-editar">
              <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input type="text" name="nombre" value={usuarioEditar.nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={usuarioEditar.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" name="contraseña" value={usuarioEditar.contraseña} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tipo:</label>
                <select name="tipo" value={usuarioEditar.tipo} onChange={handleChange}>
                  <option value="docentes">Docente</option>
                  <option value="estudiantes">Estudiante</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setModalEditar(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn-confirmar" onClick={guardarCambios}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Usuarios
