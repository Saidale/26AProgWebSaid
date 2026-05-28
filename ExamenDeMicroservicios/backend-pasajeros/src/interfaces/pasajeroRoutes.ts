import { PasajeroService } from "../application/PasajeroService";
import type { Pasajero } from "../domain/Pasajero";

const pasajeroService = new PasajeroService();

export async function manejarRutasPasajeros(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const metodo = req.method;
  const partes = url.pathname.split("/").filter(Boolean);

  if (partes[0] !== "pasajeros") {
    return respuestaJSON({ mensaje: "Ruta no encontrada" }, 404);
  }

  try {
    if (metodo === "GET" && partes.length === 1) {
      const pasajeros = await pasajeroService.listarPasajeros();
      return respuestaJSON(pasajeros);
    }

    if (metodo === "GET" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const pasajero = await pasajeroService.buscarPasajero(id);

      if (!pasajero) {
        return respuestaJSON({ mensaje: "Pasajero no encontrado" }, 404);
      }

      return respuestaJSON(pasajero);
    }

    if (metodo === "POST" && partes.length === 1) {
      const body = await req.json() as Pasajero;
      const nuevoPasajero = await pasajeroService.crearPasajero(body);
      return respuestaJSON(nuevoPasajero, 201);
    }

    if (metodo === "PUT" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const body = await req.json() as Pasajero;
      const pasajeroActualizado = await pasajeroService.actualizarPasajero(id, body);

      if (!pasajeroActualizado) {
        return respuestaJSON({ mensaje: "Pasajero no encontrado" }, 404);
      }

      return respuestaJSON(pasajeroActualizado);
    }

    if (metodo === "DELETE" && partes.length === 2) {
      const id = Number(partes[1]);

      if (Number.isNaN(id)) {
        return respuestaJSON({ mensaje: "ID inválido" }, 400);
      }

      const eliminado = await pasajeroService.eliminarPasajero(id);

      if (!eliminado) {
        return respuestaJSON({ mensaje: "Pasajero no encontrado" }, 404);
      }

      return respuestaJSON({ mensaje: "Pasajero eliminado correctamente" });
    }

    return respuestaJSON({ mensaje: "Método no permitido" }, 405);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error interno del servidor";
    return respuestaJSON({ error: mensaje }, 500);
  }
}

export function respuestaJSON(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}