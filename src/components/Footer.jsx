import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <img
            src="/logoprote.png"
            alt="Protectora San Francisco de Asís"
            className="footer-logo"
          />

          <p>
            Protectora de Animales San Francisco de Asís
            <br />
            Mercedes, Soriano · Uruguay
          </p>
        </div>

        <div>
          <h4>Ayudanos</h4>

          <Link to="/adopciones">
            Adoptar
          </Link>

          <Link to="/apadrinar">
            Apadrinar / Amadrinar
          </Link>

          <Link to="/donar">
            Donar
          </Link>
        </div>

        <div>
          <h4>Protectora</h4>

          <Link to="/finales-felices">
            Finales felices
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Protectora San Francisco de Asís
        </span>

        <Link
          to="/admin"
          className="footer-admin-icon"
          title="Administración"
          aria-label="Administración"
        >
          ⚙
        </Link>
      </div>
    </footer>
  );
};

export default Footer;