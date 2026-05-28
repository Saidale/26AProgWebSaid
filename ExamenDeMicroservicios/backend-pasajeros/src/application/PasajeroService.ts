import type { Pasajero } from "../domain/Pasajero";
import { PasajeroRepository } from "../infrastructure/PasajeroRepository";

export class PasajeroService {
  private repository: PasajeroRepository;

  constructor() {
    this.repository = new PasajeroRepository();
  }

  async listarPasajeros(): Promise<Pasajero[]> {
    return await this.repository.obtenerTodos();
  }

  async buscarPasajero(id: number): Promise<Pasajero | null> {
    return await this.repository.obtenerPorId(id);
  }

  async crearPasajero(data: Pasajero): Promise<Pasajero> {
    if (!data.nombre || !data.correo) {
      throw new Error("El nombre y el correo son obligatorios");
    }

    return await this.repository.crear(data);
  }

  async actualizarPasajero(id: number, data: Pasajero): Promise<Pasajero | null> {
    if (!data.nombre || !data.correo) {
      throw new Error("El nombre y el correo son obligatorios");
    }

    return await this.repository.actualizar(id, data);
  }

  async eliminarPasajero(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
  }
}