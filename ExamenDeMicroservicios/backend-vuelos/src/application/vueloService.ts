import type { Vuelo } from "../domain/Vuelo";
import { VueloRepository } from "../infrastructure/vueloRepository";

export class VueloService {
  private repository: VueloRepository;

  constructor() {
    this.repository = new VueloRepository();
  }

  async listarVuelos(): Promise<Vuelo[]> {
    return await this.repository.obtenerTodos();
  }

  async buscarVuelo(id: number): Promise<Vuelo | null> {
    return await this.repository.obtenerPorId(id);
  }

  async crearVuelo(data: Vuelo): Promise<Vuelo> {
    if (!data.nombre || data.precio === undefined || data.stock === undefined) {
      throw new Error("El nombre, precio y stock son obligatorios");
    }

    if (data.precio < 0 || data.stock < 0) {
      throw new Error("El precio y el stock no pueden ser valores negativos");
    }

    return await this.repository.crear(data);
  }

  async actualizarVuelo(id: number, data: Vuelo): Promise<Vuelo | null> {
    if (!data.nombre || data.precio === undefined || data.stock === undefined) {
      throw new Error("El nombre, precio y stock son obligatorios");
    }

    if (data.precio < 0 || data.stock < 0) {
      throw new Error("El precio y el stock no pueden ser valores negativos");
    }

    return await this.repository.actualizar(id, data);
  }

  async eliminarVuelo(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
  }
}