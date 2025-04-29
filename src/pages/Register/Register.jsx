import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección sin recargar
import './Register.css';
import Header from '../../components/Header/Header'; 

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 1,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();  // Usamos useNavigate para la redirección

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'El nombre completo es obligatorio.';
    } else if (!/^[a-zA-Z][a-zA-Z0-9_ .]{2,39}$/.test(name)) {
      newErrors.name = 'Debe comenzar con letra y solo usar letras, números, puntos o guiones bajos (3-40 caracteres)';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email = 'Debes ingresar un correo electrónico válido que termine en "@gmail.com". Ejemplo: usuario@gmail.com';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else {
      if (password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      else if (!/[a-z]/.test(password)) newErrors.password = 'La contraseña debe incluir al menos una letra minúscula.';
      else if (!/[A-Z]/.test(password)) newErrors.password = 'La contraseña debe incluir al menos una letra mayúscula.';
      else if (!/\d/.test(password)) newErrors.password = 'La contraseña debe incluir al menos un número.';
      else if (!/[@#$%^&+=!]/.test(password)) newErrors.password = 'La contraseña debe incluir al menos un carácter especial (@#$%^&+=!).';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(newErrors).length > 0) isValid = false;
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      const response = await fetch('http://localhost:5000/user/register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          type: formData.type,
        }),      
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setErrors({
            name: data.message[1] === false ? 'El nombre enviado no es válido según el servidor.' : '',
            email: data.message[2] === false ? 'El correo enviado no es válido.' :
                   data.message[3] === false ? 'Este correo ya está registrado.' : '',
            password: data.message[0] === false ? 'La contraseña enviada no cumple los requisitos.' : ''
          });
        } else {
          setErrors({ general: data.message || 'Error desconocido al registrar.' });
        }
        return;
      }

      alert('¡Registro exitoso!');
      navigate('/listUsers');  // Cambié window.location.href por navigate
    } catch {
      setErrors({ general: 'Error de conexión. Por favor intenta más tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header titulo="LearnPy Administrator - Crear nuevo usuario" />
      <div className="register-container">
        <h1>Registrarse</h1>
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'confirmPassword'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label htmlFor={field}>
                {field === 'name' && 'Nombre Completo'}
                {field === 'email' && 'Correo Electrónico'}
                {field === 'password' && 'Contraseña'}
                {field === 'confirmPassword' && 'Confirmar Contraseña'}
              </label>
              <input
                type={field === 'password' || field === 'confirmPassword' ? 'password' : field === 'email' ? 'email' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
              {errors[field] && <p className="input-error">{errors[field]}</p>}
            </div>
          ))}
          <div className="form-group">
            <label>Tipo de usuario:</label>
            <div className="radio-options">
              {[{ label: 'Estudiante', value: 1 }, { label: 'Docente', value: 2 }].map(({ label, value }) => (
                <label className="radio-option" key={value}>
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={formData.type === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: parseInt(e.target.value) }))} 
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {errors.general && <p className="general-error">{errors.general}</p>}
          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Guardando' : 'Guardar'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
