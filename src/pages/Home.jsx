import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            🐾 Protectora San Francisco de Asís
          </span>

          <h1>
            Cientos de historias
            <br />
            <span>buscando una familia.</span>
          </h1>

          <p>
            Conocé a nuestros peluditos, descubrí sus
            historias y encontrá a ese compañero que está
            esperando por vos.
          </p>

          <div className="hero-actions">
            <Link
              to="/adopciones"
              className="btn btn-primary"
            >
              🐾 Quiero adoptar
            </Link>

            <Link
              to="/apadrinar"
              className="btn btn-secondary"
            >
              ❤️ Quiero acompañar
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-placeholder">
            <span>🐕</span>

            <p>
              Muy pronto, una de nuestras historias
              puede empezar acá.
            </p>
          </div>
        </div>
      </section>

      <section className="formas-ayudar">
        <div className="section-heading">
          <span>SUMATE</span>

          <h2>
            Hay muchas formas de cambiar una vida
          </h2>

          <p>
            Cada ayuda importa. Elegí cómo querés ser
            parte de esta historia.
          </p>
        </div>

        <div className="ayuda-grid">
          <Link
            to="/adopciones"
            className="ayuda-card"
          >
            <div className="ayuda-icon">🏠</div>

            <h3>Adoptá</h3>

            <p>
              Dale una familia y un hogar para siempre
              a uno de nuestros peluditos.
            </p>

            <span>Conocerlos →</span>
          </Link>

          <Link
            to="/apadrinar"
            className="ayuda-card"
          >
            <div className="ayuda-icon">🐾</div>

            <h3>Madrinas y padrinos</h3>

            <p>
              Acompañá a uno de nuestros peluditos y
              ayudanos con sus cuidados mientras espera
              encontrar su hogar definitivo.
            </p>

            <span>Quiero acompañar →</span>
          </Link>

          <Link
            to="/donar"
            className="ayuda-card"
          >
            <div className="ayuda-icon">❤️</div>

            <h3>Doná</h3>

            <p>
              Tu colaboración nos ayuda con alimento,
              medicamentos y atención veterinaria.
            </p>

            <span>Quiero colaborar →</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;