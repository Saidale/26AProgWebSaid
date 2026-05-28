import { AsientoService } from "../application/asientoService";
import type { Asiento } from "../domain/Asiento";

const asientoService = new AsientoService();

export async function manejarRutasAsientos(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const metodo = req.method;
  const partes = url.pathname.split("/").filter(Boolean);

  if (req.method === "OPTIONS") {
    return respuestaJSON(null, 204);
  }

  if (partes[0] !== "asientos") {
    return respuestaJSON({ mensaje: "Ruta no encontrada" }, 404);
  }

  try {
    if (metodo === "GET" && partes.length === 1) {
      const asientos = await asientoService.listarAsientos();
      return respuestaJSON(asientos);
    }

    if (metodo === "GET" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const asiento = await asientoService.buscarAsiento(id);

      if (!asiento) {
        return respuestaJSON({ mensaje: "Asiento no encontrado" }, 404);
      }

      return respuestaJSON(asiento);
    }

    if (metodo === "POST" && partes.length === 1) {
      const body = await req.json() as Asiento;
      const nuevoAsiento = await asientoService.crearAsiento(body);
      return respuestaJSON(nuevoAsiento, 201);
    }

    if (metodo === "PUT" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const body = await req.json() as Asiento;
      const asientoActualizado = await asientoService.actualizarAsiento(id, body);

      if (!asientoActualizado) {
        return respuestaJSON({ mensaje: "Asiento no encontrado" }, 404);
      }

      return respuestaJSON(asientoActualizado);
    }

    if (metodo === "DELETE" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const eliminado = await asientoService.eliminarAsiento(id);

      if (!eliminado) {
        return respuestaJSON({ mensaje: "Asiento no encontrado" }, 404);
      }

      return respuestaJSON({ mensaje: "Asiento eliminado correctamente" });
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