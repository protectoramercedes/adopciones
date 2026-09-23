import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabase.js";

const AdminPadrinos = () => {
  const [padrinazgos, setPadrinazgos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [seleccionado, setSeleccionado] =
    useState(null);

  /* =====================================================
     CARGAR PADRINAZGOS
     ===================================================== */

  const cargarPadrinazgos = async () => {
    try {
      setCargando(true);
      setError("");

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("padrinazgos")
        .select(`
          *,
          peluditos (
            id,
            nombre
          )
        `)
        .order("created_at", {
          ascending: false,
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setPadrinazgos(
        data ?? []
      );
    } catch (error) {
      console.error(
        "Error cargando padrinazgos:",
        error
      );

      setError(
        "No pudimos cargar los padrinos y madrinas."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPadrinazgos();
  }, []);

  /* =====================================================
     CAMBIAR ESTADO
     ===================================================== */

  const cambiarEstado = async (
    padrinazgo,
    nuevoEstado
  ) => {
    try {
      const {
        error: supabaseError,
      } = await supabase
        .from("padrinazgos")
        .update({
          estado: nuevoEstado,
        })
        .eq(
          "id",
          padrinazgo.id
        );

      if (supabaseError) {
        throw supabaseError;
      }

      setPadrinazgos(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id ===
              padrinazgo.id
                ? {
                    ...item,
                    estado:
                      nuevoEstado,
                  }
                : item
          )
      );

      setSeleccionado(
        (actual) =>
          actual?.id ===
          padrinazgo.id
            ? {
                ...actual,
                estado:
                  nuevoEstado,
              }
            : actual
      );
    } catch (error) {
      console.error(
        "Error actualizando padrinazgo:",
        error
      );

      window.alert(
        "No pudimos actualizar el estado."
      );
    }
  };

  /* =====================================================
     FECHA
     ===================================================== */

  const formatearFecha = (
    fecha
  ) => {
    if (!fecha) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      "es-UY",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(fecha)
    );
  };

  /* =====================================================
     TELÉFONO PARA WHATSAPP
     ===================================================== */

  const prepararTelefono = (
    telefono
  ) => {
    if (!telefono) {
      return "";
    }

    let limpio =
      telefono.replace(
        /\D/g,
        ""
      );

    /*
      Si ingresaron un celular uruguayo
      como 099123456, quitamos el 0
      y agregamos 598.
    */

    if (
      limpio.length === 9 &&
      limpio.startsWith("0")
    ) {
      limpio =
        `598${limpio.slice(1)}`;
    }

    return limpio;
  };

  /* =====================================================
     CLASE ESTADO
     ===================================================== */

  const obtenerClaseEstado = (
    estado
  ) => {
    return (
      estado ||
      "pendiente"
    )
      .toLowerCase()
      .replaceAll(" ", "-")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );
  };

  /* =====================================================
     CONTADORES
     ===================================================== */

  const pendientes =
    padrinazgos.filter(
      (item) =>
        item.estado ===
        "pendiente"
    ).length;

  const activos =
    padrinazgos.filter(
      (item) =>
        item.estado ===
        "activo"
    ).length;

  const finalizados =
    padrinazgos.filter(
      (item) =>
        item.estado ===
        "finalizado"
    ).length;

  /* =====================================================
     CARGANDO
     ===================================================== */

  if (cargando) {
    return (
      <section className="admin-page">

        <div className="admin-page-header">

          <div>

            <span className="admin-eyebrow">
              PADRINOS Y MADRINAS
            </span>

            <h1>
              Padrinazgos
            </h1>

            <p>
              Cargando padrinazgos...
            </p>

          </div>

        </div>

      </section>
    );
  }

  /* =====================================================
     ERROR
     ===================================================== */

  if (error) {
    return (
      <section className="admin-page">

        <div className="admin-page-header">

          <div>

            <span className="admin-eyebrow">
              PADRINOS Y MADRINAS
            </span>

            <h1>
              Padrinazgos
            </h1>

            <p>
              {error}
            </p>

          </div>

        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            cargarPadrinazgos
          }
        >
          Intentar nuevamente
        </button>

      </section>
    );
  }

  return (
    <section className="admin-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="admin-page-header">

        <div>

          <span className="admin-eyebrow">
            PADRINOS Y MADRINAS
          </span>

          <h1>
            Padrinazgos
          </h1>

          <p>
            Gestioná las personas que
            acompañan a los peluditos de
            la Protectora.
          </p>

        </div>

      </div>

      {/* =================================================
          RESUMEN
          ================================================= */}

      <div className="admin-padrinos-stats">

        <div className="admin-padrinos-stat">

          <span>
            ❤️
          </span>

          <div>
            <strong>
              {padrinazgos.length}
            </strong>

            <p>
              Total
            </p>
          </div>

        </div>

        <div className="admin-padrinos-stat">

          <span>
            ⏳
          </span>

          <div>
            <strong>
              {pendientes}
            </strong>

            <p>
              Pendientes
            </p>
          </div>

        </div>

        <div className="admin-padrinos-stat">

          <span>
            🐾
          </span>

          <div>
            <strong>
              {activos}
            </strong>

            <p>
              Activos
            </p>
          </div>

        </div>

        <div className="admin-padrinos-stat">

          <span>
            ✓
          </span>

          <div>
            <strong>
              {finalizados}
            </strong>

            <p>
              Finalizados
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          SIN PADRINAZGOS
          ================================================= */}

      {padrinazgos.length === 0 && (

        <div className="admin-empty-state">

          <span>
            ❤️
          </span>

          <h2>
            Todavía no hay padrinazgos
          </h2>

          <p>
            Cuando alguien elija acompañar
            a un peludito, aparecerá acá.
          </p>

        </div>

      )}

      {/* =================================================
          LISTADO
          ================================================= */}

      {padrinazgos.length > 0 && (

        <div className="admin-padrinos-list">

          {padrinazgos.map(
            (padrinazgo) => {

              const nombrePeludito =
                padrinazgo
                  .peluditos
                  ?.nombre ||
                "Peludito";

              return (
                <article
                  className="admin-padrino-card"
                  key={
                    padrinazgo.id
                  }
                >

                  {/* CABECERA */}

                  <div className="admin-padrino-top">

                    <div className="admin-padrino-persona">

                      <span className="admin-padrino-avatar">
                        {padrinazgo.anonimo
                          ? "❤️"
                          : padrinazgo.nombre
                              ?.charAt(0)
                              .toUpperCase() ||
                            "?"}
                      </span>

                      <div>

                        <strong>
                          {padrinazgo.nombre}
                        </strong>

                        <p>
                          Padrino/madrina de{" "}
                          <b>
                            {nombrePeludito}
                          </b>
                        </p>

                        {padrinazgo.anonimo && (
                          <small>
                            🔒 Aparece públicamente
                            como anónimo/a
                          </small>
                        )}

                      </div>

                    </div>

                    <span
                      className={`admin-padrino-status admin-padrino-status-${obtenerClaseEstado(
                        padrinazgo.estado
                      )}`}
                    >
                      {padrinazgo.estado ||
                        "pendiente"}
                    </span>

                  </div>

                  {/* DATOS */}

                  <div className="admin-padrino-bottom">

                    <div className="admin-padrino-dato">

                      <small>
                        PELUDITO
                      </small>

                      <strong>
                        {nombrePeludito}
                      </strong>

                    </div>

                    <div className="admin-padrino-dato">

                      <small>
                        APORTE
                      </small>

                      <strong>
                        $
                        {padrinazgo.monto}
                      </strong>

                    </div>

                    <div className="admin-padrino-dato">

                      <small>
                        TELÉFONO
                      </small>

                      <strong>
                        {padrinazgo.telefono ||
                          "—"}
                      </strong>

                    </div>

                    <div className="admin-padrino-dato">

                      <small>
                        FECHA
                      </small>

                      <strong>
                        {formatearFecha(
                          padrinazgo.created_at
                        )}
                      </strong>

                    </div>

                    <button
                      type="button"
                      className="admin-padrino-ver"
                      onClick={() =>
                        setSeleccionado(
                          padrinazgo
                        )
                      }
                    >
                      Ver detalle
                      <span>
                        →
                      </span>
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

      {/* =================================================
          MODAL
          ================================================= */}

      {seleccionado && (

        <div className="admin-padrino-overlay">

          <div className="admin-padrino-modal">

            <button
              type="button"
              className="admin-padrino-close"
              onClick={() =>
                setSeleccionado(
                  null
                )
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className="admin-eyebrow">
              PADRINAZGO
            </span>

            <h2>
              {seleccionado.nombre}
            </h2>

            <p className="admin-padrino-subtitle">
              Acompaña a{" "}
              <strong>
                {seleccionado
                  .peluditos
                  ?.nombre ||
                  "este peludito"}
              </strong>
            </p>

            {/* DATOS */}

            <div className="admin-padrino-section">

              <h3>
                Datos del padrino/madrina
              </h3>

              <div className="admin-padrino-detail-grid">

                <div>

                  <small>
                    NOMBRE
                  </small>

                  <strong>
                    {seleccionado.nombre}
                  </strong>

                </div>

                <div>

                  <small>
                    TELÉFONO
                  </small>

                  <strong>
                    {seleccionado.telefono ||
                      "—"}
                  </strong>

                </div>

                <div>

                  <small>
                    VISIBILIDAD
                  </small>

                  <strong>
                    {seleccionado.anonimo
                      ? "Anónimo/a"
                      : "Mostrar nombre"}
                  </strong>

                </div>

              </div>

            </div>

            {/* PADRINAZGO */}

            <div className="admin-padrino-section">

              <h3>
                Padrinazgo
              </h3>

              <div className="admin-padrino-detail-grid">

                <div>

                  <small>
                    PELUDITO
                  </small>

                  <strong>
                    {seleccionado
                      .peluditos
                      ?.nombre ||
                      "—"}
                  </strong>

                </div>

                <div>

                  <small>
                    APORTE
                  </small>

                  <strong>
                    $
                    {seleccionado.monto}
                  </strong>

                </div>

                <div>

                  <small>
                    FECHA
                  </small>

                  <strong>
                    {formatearFecha(
                      seleccionado.created_at
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* CONTACTO */}

            {seleccionado.telefono && (

              <div className="admin-padrino-section">

                <h3>
                  Contacto
                </h3>

                <p className="admin-padrino-private">
                  🔒 Este teléfono es privado
                  y solo es visible para la
                  Protectora.
                </p>

                <a
                  href={`https://wa.me/${prepararTelefono(
                    seleccionado.telefono
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-padrino-whatsapp"
                >
                  💬 Contactar por WhatsApp
                </a>

              </div>

            )}

            {/* ESTADO */}

            <div className="admin-padrino-section">

              <h3>
                Estado del padrinazgo
              </h3>

              <p className="admin-padrino-help">
                Marcá como activo cuando la
                Protectora haya confirmado
                el aporte.
              </p>

              <select
                className="admin-padrino-select"
                value={
                  seleccionado.estado ||
                  "pendiente"
                }
                onChange={(e) =>
                  cambiarEstado(
                    seleccionado,
                    e.target.value
                  )
                }
              >

                <option value="pendiente">
                  Pendiente
                </option>

                <option value="activo">
                  Activo
                </option>

                <option value="finalizado">
                  Finalizado
                </option>

              </select>

            </div>

          </div>

        </div>

      )}

    </section>
  );
};

export default AdminPadrinos;