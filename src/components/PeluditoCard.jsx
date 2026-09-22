import { Link } from "react-router-dom";

const PeluditoCard = ({ perro }) => {
  return (
    <article className="peludito-card">
      <div className="peludito-imagen">
        <img
          src={perro.imagen}
          alt={`Foto de ${perro.nombre}`}
        />

        <span className="peludito-estado">
          🐾 {perro.estado}
        </span>
      </div>

      <div className="peludito-info">
        <div className="peludito-titulo">
          <h2>{perro.nombre}</h2>

          <span
            title={perro.sexo}
            aria-label={perro.sexo}
          >
            {perro.sexo === "Hembra" ? "♀" : "♂"}
          </span>
        </div>

        <div className="peludito-datos">
          <span>
            {perro.edad}{" "}
            {perro.edad === 1 ? "año" : "años"}
          </span>

          <span>•</span>

          <span>{perro.tamano}</span>

          <span>•</span>

          <span>{perro.energia}</span>
        </div>

        <p>{perro.descripcion}</p>

        <div className="peludito-tags">
          {perro.aptoPerros && (
            <span>🐕 Perros</span>
          )}

          {perro.aptoGatos && (
            <span>🐈 Gatos</span>
          )}

          {perro.aptoNinos && (
            <span>👧 Niños</span>
          )}
        </div>

        <Link
          to={`/adopciones/${perro.id}`}
          className="peludito-link"
        >
          Conoceme →
        </Link>
      </div>
    </article>
  );
};

export default PeluditoCard;