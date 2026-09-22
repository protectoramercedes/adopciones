import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  supabase,
} from "../lib/supabase.js";

import {
  opcionesDonacion,
} from "../data/donaciones.js";

import "../styles/apadrinar.css";

const Apadrinar = () => {
  const [peluditos, setPeluditos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     CARGAR PELUDITOS APADRINABLES
     ======================================================= */

  useEffect(() => {
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
          .eq("apadrinable", true)
          .order("created_at", {
            ascending: false,
          });

        if (supabaseError) {
          throw supabaseError;
        }

        setPeluditos(data ?? []);
      } catch (error) {
        console.error(
          "Error cargando peluditos para padrinazgo:",
          error
        );

        setError(
          "No pudimos cargar los peluditos disponibles para padrinazgo."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPeluditos();
  }, []);

  /* =======================================================
     FOTO PRINCIPAL
     ======================================================= */

  const obtenerFotoPrincipal = (
    peludito
  ) => {
    const fotos =
      peludito.peludito_fotos ?? [];

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
     APADRINAR
     ======================================================= */

  const abrirPadrinazgo = async (
    peludito
  ) => {
    const opcionesMonto =
      opcionesDonacion
        .map(
          ({ monto }) => `
            <label class="padrinazgo-monto-option">
              <input
                type="radio"
                name="padrinazgo-monto"
                value="${monto}"
              />

              <span>
                $${monto}
              </span>
            </label>
          `
        )
        .join("");

    const resultado =
      await Swal.fire({
        title:
          `❤️ Apadrinar a ${peludito.nombre}`,

        html: `
          <div class="padrinazgo-form">

            <p class="padrinazgo-intro">
              Tu aporte ayuda con su
              alimentación, atención
              veterinaria, medicamentos
              y cuidados mientras está
              en la Protectora.
            </p>

            <label class="padrinazgo-field">
              <span>
                Tu nombre *
              </span>

              <input
                id="padrinazgo-nombre"
                class="swal2-input"
                type="text"
                placeholder="Nombre y apellido"
                autocomplete="name"
              />
            </label>

            <label class="padrinazgo-field">
              <span>
                Teléfono / WhatsApp *
              </span>

              <input
                id="padrinazgo-telefono"
                class="swal2-input"
                type="tel"
                placeholder="Ej: 099 123 456"
                autocomplete="tel"
              />
            </label>

            <label class="padrinazgo-anonimo">

              <input
                id="padrinazgo-anonimo"
                type="checkbox"
              />

              <span>
                Prefiero aparecer como
                padrino/madrina anónimo/a
              </span>

            </label>

            <div class="padrinazgo-privacy">
              🔒 Tu teléfono será utilizado
              únicamente por la Protectora
              para contactarte en relación
              con tu padrinazgo.
              No se mostrará públicamente.
            </div>

            <div class="padrinazgo-montos">

              <strong>
                Elegí tu aporte
              </strong>

              <div class="padrinazgo-montos-grid">
                ${opcionesMonto}
              </div>

            </div>

          </div>
        `,

        showCancelButton: true,

        confirmButtonText:
          "Continuar con Mercado Pago",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#a5163d",

        cancelButtonColor:
          "#777",

        focusConfirm: false,

        width: 560,

        preConfirm: () => {
          const nombre =
            document
              .getElementById(
                "padrinazgo-nombre"
              )
              ?.value.trim();

          const telefono =
            document
              .getElementById(
                "padrinazgo-telefono"
              )
              ?.value.trim();

          const anonimo =
            document
              .getElementById(
                "padrinazgo-anonimo"
              )
              ?.checked ?? false;

          const montoSeleccionado =
            document.querySelector(
              'input[name="padrinazgo-monto"]:checked'
            );

          if (!nombre) {
            Swal.showValidationMessage(
              "Ingresá tu nombre."
            );

            return false;
          }

          if (!telefono) {
            Swal.showValidationMessage(
              "Ingresá un teléfono o WhatsApp."
            );

            return false;
          }

          if (!montoSeleccionado) {
            Swal.showValidationMessage(
              "Elegí el monto con el que querés colaborar."
            );

            return false;
          }

          return {
            nombre,
            telefono,
            anonimo,
            monto:
              Number(
                montoSeleccionado.value
              ),
          };
        },
      });

    if (!resultado.isConfirmed) {
      return;
    }

    const {
      nombre,
      telefono,
      anonimo,
      monto,
    } = resultado.value;

    try {
      Swal.fire({
        title:
          "Preparando tu padrinazgo...",

        text:
          `Estamos registrando tu intención de apadrinar a ${peludito.nombre}.`,

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

      /* ===============================================
         GUARDAR PADRINAZGO PENDIENTE
         =============================================== */

      const {
        error: insertError,
      } = await supabase
        .from("padrinazgos")
        .insert({
          peludito_id:
            peludito.id,

          nombre,

          telefono,

          anonimo,

          monto,

          estado:
            "pendiente",
        });

      if (insertError) {
        throw insertError;
      }

      /* ===============================================
         BUSCAR LINK DE MERCADO PAGO
         =============================================== */

      const opcionPago =
        opcionesDonacion.find(
          (opcion) =>
            opcion.monto === monto
        );

      if (!opcionPago) {
        throw new Error(
          "No encontramos el enlace de pago para el monto seleccionado."
        );
      }

      Swal.close();

      /* ===============================================
         AVISO ANTES DE IR A MERCADO PAGO
         =============================================== */

      const continuar =
        await Swal.fire({
          icon: "success",

          title:
            `¡Gracias por elegir a ${peludito.nombre}! ❤️`,

          html: `
            <p>
              Registramos tus datos
              correctamente.
            </p>

            <p style="
              margin-top: 12px;
              color: #777;
            ">
              Ahora vas a continuar a
              Mercado Pago para realizar
              tu aporte de
              <strong>$${monto}</strong>.
            </p>

            <p style="
              margin-top: 12px;
              color: #777;
              font-size: .88rem;
            ">
              Tu nombre aparecerá en la
              ficha de ${peludito.nombre}
              una vez que la Protectora
              confirme el padrinazgo.
            </p>
          `,

          confirmButtonText:
            "Ir a Mercado Pago",

          confirmButtonColor:
            "#a5163d",

          showCancelButton: true,

          cancelButtonText:
            "Ahora no",
        });

      if (
        continuar.isConfirmed
      ) {
        window.open(
          opcionPago.url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error(
        "Error creando padrinazgo:",
        error
      );

      Swal.close();

      await Swal.fire({
        icon: "error",

        title:
          "No pudimos iniciar el padrinazgo",

        text:
          error?.message ||
          "Ocurrió un error. Probá nuevamente.",

        confirmButtonText:
          "Entendido",

        confirmButtonColor:
          "#a5163d",
      });
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="apadrinar-page">

      <section className="apadrinar-hero">

        <span className="apadrinar-eyebrow">
          ❤️ PADRINOS Y MADRINAS
        </span>

        <h1>
          Acompañalos mientras esperan
          <span>
            {" "}su gran oportunidad.
          </span>
        </h1>

        <p>
          Quizás hoy no puedas adoptar,
          pero igualmente podés cambiar
          una vida. Apadrinando ayudás
          con alimento, atención
          veterinaria, medicamentos y
          cuidados.
        </p>

      </section>

      <section className="apadrinar-intro">

        <div className="apadrinar-intro-icon">
          🐾
        </div>

        <div>
          <span>
            ¿QUÉ SIGNIFICA APADRINAR?
          </span>

          <h2>
            También podés ser parte
            de su historia.
          </h2>

          <p>
            Ser padrino o madrina
            significa acompañar a uno
            de nuestros peluditos
            durante su estadía en la
            Protectora y colaborar con
            los gastos necesarios para
            su bienestar.
          </p>
        </div>

      </section>

      <section className="apadrinar-catalogo">

        <div className="apadrinar-heading">

          <span>
            ELLOS TE ESTÁN ESPERANDO
          </span>

          <h2>
            Peluditos para apadrinar
          </h2>

          {!cargando &&
            !error && (
              <p>
                Actualmente hay{" "}
                <strong>
                  {peluditos.length}
                </strong>{" "}
                {peluditos.length === 1
                  ? "peludito disponible"
                  : "peluditos disponibles"}{" "}
                para padrinazgo.
              </p>
            )}

        </div>

        {cargando && (
          <div className="apadrinar-estado">

            <span>🐾</span>

            <h3>
              Buscando peluditos...
            </h3>

          </div>
        )}

        {!cargando &&
          error && (
            <div className="apadrinar-estado">

              <span>❤️</span>

              <h3>
                No pudimos cargar
                los peluditos
              </h3>

              <p>
                {error}
              </p>

            </div>
          )}

        {!cargando &&
          !error &&
          peluditos.length === 0 && (
            <div className="apadrinar-estado">

              <span>🐾</span>

              <h3>
                Por ahora no hay
                peluditos disponibles
                para padrinazgo
              </h3>

              <p>
                Muy pronto vas a poder
                conocer nuevas historias
                para acompañar.
              </p>

              <Link
                to="/adopciones"
                className="apadrinar-secondary-button"
              >
                Conocer nuestros
                peluditos
              </Link>

            </div>
          )}

        {!cargando &&
          !error &&
          peluditos.length > 0 && (
            <div className="apadrinar-grid">

              {peluditos.map(
                (peludito) => {
                  const foto =
                    obtenerFotoPrincipal(
                      peludito
                    );

                  return (
                    <article
                      className="apadrinar-card"
                      key={
                        peludito.id
                      }
                    >

                      <div className="apadrinar-card-image">

                        {foto ? (
                          <img
                            src={foto}
                            alt={`Foto de ${peludito.nombre}`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="apadrinar-card-placeholder">
                            🐾
                          </div>
                        )}

                        <span className="apadrinar-card-badge">
                          ❤️ Busco padrino/a
                        </span>

                      </div>

                      <div className="apadrinar-card-content">

                        <div className="apadrinar-card-title">

                          <h3>
                            {peludito.nombre}
                          </h3>

                          <span>
                            {peludito.sexo ===
                            "Hembra"
                              ? "♀"
                              : "♂"}
                          </span>

                        </div>

                        <div className="apadrinar-card-data">

                          {peludito.edad != null && (
                            <span>
                              {peludito.edad}{" "}
                              {peludito.edad === 1
                                ? "año"
                                : "años"}
                            </span>
                          )}

                          {peludito.tamano && (
                            <>
                              <span>
                                •
                              </span>

                              <span>
                                {peludito.tamano}
                              </span>
                            </>
                          )}

                          {peludito.energia && (
                            <>
                              <span>
                                •
                              </span>

                              <span>
                                {peludito.energia}
                              </span>
                            </>
                          )}

                        </div>

                        {peludito.descripcion && (
                          <p className="apadrinar-card-description">
                            {peludito.descripcion}
                          </p>
                        )}

                        <div className="apadrinar-card-actions">

                          <Link
                            to={`/adopciones/${peludito.id}`}
                            className="apadrinar-conocer"
                          >
                            Conoceme
                          </Link>

                          <button
                            type="button"
                            className="apadrinar-button"
                            onClick={() =>
                              abrirPadrinazgo(
                                peludito
                              )
                            }
                          >
                            ❤️ Apadrinarme
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

      </section>

      <section className="apadrinar-cierre">

        <span>❤️</span>

        <h2>
          No hace falta llevarlos
          a casa para formar parte
          de su vida.
        </h2>

        <p>
          Cada padrino y cada madrina
          nos ayuda a seguir cuidándolos
          hasta que llegue esa familia
          que tanto esperan.
        </p>

      </section>

    </main>
  );
};

export default Apadrinar;