import {
  Link,
} from "react-router-dom";

const PeluditoCard = ({
  perro,
}) => {
  return (
    <article className="peludito-card">

      {/* ===============================================
          FOTO
          =============================================== */}

      <div className="peludito-imagen">

        {perro.imagen ? (
          <img
            src={perro.imagen}
            alt={`Foto de ${perro.nombre}`}
            loading="lazy"
          />
        ) : (
          <div className="peludito-imagen-placeholder">
            🐾
          </div>
        )}

        <span className="peludito-estado">
          🐾 {perro.estado}
        </span>

      </div>

      {/* ===============================================
          INFORMACIÓN
          =============================================== */}

      <div className="peludito-info">

        <div className="peludito-titulo">

          <h2>
            {perro.nombre}
          </h2>

          {perro.sexo && (
            <span
              title={perro.sexo}
              aria-label={
                perro.sexo
              }
            >
              {perro.sexo ===
              "Hembra"
                ? "♀"
                : "♂"}
            </span>
          )}

        </div>

        {/* =============================================
            DATOS
            ============================================= */}

        <div className="peludito-datos">

          {perro.edad != null && (
            <>
              <span>
                {perro.edad}{" "}
                {perro.edad === 1
                  ? "año"
                  : "años"}
              </span>

              {(perro.tamano ||
                perro.energia) && (
                <span>
                  •
                </span>
              )}
            </>
          )}

          {perro.tamano && (
            <>
              <span>
                {perro.tamano}
              </span>

              {perro.energia && (
                <span>
                  •
                </span>
              )}
            </>
          )}

          {perro.energia && (
            <span>
              {perro.energia}
            </span>
          )}

        </div>

        {/* =============================================
            DESCRIPCIÓN
            ============================================= */}

        {perro.descripcion && (
          <p>
            {perro.descripcion}
          </p>
        )}

        {/* =============================================
            CONVIVENCIA
            ============================================= */}

        {(perro.apto_perros ||
          perro.apto_gatos ||
          perro.apto_ninos ||
          perro.aptoPerros ||
          perro.aptoGatos ||
          perro.aptoNinos) && (

          <div className="peludito-tags">

            {(perro.apto_perros ||
              perro.aptoPerros) && (
              <span>
                🐕 Perros
              </span>
            )}

            {(perro.apto_gatos ||
              perro.aptoGatos) && (
              <span>
                🐈 Gatos
              </span>
            )}

            {(perro.apto_ninos ||
              perro.aptoNinos) && (
              <span>
                👧 Niños
              </span>
            )}

          </div>
        )}

        {/* =============================================
            DETALLE
            ============================================= */}

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