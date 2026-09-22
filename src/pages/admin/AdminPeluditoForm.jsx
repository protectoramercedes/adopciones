import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../../lib/supabase.js";

const formularioInicial = {
  nombre: "",
  edad: "",
  sexo: "",
  tamano: "",
  energia: "",
  descripcion: "",

  aptoPerros: false,
  aptoGatos: false,
  aptoNinos: false,

  estado: "En adopción",

  publicado: true,

  // Define si aparece también
  // en la sección Apadrinar.
  apadrinable: false,
};

const AdminPeluditoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [fotos, setFotos] =
    useState([]);

  const [cargando, setCargando] =
    useState(editando);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     SI ESTAMOS EDITANDO, CARGAR PELUDITO
     ======================================================= */

  useEffect(() => {
    if (!id) {
      return;
    }

    const cargarPeludito = async () => {
      try {
        setCargando(true);
        setError("");

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("peluditos")
          .select("*")
          .eq("id", id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setFormulario({
          nombre:
            data.nombre ?? "",

          edad:
            data.edad ?? "",

          sexo:
            data.sexo ?? "",

          tamano:
            data.tamano ?? "",

          energia:
            data.energia ?? "",

          descripcion:
            data.descripcion ?? "",

          aptoPerros:
            data.apto_perros ??
            false,

          aptoGatos:
            data.apto_gatos ??
            false,

          aptoNinos:
            data.apto_ninos ??
            false,

          estado:
            data.estado ??
            "En adopción",

          publicado:
            data.publicado ??
            true,

          apadrinable:
            data.apadrinable ??
            false,
        });
      } catch (error) {
        console.error(
          "Error cargando peludito:",
          error
        );

        setError(
          "No pudimos cargar la información del peludito."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPeludito();
  }, [id]);

  /* =======================================================
     CAMBIOS DEL FORMULARIO
     ======================================================= */

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
  };

  /* =======================================================
     FOTOS — PREVIEW LOCAL
     ======================================================= */

  const manejarFotos = (e) => {
    const archivos =
      Array.from(
        e.target.files
      );

    const nuevasFotos =
      archivos.map((archivo) => ({
        archivo,

        preview:
          URL.createObjectURL(
            archivo
          ),
      }));

    setFotos((anteriores) => [
      ...anteriores,
      ...nuevasFotos,
    ]);

    e.target.value = "";
  };

  const quitarFoto = (index) => {
    setFotos((anteriores) => {
      const foto =
        anteriores[index];

      if (foto?.preview) {
        URL.revokeObjectURL(
          foto.preview
        );
      }

      return anteriores.filter(
        (_, i) => i !== index
      );
    });
  };

  /* =======================================================
     GENERAR CÓDIGO SFA
     ======================================================= */

  const generarCodigo = async () => {
    const {
      data,
      error: codigoError,
    } = await supabase
      .from("peluditos")
      .select("codigo")
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (codigoError) {
      throw codigoError;
    }

    if (
      !data ||
      data.length === 0
    ) {
      return "SFA-001";
    }

    const codigoAnterior =
      data[0]?.codigo;

    const numeroAnterior =
      Number(
        codigoAnterior
          ?.replace(
            "SFA-",
            ""
          )
      );

    const siguiente =
      Number.isFinite(
        numeroAnterior
      )
        ? numeroAnterior + 1
        : 1;

    return `SFA-${String(
      siguiente
    ).padStart(3, "0")}`;
  };

  /* =======================================================
     GUARDAR EN SUPABASE
     ======================================================= */

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (guardando) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const datosPeludito = {
        nombre:
          formulario.nombre.trim(),

        edad:
          formulario.edad === ""
            ? null
            : Number(
                formulario.edad
              ),

        sexo:
          formulario.sexo,

        tamano:
          formulario.tamano,

        energia:
          formulario.energia ||
          null,

        descripcion:
          formulario.descripcion.trim(),

        apto_perros:
          formulario.aptoPerros,

        apto_gatos:
          formulario.aptoGatos,

        apto_ninos:
          formulario.aptoNinos,

        estado:
          formulario.estado,

        publicado:
          formulario.publicado,

        apadrinable:
          formulario.apadrinable,

        updated_at:
          new Date().toISOString(),
      };

      /* =========================
         EDITAR
         ========================= */

      if (editando) {
        const {
          error: updateError,
        } = await supabase
          .from("peluditos")
          .update(
            datosPeludito
          )
          .eq("id", id);

        if (updateError) {
          throw updateError;
        }
      }

      /* =========================
         CREAR
         ========================= */

      if (!editando) {
        const codigo =
          await generarCodigo();

        const {
          error: insertError,
        } = await supabase
          .from("peluditos")
          .insert({
            ...datosPeludito,
            codigo,
          });

        if (insertError) {
          throw insertError;
        }
      }

      navigate(
        "/admin/peluditos",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Error guardando peludito:",
        error
      );

      setError(
        error?.message ||
          "No pudimos guardar el peludito."
      );
    } finally {
      setGuardando(false);
    }
  };

  /* =======================================================
     CARGANDO EDICIÓN
     ======================================================= */

  if (cargando) {
    return (
      <section className="admin-page">
        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            🐾
          </div>

          <h2>
            Cargando peludito...
          </h2>

        </div>
      </section>
    );
  }

  /* =======================================================
     FORMULARIO
     ======================================================= */

  return (
    <section className="admin-page">

      <div className="admin-form-back">
        <Link to="/admin/peluditos">
          ← Volver a peluditos
        </Link>
      </div>

      <div className="admin-form-heading">

        <span className="admin-eyebrow">
          {editando
            ? "EDITAR PELUDITO"
            : "NUEVO PELUDITO"}
        </span>

        <h1>
          {editando
            ? `Editar ${formulario.nombre}`
            : "Agregar peludito"}
        </h1>

        <p>
          Completá la información que se
          mostrará en la página pública.
        </p>

      </div>

      <form
        className="admin-dog-form"
        onSubmit={manejarEnvio}
      >

        {/* =================================================
            1. INFORMACIÓN
            ================================================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-title">
            <span>1</span>

            <div>
              <h2>
                Información principal
              </h2>

              <p>
                Los datos básicos del
                peludito.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">

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
                placeholder="Ej: Luna"
              />
            </label>

            <label>
              Edad aproximada

              <input
                type="number"
                min="0"
                name="edad"
                value={
                  formulario.edad
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: 3"
              />
            </label>

            <label>
              Sexo *

              <select
                required
                name="sexo"
                value={
                  formulario.sexo
                }
                onChange={
                  manejarCambio
                }
              >
                <option value="">
                  Seleccionar
                </option>

                <option value="Hembra">
                  Hembra
                </option>

                <option value="Macho">
                  Macho
                </option>
              </select>
            </label>

            <label>
              Tamaño *

              <select
                required
                name="tamano"
                value={
                  formulario.tamano
                }
                onChange={
                  manejarCambio
                }
              >
                <option value="">
                  Seleccionar
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
            </label>

            <label>
              Personalidad

              <select
                name="energia"
                value={
                  formulario.energia
                }
                onChange={
                  manejarCambio
                }
              >
                <option value="">
                  Seleccionar
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
            </label>

            <label>
              Estado *

              <select
                required
                name="estado"
                value={
                  formulario.estado
                }
                onChange={
                  manejarCambio
                }
              >
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
            </label>

            <label className="admin-form-full">
              Historia / descripción *

              <textarea
                required
                name="descripcion"
                value={
                  formulario.descripcion
                }
                onChange={
                  manejarCambio
                }
                placeholder="Contanos su historia, personalidad y todo lo que una futura familia debería saber..."
              />
            </label>

          </div>
        </div>

        {/* =================================================
            2. CONVIVENCIA
            ================================================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-title">
            <span>2</span>

            <div>
              <h2>
                Convivencia
              </h2>

              <p>
                Indicá con quién puede
                convivir.
              </p>
            </div>
          </div>

          <div className="admin-check-grid">

            <label>
              <input
                type="checkbox"
                name="aptoPerros"
                checked={
                  formulario.aptoPerros
                }
                onChange={
                  manejarCambio
                }
              />

              <span>🐕</span>

              <div>
                <strong>
                  Convive con perros
                </strong>

                <small>
                  Puede vivir con otros
                  perros.
                </small>
              </div>
            </label>

            <label>
              <input
                type="checkbox"
                name="aptoGatos"
                checked={
                  formulario.aptoGatos
                }
                onChange={
                  manejarCambio
                }
              />

              <span>🐈</span>

              <div>
                <strong>
                  Convive con gatos
                </strong>

                <small>
                  Puede vivir con gatos.
                </small>
              </div>
            </label>

            <label>
              <input
                type="checkbox"
                name="aptoNinos"
                checked={
                  formulario.aptoNinos
                }
                onChange={
                  manejarCambio
                }
              />

              <span>👧</span>

              <div>
                <strong>
                  Convive con niños
                </strong>

                <small>
                  Recomendado para hogares
                  con niños.
                </small>
              </div>
            </label>

          </div>
        </div>

        {/* =================================================
            3. FOTOS
            ================================================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-title">
            <span>3</span>

            <div>
              <h2>
                Fotos
              </h2>

              <p>
                Podés seleccionar varias
                imágenes.
              </p>
            </div>
          </div>

          <label className="admin-upload">

            <input
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              onChange={
                manejarFotos
              }
            />

            <span>📷</span>

            <strong>
              Agregar fotos
            </strong>

            <small>
              JPG, PNG, WEBP, HEIC o HEIF
            </small>

          </label>

          {fotos.length > 0 && (
            <div className="admin-photo-grid">

              {fotos.map(
                (foto, index) => (
                  <div
                    className="admin-photo-preview"
                    key={`${foto.archivo.name}-${index}`}
                  >

                    <img
                      src={
                        foto.preview
                      }
                      alt="Vista previa"
                    />

                    {index === 0 && (
                      <span>
                        Portada
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        quitarFoto(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  </div>
                )
              )}

            </div>
          )}

          <p className="admin-photo-help">
            La primera foto será utilizada
            como portada. En el siguiente
            paso conectaremos estas imágenes
            con el almacenamiento de
            Supabase.
          </p>

        </div>

        {/* =================================================
            4. VISIBILIDAD
            ================================================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-title">
            <span>4</span>

            <div>
              <h2>
                Visibilidad
              </h2>

              <p>
                Elegí dónde aparecerá este
                peludito en la página.
              </p>
            </div>
          </div>

          <div className="admin-visibility-options">

            {/* ADOPCIONES */}

            <label className="admin-publish-toggle">

              <input
                type="checkbox"
                name="publicado"
                checked={
                  formulario.publicado
                }
                onChange={
                  manejarCambio
                }
              />

              <span className="admin-visibility-icon">
                🏠
              </span>

              <div>
                <strong>
                  Publicado en adopciones
                </strong>

                <small>
                  Si está activado,
                  aparecerá en el catálogo
                  público de adopciones.
                </small>
              </div>

            </label>

            {/* PADRINAZGO */}

            <label className="admin-publish-toggle">

              <input
                type="checkbox"
                name="apadrinable"
                checked={
                  formulario.apadrinable
                }
                onChange={
                  manejarCambio
                }
              />

              <span className="admin-visibility-icon">
                ❤️
              </span>

              <div>
                <strong>
                  Disponible para padrinazgo
                </strong>

                <small>
                  Si está activado,
                  aparecerá en Padrinos y
                  Madrinas para que puedan
                  colaborar con sus cuidados.
                </small>
              </div>

            </label>

          </div>

        </div>

        {/* =================================================
            ERROR
            ================================================= */}

        {error && (
          <div className="admin-form-error">

            <strong>
              No pudimos guardar.
            </strong>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* =================================================
            BOTONES
            ================================================= */}

        <div className="admin-form-actions">

          <Link
            to="/admin/peluditos"
            className="admin-cancel-button"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              guardando
            }
          >
            {guardando
              ? "Guardando..."
              : editando
                ? "Guardar cambios"
                : "🐾 Crear peludito"}
          </button>

        </div>

      </form>

    </section>
  );
};

export default AdminPeluditoForm;