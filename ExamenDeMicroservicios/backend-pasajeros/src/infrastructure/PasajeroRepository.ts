import { pool } from "./db";
import type { Pasajero } from "../domain/Pasajero";

export class PasajeroRepository {
  async obtenerTodos(): Promise<Pasajero[]> {
    const resultado = await pool.query(
      "SELECT id, nombre, correo, fecha_creacion FROM pasajeros ORDER BY id ASC"
    );

    return resultado.rows;
  }

  async obtenerPorId(id: number): Promise<Pasajero | null> {
    const resultado = await pool.query(
      "SELECT id, nombre, correo, fecha_creacion FROM pasajeros WHERE id = $1",
      [id]
    );

    return resultado.rows[0] || null;
  }

  async crear(pasajero: Pasajero): Promise<Pasajero> {
    const resultado = await pool.query(
      "INSERT INTO pasajeros (nombre, correo) VALUES ($1, $2) RETURNING id, nombre, correo, fecha_creacion",
      [pasajero.nombre, pasajero.correo]
    );

    return resultado.rows[0];
  }

  async actualizar(id: number, pasajero: Pasajero): Promise<Pasajero | null> {
    const resultado = await pool.query(
      "UPDATE pasajeros SET nombre = $1, correo = $2 WHERE id = $3 RETURNING id, nombre, correo, fecha_creacion",
      [pasajero.nombre, pasajero.correo, id]
    );

    return resultado.rows[0] || null;
  }

  async eliminar(id: number): Promise<boolean> {
    const resultado = await pool.query(
      "DELETE FROM pasajeros WHERE id = $1",
      [id]
    );

    return (resultado.rowCount || 0) > 0;
  }
}