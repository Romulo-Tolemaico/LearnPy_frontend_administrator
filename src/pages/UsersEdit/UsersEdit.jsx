import { useParams, useNavigate } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
//import React from "react";
import "./UsersEdit.css";

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: ""
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/usuarios/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          nombre: data.nombre,
          correo: data.correo,
          contraseña: "",
          confirmarContraseña: ""
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

    if (form.contraseña !== form.confirmarContraseña) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const datosActualizados = {
      nombre: form.nombre,
      correo: form.correo,
    };

    if (form.contraseña) {
      datosActualizados.contraseña = form.contraseña;
    }

    await fetch(`/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosActualizados)
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
          <input type="password" name="confirmarContraseña" value={form.confirmarContraseña} onChange={handleChange} />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarUsuario;
