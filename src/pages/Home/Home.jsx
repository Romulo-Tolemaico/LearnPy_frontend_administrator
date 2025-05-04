import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>LearnPy</h1>
      <div className="hero-section">
        <h2>Aprende Python desde cero, a tu ritmo.</h2>
        <p>
          Nuestra plataforma interactiva te guía paso a paso para dominar Python con ejercicios 
          prácticos, proyectos reales y apoyo constante. ¡Empieza hoy y da el primer paso hacia 
          tu futuro en programación!
        </p>
      </div>

      <div className="auth-buttons">
        <Link to="/login" className="auth-button">Iniciar Sesión</Link>
      </div>

      <footer>
        <div className="legal-links">
          <a href="#">Política de privacidad</a>
          <a href="#">Términos</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;