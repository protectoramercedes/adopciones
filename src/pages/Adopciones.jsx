import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PeluditoCard
  from "../components/PeluditoCard.jsx";

import {
  supabase,
} from "../lib/supabase.js";

const Adopciones = () => {
  const [peluditos, setPeluditos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [sexo, setSexo] =
    useState("");

  const [tamano, setTamano] =
    useState("");

  const [energia, setEnergia] =
    useState("");

  /* =======================================================
     CARGAR PELUDITOS PUBLICADOS DESDE SUPABASE
     ======================================================= */

  useEffect(() => {
    let activo = true;

    const cargarPeluditos = async () => {
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
          .eq("publicado", true)
          .eq("estado", "En adopción")
          .order("created_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        if (!activo) {
          return;
        }

        /*
         * Adaptamos los datos de Supabase
         * al formato que espera PeluditoCard.
         *
         * Así no tenemos que cambiar todavía
         * el diseño de las cards.
         */

        const adaptados =
          (data ?? []).map(
            (peludito) => {
              const fotos =
                peludito.peludito_fotos ??
                [];

              const fotoPrincipal =
                fotos.find(
                  (foto) =>
                    foto.principal ===
                    true
                );

              const fotosOrdenadas = [
                ...fotos,
              ].sort(
                (a, b) =>
                  (a.orden ?? 999) -
                  (b.orden ?? 999)
              );

              const imagen =
                fotoPrincipal?.url ||
                fotosOrdenadas[0]?.url ||
                null;

              return {
                ...peludito,

                /*
                 * Compatibilidad con
                 * PeluditoCard actual.
                 */
                imagen,

                /*
                 * Dejamos también todas
                 * las fotos disponibles.
                 */
                fotos:
                  fotosOrdenadas,
              };
            }
          );

        setPeluditos(
          adaptados
        );
      } catch (error) {
        console.error(
          "Error cargando adopciones:",
          error
        );

        if (!activo) {
          return;
        }

        setError(
          "No pudimos cargar los peluditos en este momento."
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPeluditos();

    return () => {
      activo = false;
    };
  }, []);

  /* =======================================================
     FILTROS
     ======================================================= */

  const perrosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      return peluditos.filter(
        (perro) => {
          const coincideBusqueda =
            !texto ||
            perro.nombre
              ?.toLowerCase()
              .includes(texto);

          const coincideSexo =
            !sexo ||
            perro.sexo === sexo;

          const coincideTamano =
            !tamano ||
            perro.tamano ===
              tamano;

          const coincideEnergia =
            !energia ||
            perro.energia ===
              energia;

          return (
            coincideBusqueda &&
            coincideSexo &&
            coincideTamano &&
            coincideEnergia
          );
        }
      );
    }, [
      peluditos,
      busqueda,
      sexo,
      tamano,
      energia,
    ]);

  /* =======================================================
     LIMPIAR FILTROS
     ======================================================= */

  const limpiarFiltros = () => {
    setBusqueda("");
    setSexo("");
    setTamano("");
    setEnergia("");
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="adopciones-page">

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="adopciones-hero">

        <span className="adopciones-eyebrow">
          🐾 ENCONTRÁ A TU COMPAÑERO
        </span>

        <h1>
          Peluditos buscando
          <span>
            {" "}una familia.
          </span>
        </h1>

        <p>
          Cada uno tiene una historia
          diferente, una personalidad única
          y muchísimo amor esperando para dar.
        </p>

      </section>

      {/* ===================================================
          CATÁLOGO
          =================================================== */}

      <section className="catalogo">

        {/* =================================================
            FILTROS
            ================================================= */}

        <div className="filtros-box">

          <div className="buscador">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
            />

          </div>

          <select
            value={sexo}
            onChange={(e) =>
              setSexo(
                e.target.value
              )
            }
          >
            <option value="">
              Todos
            </option>

            <option value="Hembra">
              Hembras
            </option>

            <option value="Macho">
              Machos
            </option>
          </select>

          <select
            value={tamano}
            onChange={(e) =>
              setTamano(
                e.target.value
              )
            }
          >
            <option value="">
              Todos los tamaños
            </option>

            <option value="Pequeño">
              Pequeño
            </option>

            <option value="Mediano">
              Mediano
            </option>

            <option value="Grande">
              Grande
            </option>
          </select>

          <select
            value={energia}
            onChange={(e) =>
              setEnergia(
                e.target.value
              )
            }
          >
            <option value="">
              Todas las personalidades
            </option>

            <option value="Tranquila">
              Tranquilo/a
            </option>

            <option value="Moderada">
              Moderado/a
            </option>

            <option value="Activo">
              Activo/a
            </option>
          </select>

          <button
            className="limpiar-filtros"
            onClick={
              limpiarFiltros
            }
            type="button"
          >
            Limpiar
          </button>

        </div>

        {/* =================================================
            CARGANDO
            ================================================= */}

        {cargando && (
          <div className="sin-resultados">

            <span>
              🐾
            </span>

            <h2>
              Cargando peluditos...
            </h2>

            <p>
              Estamos buscando a quienes
              esperan una familia.
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
            ================================================= */}

        {!cargando &&
          error && (
            <div className="sin-resultados">

              <span>
                🐾
              </span>

              <h2>
                No pudimos cargar
                los peluditos
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Intentar nuevamente
              </button>

            </div>
          )}

        {/* =================================================
            RESULTADOS
            ================================================= */}

        {!cargando &&
          !error && (
            <>

              <div className="catalogo-info">

                <p>
                  Mostrando{" "}

                  <strong>
                    {
                      perrosFiltrados.length
                    }
                  </strong>{" "}

                  {perrosFiltrados.length ===
                  1
                    ? "peludito"
                    : "peluditos"}
                </p>

              </div>

              {perrosFiltrados.length >
              0 ? (

                <div className="peluditos-grid">

                  {perrosFiltrados.map(
                    (perro) => (
                      <PeluditoCard
                        key={
                          perro.id
                        }
                        perro={
                          perro
                        }
                      />
                    )
                  )}

                </div>

              ) : (

                <div className="sin-resultados">

                  <span>
                    🐾
                  </span>

                  <h2>
                    No encontramos
                    peluditos
                  </h2>

                  <p>
                    {peluditos.length ===
                    0
                      ? "Por ahora no hay peluditos publicados para adopción."
                      : "Probá cambiando alguno de los filtros."}
                  </p>

                  {peluditos.length >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        limpiarFiltros
                      }
                    >
                      Ver todos
                    </button>
                  )}

                </div>

              )}

            </>
          )}

      </section>

    </main>
  );
};

export default Adopciones;