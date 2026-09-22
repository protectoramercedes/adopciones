import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  supabase,
} from "../../lib/supabase.js";

import CargaRapidaPeludito
  from "../../components/CargaRapidaPeludito.jsx";

const AdminPeluditos = () => {
  const [peluditos, setPeluditos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [estado, setEstado] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     CARGAR PELUDITOS
     ======================================================= */

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
        .order("created_at", {
          ascending: false,
        });

      if (supabaseError) {
        throw supabaseError;
      }

      setPeluditos(
        data ?? []
      );
    } catch (error) {
      console.error(
        "Error cargando peluditos:",
        error
      );

      setError(
        "No pudimos cargar los peluditos."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPeluditos();
  }, []);

  /* =======================================================
     FILTROS
     ======================================================= */

  const resultados =
    useMemo(() => {
      return peluditos.filter(
        (peludito) => {
          const texto =
            busqueda
              .trim()
              .toLowerCase();

          const coincideBusqueda =
            !texto ||
            peludito.nombre
              ?.toLowerCase()
              .includes(texto) ||
            peludito.codigo
              ?.toLowerCase()
              .includes(texto);

          const coincideEstado =
            !estado ||
            peludito.estado ===
              estado;

          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );
    }, [
      peluditos,
      busqueda,
      estado,
    ]);

  /* =======================================================
     OBTENER FOTO PRINCIPAL
     ======================================================= */

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

  /* =======================================================
     ELIMINAR PELUDITO
     ======================================================= */

  const eliminarPeludito = async (
    peludito
  ) => {
    const resultado =
      await Swal.fire({
        icon: "warning",

        title:
          `¿Eliminar a ${peludito.nombre}?`,

        html: `
          <p>
            Vas a eliminar la ficha de
            <strong>${peludito.nombre}</strong>.
          </p>

          <p
            style="
              margin-top: 10px;
              color: #777;
            "
          >
            Esta acción no se puede deshacer.
          </p>
        `,

        showCancelButton: true,

        confirmButtonText:
          "Sí, eliminar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#8c1738",

        cancelButtonColor:
          "#737e84",

        reverseButtons: true,

        focusCancel: true,
      });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title:
          "Eliminando...",

        text:
          `Estamos eliminando a ${peludito.nombre}.`,

        allowOutsideClick:
          false,

        allowEscapeKey:
          false,

        showConfirmButton:
          false,

        didOpen: () => {
          Swal.showLoading();
        },
      });

      const {
        error: deleteError,
      } = await supabase
        .from("peluditos")
        .delete()
        .eq(
          "id",
          peludito.id
        );

      if (deleteError) {
        throw deleteError;
      }

      setPeluditos(
        (anteriores) =>
          anteriores.filter(
            (item) =>
              item.id !==
              peludito.id
          )
      );

      Swal.close();

      await Swal.fire({
        icon: "success",

        title:
          "Peludito eliminado",

        text:
          `${peludito.nombre} fue eliminado correctamente.`,

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#8c1738",
      });
    } catch (error) {
      console.error(
        "Error eliminando peludito:",
        error
      );

      Swal.close();

      await Swal.fire({
        icon: "error",

        title:
          "No pudimos eliminarlo",

        text:
          error?.message ||
          "Ocurrió un error al eliminar el peludito.",

        confirmButtonText:
          "Entendido",

        confirmButtonColor:
          "#8c1738",
      });
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="admin-page">

      {/* ===================================================
          CABECERA
          =================================================== */}

      <div className="admin-page-header">

        <div>
          <span className="admin-eyebrow">
            GESTIÓN
          </span>

          <h1>
            Peluditos
          </h1>

          <p>
            Agregá, editá y administrá
            los animales de la Protectora.
          </p>
        </div>

        <div className="admin-header-actions">

          <CargaRapidaPeludito />

          <Link
            to="/admin/peluditos/nuevo"
            className="admin-primary-button"
          >
            + Agregar peludito
          </Link>

        </div>

      </div>

      {/* ===================================================
          CARGANDO
          =================================================== */}

      {cargando && (
        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            🐾
          </div>

          <h2>
            Cargando peluditos...
          </h2>

          <p>
            Un momento, estamos buscando
            los registros de la Protectora.
          </p>

        </div>
      )}

      {/* ===================================================
          ERROR
          =================================================== */}

      {!cargando &&
        error && (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              ⚠️
            </div>

            <h2>
              No pudimos cargar
              los peluditos
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={
                cargarPeluditos
              }
            >
              Intentar nuevamente
            </button>

          </div>
        )}

      {/* ===================================================
          SIN PELUDITOS
          =================================================== */}

      {!cargando &&
        !error &&
        peluditos.length === 0 && (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              🐾
            </div>

            <span className="admin-eyebrow">
              EMPECEMOS
            </span>

            <h2>
              No hay peluditos cargados
            </h2>

            <p>
              Todavía no hay animales
              registrados en la plataforma.
              Agregá el primero para comenzar
              a construir el catálogo de
              adopciones.
            </p>

            <div className="admin-empty-actions">

              <CargaRapidaPeludito />

              <Link
                to="/admin/peluditos/nuevo"
                className="admin-primary-button"
              >
                + Agregar primer peludito
              </Link>

            </div>

          </div>
        )}

      {/* ===================================================
          HAY PELUDITOS
          =================================================== */}

      {!cargando &&
        !error &&
        peluditos.length > 0 && (
          <>

            {/* =============================================
                FILTROS
                ============================================= */}

            <div className="admin-filters">

              <div className="admin-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={
                    busqueda
                  }
                  onChange={
                    (e) =>
                      setBusqueda(
                        e.target.value
                      )
                  }
                />

              </div>

              <select
                value={
                  estado
                }
                onChange={
                  (e) =>
                    setEstado(
                      e.target.value
                    )
                }
              >

                <option value="">
                  Todos los estados
                </option>

                <option value="En adopción">
                  En adopción
                </option>

                <option value="En proceso">
                  En proceso
                </option>

                <option value="Adoptado">
                  Adoptado
                </option>

              </select>

            </div>

            {/* =============================================
                CANTIDAD
                ============================================= */}

            <div className="admin-table-header">

              <p>
                <strong>
                  {resultados.length}
                </strong>{" "}

                {resultados.length === 1
                  ? "peludito"
                  : "peluditos"}
              </p>

            </div>

            {/* =============================================
                SIN RESULTADOS
                ============================================= */}

            {resultados.length ===
            0 ? (

              <div className="admin-no-results">

                <span>
                  🔎
                </span>

                <h3>
                  No encontramos
                  peluditos
                </h3>

                <p>
                  Probá con otro nombre,
                  código o estado.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setEstado("");
                  }}
                >
                  Limpiar filtros
                </button>

              </div>

            ) : (

              /* ===========================================
                 LISTADO
                 =========================================== */

              <div className="admin-dogs-list">

                {resultados.map(
                  (peludito) => {
                    const fotoPrincipal =
                      obtenerFotoPrincipal(
                        peludito
                      );

                    return (
                      <article
                        className="admin-dog-row"
                        key={
                          peludito.id
                        }
                      >

                        {/* ===============================
                            FOTO
                            =============================== */}

                        {fotoPrincipal ? (

                          <img
                            src={
                              fotoPrincipal
                            }
                            alt={
                              peludito.nombre
                            }
                            className="admin-dog-photo"
                            loading="lazy"
                          />

                        ) : (

                          <div className="admin-dog-placeholder">
                            🐾
                          </div>

                        )}

                        {/* ===============================
                            NOMBRE
                            =============================== */}

                        <div className="admin-dog-name">

                          <strong>
                            {peludito.nombre}
                          </strong>

                          <span>
                            {peludito.codigo ||
                              "SIN CÓDIGO"}
                          </span>

                        </div>

                        {/* ===============================
                            SEXO
                            =============================== */}

                        <div className="admin-dog-data">

                          <small>
                            SEXO
                          </small>

                          <span>
                            {peludito.sexo ||
                              "—"}
                          </span>

                        </div>

                        {/* ===============================
                            TAMAÑO
                            =============================== */}

                        <div className="admin-dog-data">

                          <small>
                            TAMAÑO
                          </small>

                          <span>
                            {peludito.tamano ||
                              "—"}
                          </span>

                        </div>

                        {/* ===============================
                            EDAD
                            =============================== */}

                        <div className="admin-dog-data">

                          <small>
                            EDAD
                          </small>

                          <span>
                            {peludito.edad != null
                              ? `${peludito.edad} ${
                                  peludito.edad === 1
                                    ? "año"
                                    : "años"
                                }`
                              : "—"}
                          </span>

                        </div>

                        {/* ===============================
                            ESTADO + PUBLICACIÓN
                            =============================== */}

                        <div className="admin-dog-statuses">

                          <span className="admin-status">
                            {peludito.estado ||
                              "Sin estado"}
                          </span>

                          {peludito.publicado ? (

                            <span className="admin-published">
                              ● Publicado
                            </span>

                          ) : (

                            <div className="admin-unpublished-wrap">

                              <span className="admin-unpublished">
                                ● No publicado
                              </span>

                              <small>
                                Editá la ficha para publicarlo
                              </small>

                            </div>

                          )}

                        </div>

                        {/* ===============================
                            ACCIONES
                            =============================== */}

                        <div className="admin-row-actions">

                          <Link
                            className="admin-edit-button"
                            to={`/admin/peluditos/${peludito.id}/editar`}
                          >
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              eliminarPeludito(
                                peludito
                              )
                            }
                          >
                            Borrar
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </>
        )}

    </section>
  );
};

export default AdminPeluditos;