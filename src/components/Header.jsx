import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <img
            src="/logoprote.png"
            alt="Protectora San Francisco de Asís Mercedes"
            className="logo"
          />
        </Link>

        <nav className="nav">
          <NavLink to="/">
            Inicio
          </NavLink>

          <NavLink to="/adopciones">
            Adoptar
          </NavLink>

          <NavLink to="/apadrinar">
            Madrinas y padrinos
          </NavLink>

          <NavLink to="/finales-felices">
            Finales felices
          </NavLink>

          <NavLink
            to="/donar"
            className="btn-donar"
          >
            ❤️ Donar
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;