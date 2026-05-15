export function validarUsuario(data: any) {
    const errores = [];

    if (!data.nombre || typeof data.nombre !== "string" || data.nombre.trim() === "") {
        errores.push("El campo 'nombre' es requerido y debe ser texto.");
    }

    // Eliminamos la validación del email porque tu tabla no lo requiere

    return errores;
}