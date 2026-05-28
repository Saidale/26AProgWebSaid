import { pool } from "./db";
import type { Vuelo } from "../domain/Vuelo";

export class VueloRepository {
  async obtenerTodos(): Promise<Vuelo[]> {
    const resultado = await pool.query(
      "SELECT id, nombre, precio, stock, fecha_creacion FROM vuelos ORDER BY id ASC"
    );

    return resultado.rows;
  }

  async obtenerPorId(id: number): Promise<Vuelo | null> {
    const resultado = await pool.query(
      "SELECT id, nombre, precio, stock, fecha_creacion FROM vuelos WHERE id = $1",
      [id]
    );

    return resultado.rows[0] || null;
  }

  async crear(vuelo: Vuelo): Promise<Vuelo> {
    const resultado = await pool.query(
      "INSERT INTO vuelos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING id, nombre, precio, stock, fecha_creacion",
      [vuelo.nombre, vuelo.precio, vuelo.stock]
    );

    return resultado.rows[0];
  }

  async actualizar(id: number, vuelo: Vuelo): Promise<Vuelo | null> {
    const resultado = await pool.query(
      "UPDATE vuelos SET nombre = $1, precio = $2, stock = $3 WHERE id = $4 RETURNING id, nombre, precio, stock, fecha_creacion",
      [vuelo.nombre, vuelo.precio, vuelo.stock, id]
    );

    return resultado.rows[0] || null;
  }

  async eliminar(id: number): Promise<boolean> {
    const resultado = await pool.query(
      "DELETE FROM vuelos WHERE id = $1",
      [id]
    );

    return (resultado.rowCount || 0) > 0;
  }
}