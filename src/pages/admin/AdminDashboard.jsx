import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  supabase,
} from "../../lib/supabase.js";

const AdminDashboard = () => {
  const [peluditos, setPeluditos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     CARGAR DATOS REALES
     ===================================================== */

  useEffect(() => {
    let activo = true;

    const cargarDashboard = async () => {
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
          .order("created_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        if (!activo) {
          return;
        }

        setPeluditos(
          data ?? []
        );
      } catch (error) {
        console.error(
          "Error cargando dashboard:",
          error
        );

        if (activo) {
          setError(
            "No pudimos cargar el resumen."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDashboard();

    return () => {
      activo = false;
    };
  }, []);

  /* =====================================================
     ESTADÍSTICAS
     ===================================================== */

  const enAdopcion =
    peluditos.filter(
      (peludito) =>
        peludito.estado ===
        "En adopción"
    ).length;

  const adoptados =
    peluditos.filter(
      (peludito) =>
        peludito.estado ===
        "Adoptado"
    ).length;

  const recientes =
    peluditos.slice(0, 4);

  /* =====================================================
     FOTO PRINCIPAL
     ===================================================== */

  const obtenerFotoPrincipal = (
    peludito
  ) => {
    const fotos =
      peludito.peludito_fotos ??
      [];

    if (fotos.length === 0) {
      return null;
    }

    const principal =
      fotos.find(
        (foto) =>
          foto.principal === true
      );

    if (principal?.url) {
      return principal.url;
    }

    const ordenadas = [
      ...fotos,
    ].sort(
      (a, b) =>
        (a.orden ?? 999) -
        (b.orden ?? 999)
    );

    return (
      ordenadas[0]?.url ??
      null
    );
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <section className="admin-page">

      <div className="admin-page-header">

        <div>
          <span className="admin-eyebrow">
            PANEL DE ADMINISTRACIÓN
          </span>

          <h1>
            Hola 👋
          </h1>

          <p>
            Desde acá podés gestionar
            los peluditos de la Protectora.
          </p>
        </div>

        <Link
          to="/admin/peluditos/nuevo"
          className="admin-primary-button"
        >
          + Agregar peludito
        </Link>

      </div>

      {/* ===============================================
          CARGANDO
          =============================================== */}

      {cargando && (
        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            🐾
          </div>

          <h2>
            Cargando resumen...
          </h2>

        </div>
      )}

      {/* ===============================================
          ERROR
          =============================================== */}

      {!cargando &&
        error && (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ⚠️
            </div>

            <h2>
              No pudimos cargar
              el resumen
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Intentar nuevamente
            </button>

          </div>
        )}

      {/* ===============================================
          DASHBOARD REAL
          =============================================== */}

      {!cargando &&
        !error && (
          <>

            {/* =========================================
                ESTADÍSTICAS
                ========================================= */}

            <div className="admin-stats">

              <div className="admin-stat">

                <span>
                  🐾
                </span>

                <div>
                  <strong>
                    {peluditos.length}
                  </strong>

                  <p>
                    Peluditos registrados
                  </p>
                </div>

              </div>

              <div className="admin-stat">

                <span>
                  🏠
                </span>

                <div>
                  <strong>
                    {enAdopcion}
                  </strong>

                  <p>
                    En adopción
                  </p>
                </div>

              </div>

              <div className="admin-stat">

                <span>
                  ❤️
                </span>

                <div>
                  <strong>
                    {adoptados}
                  </strong>

                  <p>
                    Finales felices
                  </p>
                </div>

              </div>

              <div className="admin-stat">

                <span>
                  📩
                </span>

                <div>
                  <strong>
                    0
                  </strong>

                  <p>
                    Solicitudes pendientes
                  </p>
                </div>

              </div>

            </div>

            {/* =========================================
                RECIENTES
                ========================================= */}

            <div className="admin-dashboard-section">

              <div className="admin-section-heading">

                <div>
                  <h2>
                    Peluditos recientes
                  </h2>

                  <p>
                    Últimos animales registrados
                    en la plataforma.
                  </p>
                </div>

                <Link to="/admin/peluditos">
                  Ver todos →
                </Link>

              </div>

              {recientes.length > 0 ? (

                <div className="admin-recent-list">

                  {recientes.map(
                    (peludito) => {
                      const foto =
                        obtenerFotoPrincipal(
                          peludito
                        );

                      return (
                        <div
                          className="admin-recent-item"
                          key={
                            peludito.id
                          }
                        >

                          {foto ? (
                            <img
                              src={foto}
                              alt={
                                peludito.nombre
                              }
                              loading="lazy"
                            />
                          ) : (
                            <div className="admin-dog-placeholder">
                              🐾
                            </div>
                          )}

                          <div className="admin-recent-info">

                            <strong>
                              {peludito.nombre}
                            </strong>

                            <span>
                              {peludito.codigo ||
                                "SIN CÓDIGO"}
                            </span>

                          </div>

                          <span className="admin-status">
                            {peludito.estado ||
                              "Sin estado"}
                          </span>

                          <Link
                            to={`/admin/peluditos/${peludito.id}/editar`}
                          >
                            Editar
                          </Link>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <div className="admin-empty-state">

                  <div className="admin-empty-icon">
                    🐾
                  </div>

                  <h2>
                    No hay peluditos cargados
                  </h2>

                  <p>
                    Cuando agregues el primero,
                    aparecerá acá.
                  </p>

                </div>

              )}

            </div>

          </>
        )}

    </section>
  );
};

export default AdminDashboard;