import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import perros from "../data/perros.js";

const SolicitudAdopcion = () => {
  const { id } = useParams();

  const perro = perros.find(
    (item) => item.id === id
  );

  const [enviado, setEnviado] = useState(false);

  const [formulario, setFormulario] = useState({
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

  const manejarCambio = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    console.log({
      perroId: perro.id,
      perroNombre: perro.nombre,
      ...formulario,
    });

    setEnviado(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!perro) {
    return (
      <section className="page-container">
        <h1>Peludito no encontrado 🐾</h1>

        <Link
          to="/adopciones"
          className="btn btn-primary"
        >
          Volver a adopciones
        </Link>
      </section>
    );
  }

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
            Recibimos tu solicitud de adopción.
            La Protectora San Francisco de Asís
            revisará la información y se pondrá
            en contacto contigo para continuar
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
                {perro.id.toUpperCase()}
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

        <aside className="solicitud-perro">
          <img
            src={perro.imagen}
            alt={perro.nombre}
          />

          <div className="solicitud-perro-info">
            <span>
              QUIERO ADOPTAR A
            </span>

            <h2>{perro.nombre}</h2>

            <p>
              {perro.edad}{" "}
              {perro.edad === 1
                ? "año"
                : "años"}{" "}
              · {perro.sexo} ·{" "}
              {perro.tamano}
            </p>

            <small>
              {perro.id.toUpperCase()}
            </small>
          </div>

          <div className="solicitud-aviso">
            <span>🐾</span>

            <p>
              Adoptar es una decisión para toda
              la vida. Este formulario nos ayuda
              a conocerte un poquito mejor.
            </p>
          </div>
        </aside>

        <div className="solicitud-contenido">

          <div className="solicitud-header">
            <span className="form-eyebrow">
              SOLICITUD DE ADOPCIÓN
            </span>

            <h1>
              ¿Querés compartir tu vida con{" "}
              <span>{perro.nombre}?</span>
            </h1>

            <p>
              Contanos un poco sobre vos y el
              hogar que podría recibirlo.
            </p>
          </div>

          <form
            className="adopcion-form"
            onSubmit={manejarEnvio}
          >

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
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Tu nombre"
                  />
                </label>

                <label>
                  Apellido *
                  <input
                    required
                    type="text"
                    name="apellido"
                    value={formulario.apellido}
                    onChange={manejarCambio}
                    placeholder="Tu apellido"
                  />
                </label>

                <label>
                  Teléfono *
                  <input
                    required
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                    placeholder="Ej: 099 123 456"
                  />
                </label>

                <label>
                  Email *
                  <input
                    required
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={manejarCambio}
                    placeholder="tu@email.com"
                  />
                </label>

                <label className="form-full">
                  Localidad *
                  <input
                    required
                    type="text"
                    name="localidad"
                    value={formulario.localidad}
                    onChange={manejarCambio}
                    placeholder="Ej: Mercedes, Soriano"
                  />
                </label>
              </div>
            </fieldset>

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
                    value={formulario.vivienda}
                    onChange={manejarCambio}
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
                    onChange={manejarCambio}
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
                    value={formulario.patio}
                    onChange={manejarCambio}
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
                    onChange={manejarCambio}
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
                    onChange={manejarCambio}
                    placeholder="Ej: 3"
                  />
                </label>

                <label>
                  ¿Hay niños en el hogar? *
                  <select
                    required
                    name="ninos"
                    value={formulario.ninos}
                    onChange={manejarCambio}
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
                    onChange={manejarCambio}
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
                    onChange={manejarCambio}
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
                      onChange={manejarCambio}
                      placeholder="Qué animales tenés, edades, sexo..."
                    />
                  </label>
                )}

              </div>
            </fieldset>

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
                    onChange={manejarCambio}
                    placeholder="Contanos brevemente tu experiencia..."
                  />
                </label>

                <label className="form-full">
                  ¿Por qué querés adoptar a{" "}
                  {perro.nombre}? *
                  <textarea
                    required
                    name="motivo"
                    value={formulario.motivo}
                    onChange={manejarCambio}
                    placeholder={`Contanos qué te hizo elegir a ${perro.nombre}...`}
                  />
                </label>

              </div>
            </fieldset>

            <label className="compromiso-check">
              <input
                required
                type="checkbox"
                name="compromiso"
                checked={
                  formulario.compromiso
                }
                onChange={manejarCambio}
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

            <button
              type="submit"
              className="enviar-solicitud"
            >
              ❤️ Enviar solicitud para{" "}
              {perro.nombre}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
};

export default SolicitudAdopcion;