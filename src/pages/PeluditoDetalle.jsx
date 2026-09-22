import { Link, useParams } from "react-router-dom";
import perros from "../data/perros.js";

const PeluditoDetalle = () => {
  const { id } = useParams();

  const perro = perros.find(
    (item) => item.id === id
  );

  if (!perro) {
    return (
      <section className="page-container">
        <div className="peludito-no-encontrado">
          <span>🐾</span>

          <h1>Peludito no encontrado</h1>

          <p>
            No pudimos encontrar la historia que
            estabas buscando.
          </p>

          <Link
            to="/adopciones"
            className="btn btn-primary"
          >
            Ver peluditos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="detalle-page">
      <div className="detalle-volver">
        <Link to="/adopciones">
          ← Volver a adopciones
        </Link>
      </div>

      <div className="detalle-grid">
        <div className="detalle-fotos">
          <div className="detalle-foto-principal">
            <img
              src={perro.imagen}
              alt={`Foto de ${perro.nombre}`}
            />

            <span className="detalle-estado">
              🐾 {perro.estado}
            </span>
          </div>
        </div>

        <div className="detalle-info">
          <span className="detalle-id">
            {perro.id.toUpperCase()}
          </span>

          <div className="detalle-nombre">
            <h1>{perro.nombre}</h1>

            <span>
              {perro.sexo === "Hembra"
                ? "♀"
                : "♂"}
            </span>
          </div>

          <p className="detalle-intro">
            Tal vez la historia de{" "}
            <strong>{perro.nombre}</strong>{" "}
            continúe con vos.
          </p>

          <div className="detalle-caracteristicas">
            <div>
              <span>EDAD</span>

              <strong>
                {perro.edad}{" "}
                {perro.edad === 1
                  ? "año"
                  : "años"}
              </strong>
            </div>

            <div>
              <span>SEXO</span>
              <strong>{perro.sexo}</strong>
            </div>

            <div>
              <span>TAMAÑO</span>
              <strong>{perro.tamano}</strong>
            </div>

            <div>
              <span>PERSONALIDAD</span>
              <strong>{perro.energia}</strong>
            </div>
          </div>

          <div className="detalle-historia">
            <span>MI HISTORIA</span>

            <h2>Conocé a {perro.nombre}</h2>

            <p>{perro.descripcion}</p>
          </div>

          <div className="detalle-convivencia">
            <h3>¿Con quién puede convivir?</h3>

            <div className="convivencia-grid">
              <div
                className={
                  perro.aptoPerros
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >
                <span>🐕</span>

                <div>
                  <strong>Perros</strong>
                  <small>
                    {perro.aptoPerros
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>
              </div>

              <div
                className={
                  perro.aptoGatos
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >
                <span>🐈</span>

                <div>
                  <strong>Gatos</strong>
                  <small>
                    {perro.aptoGatos
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>
              </div>

              <div
                className={
                  perro.aptoNinos
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >
                <span>👧</span>

                <div>
                  <strong>Niños</strong>
                  <small>
                    {perro.aptoNinos
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="detalle-acciones">
            <Link
              to={`/adoptar/${perro.id}`}
              className="btn btn-primary detalle-btn"
            >
              ❤️ Quiero adoptar a {perro.nombre}
            </Link>

            <Link
              to={`/apadrinar?peludito=${perro.id}`}
              className="btn btn-secondary detalle-btn"
            >
              🐾 Quiero acompañarlo
            </Link>
          </div>

          <p className="detalle-aclaracion">
            Enviar una solicitud no implica una
            adopción automática. La Protectora se
            pondrá en contacto para continuar el
            proceso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PeluditoDetalle;