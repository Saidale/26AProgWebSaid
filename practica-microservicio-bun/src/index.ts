import client from "./db.ts";
import { logRequest } from "./loggers.ts";
import { validarUsuario } from "./validaciones.ts";

// Definimos la estructura de los datos que esperamos recibir
interface UsuarioBody {
    nombre: string;
}

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        // 1. Registrar la petición en la consola
        logRequest(req);

        const url = new URL(req.url);
        const method = req.method;
        const path = url.pathname;

        // 2. Endpoint /health para verificar que el servidor está vivo
        if (method === "GET" && path === "/health") {
            return Response.json({ status: "OK", uptime: process.uptime() });
        }

        // 3. GET /usuarios - Obtener todos los usuarios
        if (method === "GET" && path === "/usuarios") {
            try {
                const result = await client.query("SELECT * FROM usuarios ORDER BY id ASC");
                return Response.json(result.rows);
            } catch (error) {
                console.error("Error en BD:", error);
                return new Response("Error interno del servidor", { status: 500 });
            }
        }

        // 4. PUT /usuarios/:id - Actualizar un usuario existente
        // Usamos una expresión regular para detectar rutas como /usuarios/1, /usuarios/2, etc.
        const putMatch = path.match(/^\/usuarios\/(\d+)$/);
        
        if (method === "PUT" && putMatch) {
            const id = putMatch[1]; // El ID extraído de la URL

            try {
                // Obtenemos el JSON del cuerpo de la petición
                const body = await req.json() as UsuarioBody;

                // Validamos que el nombre sea correcto
                const errores = validarUsuario(body);
                if (errores.length > 0) {
                    return Response.json({ errores }, { status: 400 });
                }

                // Ejecutamos el UPDATE solo para el campo 'nombre'
                const result = await client.query(
                    "UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *",
                    [body.nombre, id]
                );

                // Si no se actualizó ninguna fila, significa que el ID no existe
                if (result.rowCount === 0) {
                    return Response.json({ mensaje: "Usuario no encontrado" }, { status: 404 });
                }

                // Devolvemos el usuario ya actualizado
                return Response.json(result.rows[0]);

            } catch (error) {
                console.error("Error procesando la solicitud:", error);
                return Response.json({ error: "Datos inválidos o malformados" }, { status: 400 });
            }
        }

        // 5. Manejo de rutas no encontradas (404)
        return new Response("Not Found", { status: 404 });
    }
});

console.log(`El servidor está corriendo en: http://127.0.0.1:${server.port}`);