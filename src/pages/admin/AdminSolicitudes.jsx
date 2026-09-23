import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabase.js";

const AdminSolicitudes = () => {
  const [solicitudes, setSolicitudes] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [seleccionada, setSeleccionada] =
    useState(null);

  /* =========================================
     CARGAR SOLICITUDES
     ========================================= */

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      setError("");

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("solicitudes_adopcion")
        .select(`
          *,
          peluditos (
            id,
            nombre,
            sexo,
            edad,
            tamano
          )
        `)
        .order("created_at", {
          ascending: false,
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setSolicitudes(data ?? []);
    } catch (error) {
      console.error(
        "Error cargando solicitudes:",
        error
      );

      setError(
        "No pudimos cargar las solicitudes."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  /* =========================================
     CAMBIAR ESTADO
     ========================================= */

  const cambiarEstado = async (
    solicitud,
    nuevoEstado
  ) => {
    try {
      const {
        error: supabaseError,
      } = await supabase
        .from("solicitudes_adopcion")
        .update({
          estado: nuevoEstado,
        })
        .eq(
          "id",
          solicitud.id
        );

      if (supabaseError) {
        throw supabaseError;
      }

      setSolicitudes(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id === solicitud.id
                ? {
                    ...item,
                    estado: nuevoEstado,
                  }
                : item
          )
      );

      setSeleccionada(
        (actual) =>
          actual?.id === solicitud.id
            ? {
                ...actual,
                estado: nuevoEstado,
              }
            : actual
      );
    } catch (error) {
      console.error(
        "Error cambiando estado:",
        error
      );

      window.alert(
        "No pudimos actualizar el estado."
      );
    }
  };

  /* =========================================
     FORMATEAR FECHA
     ========================================= */

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

  /* =========================================
     CLASE DEL ESTADO
     ========================================= */

  const obtenerClaseEstado = (
    estado
  ) => {
    return (
      estado ||
      "Pendiente"
    )
      .toLowerCase()
      .replaceAll(" ", "-")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );
  };

  /* =========================================
     CARGANDO
     ========================================= */

  if (cargando) {
    return (
      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <span className="admin-eyebrow">
              ADOPCIONES
            </span>

            <h1>
              Solicitudes
            </h1>

            <p>
              Cargando solicitudes...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================
     ERROR
     ========================================= */

  if (error) {
    return (
      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <span className="admin-eyebrow">
              ADOPCIONES
            </span>

            <h1>
              Solicitudes
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
            cargarSolicitudes
          }
        >
          Intentar nuevamente
        </button>
      </section>
    );
  }

  return (
    <section className="admin-page">

      {/* =====================================
          HEADER
          ===================================== */}

      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            ADOPCIONES
          </span>

          <h1>
            Solicitudes
          </h1>

          <p>
            Revisá las personas interesadas
            en adoptar a los peluditos de
            la Protectora.
          </p>
        </div>
      </div>

      {/* =====================================
          VACÍO
          ===================================== */}

      {solicitudes.length === 0 && (
        <div className="admin-empty-state">
          <span>
            📩
          </span>

          <h2>
            No hay solicitudes
          </h2>

          <p>
            Cuando alguien complete el
            formulario de adopción,
            aparecerá acá.
          </p>
        </div>
      )}

      {/* =====================================
          LISTADO
          ===================================== */}

      {solicitudes.length > 0 && (
        <div className="admin-solicitudes-list">

          {solicitudes.map(
            (solicitud) => (
              <article
                className="admin-solicitud-card"
                key={solicitud.id}
              >

                {/* CABECERA */}

                <div className="admin-solicitud-top">

                  <div className="admin-solicitud-persona">

                    <span className="admin-solicitud-avatar">
                      {solicitud.nombre
                        ?.charAt(0)
                        .toUpperCase() ||
                        "?"}
                    </span>

                    <div className="admin-solicitud-identidad">

                      <strong>
                        {solicitud.nombre}{" "}
                        {solicitud.apellido}
                      </strong>

                      <p>
                        Solicitud para{" "}
                        <b>
                          {solicitud
                            .peluditos
                            ?.nombre ||
                            "peludito"}
                        </b>
                      </p>

                    </div>

                  </div>

                  <span
                    className={`admin-status admin-status-${obtenerClaseEstado(
                      solicitud.estado
                    )}`}
                  >
                    {solicitud.estado ||
                      "Pendiente"}
                  </span>

                </div>

                {/* DATOS */}

                <div className="admin-solicitud-bottom">

                  <div className="admin-solicitud-dato">
                    <small>
                      TELÉFONO
                    </small>

                    <strong>
                      {solicitud.telefono ||
                        "—"}
                    </strong>
                  </div>

                  <div className="admin-solicitud-dato">
                    <small>
                      LOCALIDAD
                    </small>

                    <strong>
                      {solicitud.localidad ||
                        "—"}
                    </strong>
                  </div>

                  <div className="admin-solicitud-dato">
                    <small>
                      FECHA
                    </small>

                    <strong>
                      {formatearFecha(
                        solicitud.created_at
                      )}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="admin-solicitud-ver"
                    onClick={() =>
                      setSeleccionada(
                        solicitud
                      )
                    }
                  >
                    Ver solicitud

                    <span>
                      →
                    </span>
                  </button>

                </div>

              </article>
            )
          )}

        </div>
      )}

      {/* =====================================
          DETALLE
          ===================================== */}

      {seleccionada && (
        <div className="admin-request-overlay">

          <div className="admin-request-modal">

            <button
              type="button"
              className="admin-request-close"
              onClick={() =>
                setSeleccionada(null)
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className="admin-eyebrow">
              SOLICITUD DE ADOPCIÓN
            </span>

            <h2>
              {seleccionada.nombre}{" "}
              {seleccionada.apellido}
            </h2>

            <p className="admin-request-for">
              Quiere adoptar a{" "}
              <strong>
                {seleccionada
                  .peluditos
                  ?.nombre ||
                  "este peludito"}
              </strong>
            </p>

            {/* CONTACTO */}

            <div className="admin-request-section">

              <h3>
                Datos de contacto
              </h3>

              <div className="admin-request-grid">

                <div>
                  <small>
                    TELÉFONO
                  </small>

                  <strong>
                    {seleccionada.telefono ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    EMAIL
                  </small>

                  <strong>
                    {seleccionada.email ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    LOCALIDAD
                  </small>

                  <strong>
                    {seleccionada.localidad ||
                      "—"}
                  </strong>
                </div>

              </div>

            </div>

            {/* HOGAR */}

            <div className="admin-request-section">

              <h3>
                Hogar
              </h3>

              <div className="admin-request-grid">

                <div>
                  <small>
                    VIVIENDA
                  </small>

                  <strong>
                    {seleccionada.vivienda ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    ¿PROPIA?
                  </small>

                  <strong>
                    {seleccionada.vivienda_propia ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    PATIO
                  </small>

                  <strong>
                    {seleccionada.patio ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    PATIO CERRADO
                  </small>

                  <strong>
                    {seleccionada.patio_cerrado ||
                      "No especificado"}
                  </strong>
                </div>

                <div>
                  <small>
                    PERSONAS
                  </small>

                  <strong>
                    {seleccionada.personas_hogar ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>
                    NIÑOS
                  </small>

                  <strong>
                    {seleccionada.ninos ||
                      "—"}
                  </strong>
                </div>

              </div>

            </div>

            {/* OTROS ANIMALES */}

            <div className="admin-request-section">

              <h3>
                Otros animales
              </h3>

              <p>
                <strong>
                  {seleccionada.otros_animales ||
                    "No especificado"}
                </strong>
              </p>

              {seleccionada.detalle_animales && (
                <p>
                  {
                    seleccionada.detalle_animales
                  }
                </p>
              )}

              {seleccionada.horas_solo && (
                <p>
                  <strong>
                    Horas que estaría solo:
                  </strong>{" "}
                  {seleccionada.horas_solo}
                </p>
              )}

            </div>

            {/* EXPERIENCIA */}

            <div className="admin-request-section">

              <h3>
                Experiencia
              </h3>

              <p>
                {seleccionada.experiencia ||
                  "No indicó experiencia previa."}
              </p>

            </div>

            {/* MOTIVO */}

            <div className="admin-request-section">

              <h3>
                ¿Por qué quiere adoptar?
              </h3>

              <p>
                {seleccionada.motivo ||
                  "No especificado."}
              </p>

            </div>

            {/* ESTADO */}

            <div className="admin-request-section">

              <h3>
                Estado de la solicitud
              </h3>

              <select
                className="admin-request-status-select"
                value={
                  seleccionada.estado ||
                  "Pendiente"
                }
                onChange={(e) =>
                  cambiarEstado(
                    seleccionada,
                    e.target.value
                  )
                }
              >

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="En evaluación">
                  En evaluación
                </option>

                <option value="Aprobada">
                  Aprobada
                </option>

                <option value="Rechazada">
                  Rechazada
                </option>

              </select>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default AdminSolicitudes;