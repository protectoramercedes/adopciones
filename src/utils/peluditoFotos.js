import { supabase } from "../lib/supabase.js";

export const subirFotoPeludito = async ({
  peluditoId,
  archivo,
  principal = false,
  orden = 0,
}) => {
  if (!peluditoId) {
    throw new Error(
      "No se recibió el ID del peludito."
    );
  }

  if (!archivo) {
    throw new Error(
      "No se recibió ninguna imagen."
    );
  }

  const extension =
    archivo.name
      ?.split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const nombreArchivo =
    `${Date.now()}-${orden}.${extension}`;

  const ruta =
    `${peluditoId}/${nombreArchivo}`;

  // SUBIR A STORAGE

  const {
    error: storageError,
  } = await supabase.storage
    .from("peluditos")
    .upload(
      ruta,
      archivo,
      {
        cacheControl: "3600",
        upsert: false,
        contentType:
          archivo.type ||
          "image/jpeg",
      }
    );

  if (storageError) {
    throw storageError;
  }

  // OBTENER URL PÚBLICA

  const {
    data: urlData,
  } = supabase.storage
    .from("peluditos")
    .getPublicUrl(ruta);

  const url =
    urlData?.publicUrl;

  if (!url) {
    await supabase.storage
      .from("peluditos")
      .remove([ruta]);

    throw new Error(
      "No pudimos obtener la URL pública de la foto."
    );
  }

  // GUARDAR EN peludito_fotos

  const {
    data: foto,
    error: fotoError,
  } = await supabase
    .from("peludito_fotos")
    .insert({
      peludito_id: peluditoId,
      url,
      principal,
      orden,
    })
    .select()
    .single();

  if (fotoError) {
    // Si falla la BD,
    // limpiamos el archivo subido.

    await supabase.storage
      .from("peluditos")
      .remove([ruta]);

    throw fotoError;
  }

  return foto;
};