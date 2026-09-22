import { useRef } from "react";
import Swal from "sweetalert2";

import { supabase } from "../lib/supabase.js";

import {
  prepararImagen,
} from "../utils/imageUtils.js";

import {
  subirFotoPeludito,
} from "../utils/peluditoFotos.js";

const CargaRapidaPeludito = ({
  className = "",
}) => {
  const inputCamaraRef = useRef(null);

  const abrirCargaRapida = () => {
    inputCamaraRef.current?.click();
  };

  /* =====================================================
     GENERAR CÓDIGO
     ===================================================== */

  const generarCodigo = async () => {
    const {
      data,
      error,
    } = await supabase
      .from("peluditos")
      .select("codigo")
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (error) {
      throw error;
    }

    if (!data?.length) {
      return "SFA-001";
    }

    const numeros = data.map(
      (item) => {
        const numero = Number(
          item.codigo?.replace(
            "SFA-",
            ""
          )
        );

        return Number.isFinite(numero)
          ? numero
          : 0;
      }
    );

    const siguiente =
      Math.max(...numeros, 0) + 1;

    return `SFA-${String(
      siguiente
    ).padStart(3, "0")}`;
  };

  /* =====================================================
     FOTO
     ===================================================== */

  const manejarFoto = async (e) => {
    const archivoOriginal =
      e.target.files?.[0];

    e.target.value = "";

    if (!archivoOriginal) {
      return;
    }

    let preview = null;

    try {
      Swal.fire({
        title: "Preparando foto...",
        text: "Procesando imagen.",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      const archivo =
        await prepararImagen(
          archivoOriginal
        );

      preview =
        URL.createObjectURL(
          archivo
        );

      Swal.close();

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 100)
      );

      await mostrarFormulario(
        archivo,
        preview
      );
    } catch (error) {
      console.error(
        "Error preparando imagen:",
        error
      );

      Swal.close();

      if (preview) {
        URL.revokeObjectURL(
          preview
        );
      }

      await Swal.fire({
        icon: "error",

        title:
          "No pudimos preparar la foto",

        text:
          error?.message ||
          "Probá nuevamente con otra imagen.",

        confirmButtonText:
          "Entendido",

        confirmButtonColor:
          "#8c1738",
      });
    }
  };

  /* =====================================================
     FORMULARIO
     ===================================================== */

  const mostrarFormulario = async (
    archivo,
    preview
  ) => {
    const resultado =
      await Swal.fire({
        title:
          "Nuevo peludito 🐾",

        html: `
          <div class="quick-dog-form">

            <img
              src="${preview}"
              class="quick-dog-preview"
              alt="Vista previa"
            />

            <label class="quick-label">
              Nombre *

              <input
                id="quick-nombre"
                class="swal2-input quick-input"
                placeholder="Ej: Manchita"
                autocomplete="off"
              />
            </label>

            <div class="quick-two-columns">

              <label class="quick-label">
                Sexo *

                <select
                  id="quick-sexo"
                  class="swal2-select quick-select"
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

              <label class="quick-label">
                Tamaño *

                <select
                  id="quick-tamano"
                  class="swal2-select quick-select"
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

            </div>

            <label class="quick-label">
              Edad aproximada

              <input
                id="quick-edad"
                type="number"
                min="0"
                class="swal2-input quick-input"
                placeholder="Ej: 4"
              />
            </label>

            <p class="quick-help">
              La ficha se creará como borrador.
              Después podés completar la historia,
              convivencia y agregar más fotos.
            </p>

          </div>
        `,

        showCancelButton: true,
        showConfirmButton: true,

        confirmButtonText:
          "🐾 Crear peludito",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#8c1738",

        cancelButtonColor:
          "#737e84",

        buttonsStyling: true,

        focusConfirm: false,

        width: 560,

        preConfirm: () => {
          const nombre =
            document
              .getElementById(
                "quick-nombre"
              )
              ?.value
              .trim();

          const sexo =
            document
              .getElementById(
                "quick-sexo"
              )
              ?.value;

          const tamano =
            document
              .getElementById(
                "quick-tamano"
              )
              ?.value;

          const edad =
            document
              .getElementById(
                "quick-edad"
              )
              ?.value;

          if (
            !nombre ||
            !sexo ||
            !tamano
          ) {
            Swal.showValidationMessage(
              "Completá nombre, sexo y tamaño."
            );

            return false;
          }

          return {
            nombre,
            sexo,
            tamano,

            edad:
              edad === ""
                ? null
                : Number(edad),
          };
        },
      });

    if (!resultado.isConfirmed) {
      URL.revokeObjectURL(
        preview
      );

      return;
    }

    let peluditoCreado = null;

    try {
      /* =================================================
         GENERAR CÓDIGO
         ================================================= */

      const codigo =
        await generarCodigo();

      /* =================================================
         CREAR PELUDITO
         ================================================= */

      const {
        data: peludito,
        error,
      } = await supabase
        .from("peluditos")
        .insert({
          codigo,

          nombre:
            resultado.value.nombre,

          edad:
            resultado.value.edad,

          sexo:
            resultado.value.sexo,

          tamano:
            resultado.value.tamano,

          energia: null,

          descripcion: "",

          apto_perros: false,
          apto_gatos: false,
          apto_ninos: false,

          estado:
            "En adopción",

          publicado: false,

          updated_at:
            new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      peluditoCreado =
        peludito;

      /* =================================================
         SUBIR FOTO
         ================================================= */

      await subirFotoPeludito({
        peluditoId:
          peludito.id,

        archivo,

        principal: true,

        orden: 0,
      });

      /* =================================================
         TERMINAR
         ================================================= */

      URL.revokeObjectURL(
        preview
      );

      await Swal.fire({
        icon: "success",

        title:
          `${peludito.nombre} fue creado 🐾`,

        html: `
          <p>
            La ficha y la fotografía
            se guardaron correctamente.
          </p>

          <p
            style="
              margin-top:10px;
              color:#777;
              font-size:14px;
            "
          >
            Quedó como borrador.
            Podés completar el resto
            de la información desde Editar.
          </p>
        `,

        confirmButtonText:
          "Perfecto",

        confirmButtonColor:
          "#8c1738",
      });

      window.location.reload();
    } catch (error) {
      console.error(
        "Error creando peludito:",
        error
      );

      /*
       * Si alcanzamos a crear el peludito
       * pero falló la foto, eliminamos
       * el registro para no dejar una
       * carga rápida incompleta.
       */

      if (peluditoCreado?.id) {
        const {
          error: rollbackError,
        } = await supabase
          .from("peluditos")
          .delete()
          .eq(
            "id",
            peluditoCreado.id
          );

        if (rollbackError) {
          console.error(
            "No se pudo revertir el peludito:",
            rollbackError
          );
        }
      }

      URL.revokeObjectURL(
        preview
      );

      await Swal.fire({
        icon: "error",

        title:
          "No pudimos crear el peludito",

        text:
          error?.message ||
          "Ocurrió un error al guardar la ficha o la fotografía.",

        confirmButtonText:
          "Entendido",

        confirmButtonColor:
          "#8c1738",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className={
          `admin-camera-button ${className}`.trim()
        }
        onClick={
          abrirCargaRapida
        }
      >
        📷 Carga rápida
      </button>

      <input
        ref={
          inputCamaraRef
        }
        type="file"
        accept="image/*,.heic,.heif"
        capture="environment"
        onChange={
          manejarFoto
        }
        style={{
          display: "none",
        }}
      />
    </>
  );
};

export default CargaRapidaPeludito;