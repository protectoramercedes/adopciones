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

import CargaRapidaPeludito
  from "../../components/CargaRapidaPeludito.jsx";

const AdminDashboard = () => {
  const [peluditos, setPeluditos] =
    useState([]);

  const [
    solicitudesPendientes,
    setSolicitudesPendientes,
  ] = useState(0);

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

        const [
          resultadoPeluditos,
          resultadoSolicitudes,
        ] = await Promise.all([
          supabase
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
            }),

          supabase
            .from("solicitudes_adopcion")
            .select(
              "id",
              {
                count: "exact",
                head: true,
              }
            )
            .eq(
              "estado",
              "Pendiente"
            ),
        ]);

        if (
          resultadoPeluditos.error
        ) {
          throw (
            resultadoPeluditos.error
          );
        }

        if (
          resultadoSolicitudes.error
        ) {
          throw (
            resultadoSolicitudes.error
          );
        }

        if (!activo) {
          return;
        }

        setPeluditos(
          resultadoPeluditos.data ??
            []
        );

        setSolicitudesPendientes(
          resultadoSolicitudes.count ??
            0
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

      {/* =================================================
          HEADER
          ================================================= */}

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
            los peluditos y las solicitudes
            de adopción de la Protectora.
          </p>

        </div>

        <Link
          to="/admin/peluditos/nuevo"
          className="admin-primary-button"
        >
          + Agregar peludito
        </Link>

      </div>

      {/* =================================================
          CARGANDO
          ================================================= */}

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

      {/* =================================================
          ERROR
          ================================================= */}

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

      {/* =================================================
          DASHBOARD
          ================================================= */}

      {!cargando &&
        !error && (
          <>

            {/* =============================================
                CARGA EXPRESS
                ============================================= */}

            <div className="admin-quick-upload">

              <div className="admin-quick-upload-content">

                <span className="admin-quick-eyebrow">
                  CARGA EXPRESS
                </span>

                <h2>
                  Cargá un peludito
                  en segundos
                </h2>

                <p>
                  Sacale una foto, completá
                  sus datos básicos y listo.
                  Después podés completar
                  toda su ficha con tranquilidad.
                </p>

              </div>

              <div className="admin-quick-camera">

                <CargaRapidaPeludito
                  className="admin-camera-button-dashboard"
                />

                <span className="admin-quick-camera-help">
                  Tocá para abrir la cámara
                </span>

              </div>

            </div>

            {/* =============================================
                ESTADÍSTICAS
                ============================================= */}

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

              <Link
                to="/admin/solicitudes"
                className="admin-stat admin-stat-link"
              >

                <span>
                  📩
                </span>

                <div>

                  <strong>
                    {
                      solicitudesPendientes
                    }
                  </strong>

                  <p>
                    {solicitudesPendientes ===
                    1
                      ? "Solicitud pendiente"
                      : "Solicitudes pendientes"}
                  </p>

                </div>

                {solicitudesPendientes >
                  0 && (
                  <span className="admin-stat-arrow">
                    →
                  </span>
                )}

              </Link>

            </div>

            {/* =============================================
                AVISO DE SOLICITUDES
                ============================================= */}

            {solicitudesPendientes >
              0 && (

              <Link
                to="/admin/solicitudes"
                className="admin-pending-notice"
              >

                <div className="admin-pending-notice-icon">
                  📩
                </div>

                <div>

                  <strong>
                    {solicitudesPendientes ===
                    1
                      ? "Hay una nueva solicitud de adopción"
                      : `Hay ${solicitudesPendientes} solicitudes de adopción pendientes`}
                  </strong>

                  <p>
                    Revisá los datos de las
                    personas interesadas.
                  </p>

                </div>

                <span>
                  Ver solicitudes →
                </span>

              </Link>

            )}

            {/* =============================================
                PELUDITOS RECIENTES
                ============================================= */}

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

                <Link
                  to="/admin/peluditos"
                >
                  Ver todos →
                </Link>

              </div>

              {recientes.length >
              0 ? (

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
                              {
                                peludito.nombre
                              }
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
                    No hay peluditos
                    cargados
                  </h2>

                  <p>
                    Cuando agregues el
                    primero, aparecerá acá.
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