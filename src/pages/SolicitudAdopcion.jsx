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

const SolicitudAdopcion = () => {
  const { id } = useParams();

  const [perro, setPerro] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [errorCarga, setErrorCarga] =
    useState("");

  const [enviado, setEnviado] =
    useState(false);

  const [enviando, setEnviando] =
    useState(false);

  const [errorEnvio, setErrorEnvio] =
    useState("");

  const [formulario, setFormulario] =
    useState({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      localidad: "",
      vivienda: "",
      viviendaPropia: "",
      patio: "",
      patioCerrado: "",
      personasHogar: "",
      ninos: "",
      otrosAnimales: "",
      detalleAnimales: "",
      horasSolo: "",
      experiencia: "",
      motivo: "",
      compromiso: false,
    });

  /* =====================================================
     CARGAR PELUDITO
     ===================================================== */

  useEffect(() => {
    let activo = true;

    const cargarPeludito = async () => {
      try {
        setCargando(true);
        setErrorCarga("");

        const {
          data,
          error,
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

        if (error) {
          throw error;
        }

        if (!activo) {
          return;
        }

        const fotos =
          data?.peludito_fotos || [];

        const fotoPrincipal =
          fotos.find(
            (foto) =>
              foto.principal === true
          ) ||
          [...fotos].sort(
            (a, b) =>
              (a.orden ?? 999) -
              (b.orden ?? 999)
          )[0];

        const peluditoPreparado = {
          ...data,

          imagen:
            fotoPrincipal?.url ||
            "/placeholder-peludito.png",

          aptoPerros:
            data.apto_perros,

          aptoGatos:
            data.apto_gatos,

          aptoNinos:
            data.apto_ninos,
        };

        setPerro(
          peluditoPreparado
        );
      } catch (error) {
        console.error(
          "Error cargando peludito:",
          error
        );

        if (!activo) {
          return;
        }

        setPerro(null);

        setErrorCarga(
          "No pudimos cargar este peludito."
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    if (id) {
      cargarPeludito();
    }

    return () => {
      activo = false;
    };
  }, [id]);

  /* =====================================================
     CAMBIOS DEL FORMULARIO
     ===================================================== */

  const manejarCambio = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormulario((anterior) => ({
      ...anterior,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errorEnvio) {
      setErrorEnvio("");
    }
  };

  /* =====================================================
     ENVIAR SOLICITUD A SUPABASE
     ===================================================== */

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!perro || enviando) {
      return;
    }

    try {
      setEnviando(true);
      setErrorEnvio("");

      const {
        error,
      } = await supabase
        .from("solicitudes_adopcion")
        .insert({
          peludito_id:
            perro.id,

          nombre:
            formulario.nombre.trim(),

          apellido:
            formulario.apellido.trim(),

          telefono:
            formulario.telefono.trim(),

          email:
            formulario.email
              .trim()
              .toLowerCase(),

          localidad:
            formulario.localidad.trim(),

          vivienda:
            formulario.vivienda,

          vivienda_propia:
            formulario.viviendaPropia,

          patio:
            formulario.patio,

          patio_cerrado:
            formulario.patioCerrado ||
            null,

          personas_hogar:
            Number(
              formulario.personasHogar
            ),

          ninos:
            formulario.ninos,

          otros_animales:
            formulario.otrosAnimales,

          detalle_animales:
            formulario.detalleAnimales
              ?.trim() ||
            null,

          horas_solo:
            formulario.horasSolo ||
            null,

          experiencia:
            formulario.experiencia
              ?.trim() ||
            null,

          motivo:
            formulario.motivo.trim(),

          estado:
            "Pendiente",
        });

      if (error) {
        throw error;
      }

      setEnviado(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Error enviando solicitud:",
        error
      );

      setErrorEnvio(
        "No pudimos enviar tu solicitud. Por favor, intentá nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  /* =====================================================
     CARGANDO
     ===================================================== */

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
            Estamos preparando la
            solicitud de adopción.
          </p>

        </div>

      </section>
    );
  }

  /* =====================================================
     PELUDITO NO ENCONTRADO
     ===================================================== */

  if (!perro) {
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
            {errorCarga ||
              "No pudimos encontrar al peludito que estabas buscando."}
          </p>

          <Link
            to="/adopciones"
            className="btn btn-primary"
          >
            Volver a adopciones
          </Link>

        </div>

      </section>
    );
  }

  /* =====================================================
     SOLICITUD ENVIADA
     ===================================================== */

  if (enviado) {
    return (
      <section className="solicitud-confirmacion">

        <div className="confirmacion-card">

          <span className="confirmacion-icono">
            ❤️
          </span>

          <span className="form-eyebrow">
            SOLICITUD RECIBIDA
          </span>

          <h1>
            Gracias por pensar en{" "}
            {perro.nombre}.
          </h1>

          <p>
            Recibimos tu solicitud de
            adopción. La Protectora San
            Francisco de Asís revisará la
            información y se pondrá en
            contacto contigo para continuar
            el proceso.
          </p>

          <div className="confirmacion-perro">

            <img
              src={perro.imagen}
              alt={perro.nombre}
            />

            <div>

              <small>
                SOLICITUD PARA
              </small>

              <strong>
                {perro.nombre}
              </strong>

              <span>
                {perro.codigo ||
                  perro.id
                    .slice(0, 8)
                    .toUpperCase()}
              </span>

            </div>

          </div>

          <Link
            to="/adopciones"
            className="btn btn-primary"
          >
            Conocer más peluditos
          </Link>

        </div>

      </section>
    );
  }

  /* =====================================================
     FORMULARIO
     ===================================================== */

  return (
    <main className="solicitud-page">

      <div className="solicitud-volver">

        <Link
          to={`/adopciones/${perro.id}`}
        >
          ← Volver a {perro.nombre}
        </Link>

      </div>

      <div className="solicitud-layout">

        {/* ===============================================
            INFORMACIÓN DEL PELUDITO
            =============================================== */}

        <aside className="solicitud-perro">

          <img
            src={perro.imagen}
            alt={perro.nombre}
          />

          <div className="solicitud-perro-info">

            <span>
              QUIERO ADOPTAR A
            </span>

            <h2>
              {perro.nombre}
            </h2>

            <p>

              {perro.edad != null
                ? `${perro.edad} ${
                    Number(perro.edad) ===
                    1
                      ? "año"
                      : "años"
                  }`
                : "Edad no especificada"}

              {" · "}

              {perro.sexo ||
                "Sexo no especificado"}

              {" · "}

              {perro.tamano ||
                "Tamaño no especificado"}

            </p>

            <small>
              {perro.codigo ||
                perro.id
                  .slice(0, 8)
                  .toUpperCase()}
            </small>

          </div>

          <div className="solicitud-aviso">

            <span>
              🐾
            </span>

            <p>
              Adoptar es una decisión para
              toda la vida. Este formulario
              nos ayuda a conocerte un
              poquito mejor.
            </p>

          </div>

        </aside>

        {/* ===============================================
            CONTENIDO
            =============================================== */}

        <div className="solicitud-contenido">

          <div className="solicitud-header">

            <span className="form-eyebrow">
              SOLICITUD DE ADOPCIÓN
            </span>

            <h1>
              ¿Querés compartir tu vida con{" "}
              <span>
                {perro.nombre}?
              </span>
            </h1>

            <p>
              Contanos un poco sobre vos y
              el hogar que podría recibirlo.
            </p>

          </div>

          <form
            className="adopcion-form"
            onSubmit={manejarEnvio}
          >

            {/* ===========================================
                1 - SOBRE VOS
                =========================================== */}

            <fieldset>

              <legend>
                <span>1</span>
                Sobre vos
              </legend>

              <div className="form-grid">

                <label>
                  Nombre *

                  <input
                    required
                    type="text"
                    name="nombre"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Tu nombre"
                  />
                </label>

                <label>
                  Apellido *

                  <input
                    required
                    type="text"
                    name="apellido"
                    value={
                      formulario.apellido
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Tu apellido"
                  />
                </label>

                <label>
                  Teléfono *

                  <input
                    required
                    type="tel"
                    name="telefono"
                    value={
                      formulario.telefono
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej: 099 123 456"
                  />
                </label>

                <label>
                  Email *

                  <input
                    required
                    type="email"
                    name="email"
                    value={
                      formulario.email
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="tu@email.com"
                  />
                </label>

                <label className="form-full">
                  Localidad *

                  <input
                    required
                    type="text"
                    name="localidad"
                    value={
                      formulario.localidad
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej: Mercedes, Soriano"
                  />
                </label>

              </div>

            </fieldset>

            {/* ===========================================
                2 - TU HOGAR
                =========================================== */}

            <fieldset>

              <legend>
                <span>2</span>
                Tu hogar
              </legend>

              <div className="form-grid">

                <label>
                  ¿Dónde vivís? *

                  <select
                    required
                    name="vivienda"
                    value={
                      formulario.vivienda
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Casa">
                      Casa
                    </option>

                    <option value="Apartamento">
                      Apartamento
                    </option>

                    <option value="Otro">
                      Otro
                    </option>

                  </select>

                </label>

                <label>
                  ¿La vivienda es propia? *

                  <select
                    required
                    name="viviendaPropia"
                    value={
                      formulario.viviendaPropia
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Sí">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                  </select>

                </label>

                <label>
                  ¿Tenés patio? *

                  <select
                    required
                    name="patio"
                    value={
                      formulario.patio
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Sí">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                  </select>

                </label>

                <label>
                  ¿El patio está cerrado?

                  <select
                    name="patioCerrado"
                    value={
                      formulario.patioCerrado
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Sí">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                    <option value="No aplica">
                      No aplica
                    </option>

                  </select>

                </label>

                <label>
                  Personas en el hogar *

                  <input
                    required
                    type="number"
                    min="1"
                    name="personasHogar"
                    value={
                      formulario.personasHogar
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej: 3"
                  />

                </label>

                <label>
                  ¿Hay niños en el hogar? *

                  <select
                    required
                    name="ninos"
                    value={
                      formulario.ninos
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Sí">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                  </select>

                </label>

              </div>

            </fieldset>

            {/* ===========================================
                3 - OTROS ANIMALES
                =========================================== */}

            <fieldset>

              <legend>
                <span>3</span>
                Otros animales
              </legend>

              <div className="form-grid">

                <label>
                  ¿Tenés otros animales? *

                  <select
                    required
                    name="otrosAnimales"
                    value={
                      formulario.otrosAnimales
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Sí">
                      Sí
                    </option>

                    <option value="No">
                      No
                    </option>

                  </select>

                </label>

                <label>
                  ¿Cuántas horas estaría solo?

                  <select
                    name="horasSolo"
                    value={
                      formulario.horasSolo
                    }
                    onChange={
                      manejarCambio
                    }
                  >

                    <option value="">
                      Seleccionar
                    </option>

                    <option value="Menos de 2">
                      Menos de 2 horas
                    </option>

                    <option value="2 a 4">
                      2 a 4 horas
                    </option>

                    <option value="4 a 8">
                      4 a 8 horas
                    </option>

                    <option value="Más de 8">
                      Más de 8 horas
                    </option>

                  </select>

                </label>

                {formulario.otrosAnimales ===
                  "Sí" && (

                  <label className="form-full">

                    Contanos sobre ellos

                    <textarea
                      name="detalleAnimales"
                      value={
                        formulario.detalleAnimales
                      }
                      onChange={
                        manejarCambio
                      }
                      placeholder="Qué animales tenés, edades, sexo..."
                    />

                  </label>

                )}

              </div>

            </fieldset>

            {/* ===========================================
                4 - LA ADOPCIÓN
                =========================================== */}

            <fieldset>

              <legend>
                <span>4</span>
                La adopción
              </legend>

              <div className="form-grid">

                <label className="form-full">

                  ¿Tuviste perros anteriormente?

                  <textarea
                    name="experiencia"
                    value={
                      formulario.experiencia
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Contanos brevemente tu experiencia..."
                  />

                </label>

                <label className="form-full">

                  ¿Por qué querés adoptar a{" "}
                  {perro.nombre}? *

                  <textarea
                    required
                    name="motivo"
                    value={
                      formulario.motivo
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder={
                      `Contanos qué te hizo elegir a ${perro.nombre}...`
                    }
                  />

                </label>

              </div>

            </fieldset>

            {/* ===========================================
                COMPROMISO
                =========================================== */}

            <label className="compromiso-check">

              <input
                required
                type="checkbox"
                name="compromiso"
                checked={
                  formulario.compromiso
                }
                onChange={
                  manejarCambio
                }
              />

              <span>
                Entiendo que enviar esta
                solicitud no garantiza la
                adopción y que la Protectora
                evaluará cada caso buscando
                siempre el bienestar del
                animal.
              </span>

            </label>

            {/* ===========================================
                ERROR DE ENVÍO
                =========================================== */}

            {errorEnvio && (

              <div className="admin-login-error">
                {errorEnvio}
              </div>

            )}

            {/* ===========================================
                BOTÓN
                =========================================== */}

            <button
              type="submit"
              className="enviar-solicitud"
              disabled={enviando}
            >

              {enviando
                ? "Enviando solicitud..."
                : `❤️ Enviar solicitud para ${perro.nombre}`}

            </button>

          </form>

        </div>

      </div>

    </main>
  );
};

export default SolicitudAdopcion;