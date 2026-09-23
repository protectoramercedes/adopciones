import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase.js";

const PeluditoDetalle = () => {
  const { id } = useParams();

  const [perro, setPerro] =
    useState(null);

  const [padrinos, setPadrinos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     SCROLL ARRIBA
     ======================================================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [id]);

  /* =======================================================
     CARGAR PELUDITO DESDE SUPABASE
     ======================================================= */

  useEffect(() => {
    const cargarPeludito = async () => {
      try {
        setCargando(true);
        setError("");

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("peluditos")
          .select(`
            *,
            peludito_fotos (
              id,
              url,
              principal,
              orden
            )
          `)
          .eq("id", id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setPerro(data);
      } catch (error) {
        console.error(
          "Error cargando peludito:",
          error
        );

        setPerro(null);

        setError(
          "No pudimos encontrar la historia que estabas buscando."
        );
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarPeludito();
    }
  }, [id]);

  /* =======================================================
     CARGAR PADRINOS ACTIVOS
     ======================================================= */

  useEffect(() => {
    const cargarPadrinos = async () => {
      if (!id) {
        return;
      }

      try {
        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("padrinazgos")
          .select(`
            id,
            nombre,
            anonimo
          `)
          .eq("peludito_id", id)
          .eq("estado", "activo")
          .order("created_at", {
            ascending: true,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setPadrinos(
          data ?? []
        );
      } catch (error) {
        console.error(
          "Error cargando padrinos:",
          error
        );

        /*
         * Si falla la consulta de padrinos,
         * no rompemos la ficha del peludito.
         */
        setPadrinos([]);
      }
    };

    cargarPadrinos();
  }, [id]);

  /* =======================================================
     ORDENAR FOTOS
     ======================================================= */

  const obtenerFotos = () => {
    if (!perro) {
      return [];
    }

    const fotos =
      perro.peludito_fotos ?? [];

    return [...fotos].sort(
      (a, b) => {
        /*
         * La principal siempre primero.
         */

        if (
          a.principal &&
          !b.principal
        ) {
          return -1;
        }

        if (
          !a.principal &&
          b.principal
        ) {
          return 1;
        }

        /*
         * Después respetamos orden.
         */

        return (
          (a.orden ?? 999) -
          (b.orden ?? 999)
        );
      }
    );
  };

  /* =======================================================
     CARGANDO
     ======================================================= */

  if (cargando) {
    return (
      <section className="page-container">

        <div className="peludito-no-encontrado">

          <span>
            🐾
          </span>

          <h1>
            Cargando peludito...
          </h1>

          <p>
            Estamos buscando su historia.
          </p>

        </div>

      </section>
    );
  }

  /* =======================================================
     NO ENCONTRADO
     ======================================================= */

  if (!perro || error) {
    return (
      <section className="page-container">

        <div className="peludito-no-encontrado">

          <span>
            🐾
          </span>

          <h1>
            Peludito no encontrado
          </h1>

          <p>
            {error ||
              "No pudimos encontrar la historia que estabas buscando."}
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

  const fotos =
    obtenerFotos();

  const fotoPrincipal =
    fotos[0]?.url ?? null;

  return (
    <section className="detalle-page">

      {/* ===================================================
          VOLVER
          =================================================== */}

      <div className="detalle-volver">

        <Link to="/adopciones">
          ← Volver a adopciones
        </Link>

      </div>

      <div className="detalle-grid">

        {/* =================================================
            FOTOS
            ================================================= */}

        <div className="detalle-fotos">

          <div className="detalle-foto-principal">

            {fotoPrincipal ? (
              <img
                src={fotoPrincipal}
                alt={`Foto de ${perro.nombre}`}
              />
            ) : (
              <div className="detalle-sin-foto">
                🐾
              </div>
            )}

            <span className="detalle-estado">
              🐾 {perro.estado}
            </span>

          </div>

          {/* FOTOS SECUNDARIAS */}

          {fotos.length > 1 && (
            <div className="detalle-miniaturas">

              {fotos
                .slice(1)
                .map((foto) => (
                  <img
                    key={foto.id}
                    src={foto.url}
                    alt={`Foto de ${perro.nombre}`}
                    loading="lazy"
                  />
                ))}

            </div>
          )}

        </div>

        {/* =================================================
            INFORMACIÓN
            ================================================= */}

        <div className="detalle-info">

          <span className="detalle-id">
            {perro.codigo ||
              "PELUDITO"}
          </span>

          <div className="detalle-nombre">

            <h1>
              {perro.nombre}
            </h1>

            <span>
              {perro.sexo === "Hembra"
                ? "♀"
                : "♂"}
            </span>

          </div>

          <p className="detalle-intro">
            Tal vez la historia de{" "}
            <strong>
              {perro.nombre}
            </strong>{" "}
            continúe con vos.
          </p>

          {/* =================================================
              CARACTERÍSTICAS
              ================================================= */}

          <div className="detalle-caracteristicas">

            <div>
              <span>
                EDAD
              </span>

              <strong>
                {perro.edad != null
                  ? `${perro.edad} ${
                      perro.edad === 1
                        ? "año"
                        : "años"
                    }`
                  : "Sin especificar"}
              </strong>
            </div>

            <div>
              <span>
                SEXO
              </span>

              <strong>
                {perro.sexo ||
                  "Sin especificar"}
              </strong>
            </div>

            <div>
              <span>
                TAMAÑO
              </span>

              <strong>
                {perro.tamano ||
                  "Sin especificar"}
              </strong>
            </div>

            <div>
              <span>
                PERSONALIDAD
              </span>

              <strong>
                {perro.energia ||
                  "Sin especificar"}
              </strong>
            </div>

          </div>

          {/* =================================================
              HISTORIA
              ================================================= */}

          <div className="detalle-historia">

            <span>
              MI HISTORIA
            </span>

            <h2>
              Conocé a {perro.nombre}
            </h2>

            <p>
              {perro.descripcion ||
                "Muy pronto vamos a contarte más sobre su historia."}
            </p>

          </div>

          {/* =================================================
              CONVIVENCIA
              ================================================= */}

          <div className="detalle-convivencia">

            <h3>
              ¿Con quién puede convivir?
            </h3>

            <div className="convivencia-grid">

              {/* PERROS */}

              <div
                className={
                  perro.apto_perros
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >

                <span>
                  🐕
                </span>

                <div>
                  <strong>
                    Perros
                  </strong>

                  <small>
                    {perro.apto_perros
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>

              </div>

              {/* GATOS */}

              <div
                className={
                  perro.apto_gatos
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >

                <span>
                  🐈
                </span>

                <div>
                  <strong>
                    Gatos
                  </strong>

                  <small>
                    {perro.apto_gatos
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>

              </div>

              {/* NIÑOS */}

              <div
                className={
                  perro.apto_ninos
                    ? "convivencia-item positivo"
                    : "convivencia-item negativo"
                }
              >

                <span>
                  👧
                </span>

                <div>
                  <strong>
                    Niños
                  </strong>

                  <small>
                    {perro.apto_ninos
                      ? "Puede convivir"
                      : "No recomendado"}
                  </small>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              PADRINOS Y MADRINAS
              ================================================= */}

          {perro.apadrinable && (
            <div className="detalle-padrinos">

              <div className="detalle-padrinos-header">

                <span className="detalle-padrinos-icono">
                  ❤️
                </span>

                <div>
                  <span className="detalle-padrinos-eyebrow">
                    UNA RED QUE ACOMPAÑA
                  </span>

                  <h3>
                    Padrinos y madrinas de{" "}
                    {perro.nombre}
                  </h3>

                  <p>
                    Personas que eligieron
                    acompañarlo mientras espera
                    su hogar.
                  </p>
                </div>

              </div>

              {padrinos.length > 0 ? (
                <div className="detalle-padrinos-lista">

                  {padrinos.map(
                    (padrino) => (
                      <div
                        className="detalle-padrino"
                        key={padrino.id}
                      >

                        <span className="detalle-padrino-huella">
                          🐾
                        </span>

                        <strong>
                          {padrino.anonimo
                            ? "Padrino/a anónimo/a"
                            : padrino.nombre}
                        </strong>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="detalle-padrinos-vacio">

                  <span>
                    🐾
                  </span>

                  <div>
                    <strong>
                      {perro.nombre} todavía
                      está esperando su primer
                      padrino o madrina.
                    </strong>

                    <p>
                      Podés ser la primera persona
                      en acompañarlo.
                    </p>
                  </div>

                </div>
              )}

              <Link
                to={`/apadrinar?peludito=${perro.id}`}
                className="detalle-padrinos-cta"
              >
                ❤️ Quiero apadrinar a{" "}
                {perro.nombre}
              </Link>

            </div>
          )}

          {/* =================================================
              ACCIONES
              ================================================= */}

          <div className="detalle-acciones">

            {perro.publicado &&
              perro.estado ===
                "En adopción" && (

                <Link
                  to={`/adoptar/${perro.id}`}
                  className="btn btn-primary detalle-btn"
                >
                  ❤️ Quiero adoptar a{" "}
                  {perro.nombre}
                </Link>

              )}

            {perro.apadrinable && (

              <Link
                to={`/apadrinar?peludito=${perro.id}`}
                className="btn btn-secondary detalle-btn"
              >
                🐾 Quiero acompañar a{" "}
                {perro.nombre}
              </Link>

            )}

          </div>

          {perro.publicado &&
            perro.estado ===
              "En adopción" && (

              <p className="detalle-aclaracion">
                Enviar una solicitud no
                implica una adopción
                automática. La Protectora
                se pondrá en contacto para
                continuar el proceso.
              </p>

            )}

        </div>

      </div>

    </section>
  );
};

export default PeluditoDetalle;