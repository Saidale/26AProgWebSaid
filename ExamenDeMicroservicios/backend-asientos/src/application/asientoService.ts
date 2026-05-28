import type { Asiento } from "../domain/Asiento";
import { AsientoRepository } from "../infrastructure/asientoRepository";

export class AsientoService {
  private repository: AsientoRepository;

  constructor() {
    this.repository = new AsientoRepository();
  }

  async listarAsientos(): Promise<Asiento[]> {
    return await this.repository.obtenerTodos();
  }

  async buscarAsiento(id: number): Promise<Asiento | null> {
    return await this.repository.obtenerPorId(id);
  }

  async crearAsiento(data: Asiento): Promise<Asiento> {
    if (!data.nombre_usuario || !data.nombre_producto || data.cantidad === undefined) {
      throw new Error("El nombre de usuario, producto y cantidad son obligatorios");
    }

    if (data.cantidad <= 0) {
      throw new Error("La cantidad de asientos debe ser mayor a cero");
    }

    return await this.repository.crear(data);
  }

  async actualizarAsiento(id: number, data: Asiento): Promise<Asiento | null> {
    if (!data.nombre_usuario || !data.nombre_producto || data.cantidad === undefined) {
      throw new Error("El nombre de usuario, producto y cantidad son obligatorios");
    }

    if (data.cantidad <= 0) {
      throw new Error("La cantidad de asientos debe ser mayor a cero");
    }

    return await this.repository.actualizar(id, data);
  }

  async eliminarAsiento(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
  }
}