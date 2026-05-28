import { VueloService } from "../application/vueloService";
import type { Vuelo } from "../domain/Vuelo";

const vueloService = new VueloService();

export async function manejarRutasVuelos(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const metodo = req.method;
  const partes = url.pathname.split("/").filter(Boolean);

  // Manejar el preflight request de CORS automáticamente
  if (metodo === "OPTIONS") {
    return respuestaJSON(null, 204);
  }

  if (partes[0] !== "vuelos") {
    return respuestaJSON({ mensaje: "Ruta no encontrada" }, 404);
  }

  try {
    // 1. GET /vuelos (Listar todos)
    if (metodo === "GET" && partes.length === 1) {
      const vuelos = await vueloService.listarVuelos();
      return respuestaJSON(vuelos);
    }

    // 2. GET /vuelos/:id (Buscar por ID)
    if (metodo === "GET" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const vuelo = await vueloService.buscarVuelo(id);

      if (!vuelo) {
        return respuestaJSON({ mensaje: "Vuelo no encontrado" }, 404);
      }

      return respuestaJSON(vuelo);
    }

    // 3. POST /vuelos (Crear nuevo)
    if (metodo === "POST" && partes.length === 1) {
      const body = await req.json() as Vuelo;
      const nuevoVuelo = await vueloService.crearVuelo(body);
      return respuestaJSON(nuevoVuelo, 201);
    }

    // 4. PUT /vuelos/:id (Actualizar por ID)
    if (metodo === "PUT" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const body = await req.json() as Vuelo;
      const vueloActualizado = await vueloService.actualizarVuelo(id, body);

      if (!vueloActualizado) {
        return respuestaJSON({ mensaje: "Vuelo no encontrado" }, 404);
      }

      return respuestaJSON(vueloActualizado);
    }

    // 5. DELETE /vuelos/:id (Eliminar por ID)
    if (metodo === "DELETE" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const eliminado = await vueloService.eliminarVuelo(id);

      if (!eliminado) {
        return respuestaJSON({ mensaje: "Vuelo no encontrado" }, 404);
      }

      return respuestaJSON({ mensaje: "Vuelo eliminado correctamente" });
    }

    return respuestaJSON({ mensaje: "Método no permitido" }, 405);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error interno del servidor";
    return respuestaJSON({ error: mensaje }, 500);
  }
}

export function respuestaJSON(data: unknown, status = 200): Response {
  return new Response(data === null ? null : JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}