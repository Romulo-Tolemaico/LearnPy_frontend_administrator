import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarUsuario.css";


function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: ""
  });

  useEffect(() => {
    if (!id) return; // Si no hay id, no se hace el fetch
    fetch(`/api/usuarios/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nombre: data.nombre,
          correo: data.correo,
          contraseña: ""
        });
      })
      .catch(err => console.error("Error al obtener usuario:", err));
  }, [id]);
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate("/");
  };

  return (
    <div className="editar-usuario-container">
      <h2>Editar Usuario</h2>
      <form className="editar-usuario-form" onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo electrónico:</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
  
}

export default EditarUsuario;