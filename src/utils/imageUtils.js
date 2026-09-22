import heic2any from "heic2any";

export const esImagenHeic = (archivo) => {
  if (!archivo) return false;

  const nombre = archivo.name?.toLowerCase() || "";
  const tipo = archivo.type?.toLowerCase() || "";

  return (
    tipo === "image/heic" ||
    tipo === "image/heif" ||
    nombre.endsWith(".heic") ||
    nombre.endsWith(".heif")
  );
};

export const prepararImagen = async (archivo) => {
  if (!archivo) {
    throw new Error("No se recibió ninguna imagen.");
  }

  if (!esImagenHeic(archivo)) {
    return archivo;
  }

  const resultado = await heic2any({
    blob: archivo,
    toType: "image/jpeg",
    quality: 0.85,
  });

  const blobConvertido = Array.isArray(resultado)
    ? resultado[0]
    : resultado;

  const nombreOriginal =
    archivo.name || "foto.heic";

  const nombreNuevo = nombreOriginal.replace(
    /\.(heic|heif)$/i,
    ".jpg"
  );

  return new File(
    [blobConvertido],
    nombreNuevo,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
};