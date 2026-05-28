import { pool } from "./db";
import type { Asiento } from "../domain/Asiento";

export class AsientoRepository {
  async obtenerTodos(): Promise<Asiento[]> {
    const resultado = await pool.query(
      "SELECT id, nombre_usuario, nombre_producto, cantidad, fecha_creacion FROM asientos ORDER BY id ASC"
    );

    return resultado.rows;
  }

  async obtenerPorId(id: number): Promise<Asiento | null> {
    const resultado = await pool.query(
      "SELECT id, nombre_usuario, nombre_producto, cantidad, fecha_creacion FROM asientos WHERE id = $1",
      [id]
    );

    return resultado.rows[0] || null;
  }

  async crear(asiento: Asiento): Promise<Asiento> {
    const resultado = await pool.query(
      "INSERT INTO asientos (nombre_usuario, nombre_producto, cantidad) VALUES ($1, $2, $3) RETURNING id, nombre_usuario, nombre_producto, cantidad, fecha_creacion",
      [asiento.nombre_usuario, asiento.nombre_producto, asiento.cantidad]
    );

    return resultado.rows[0];
  }

  async actualizar(id: number, asiento: Asiento): Promise<Asiento | null> {
    const resultado = await pool.query(
      "UPDATE asientos SET nombre_usuario = $1, nombre_producto = $2, cantidad = $3 WHERE id = $4 RETURNING id, nombre_usuario, nombre_producto, cantidad, fecha_creacion",
      [asiento.nombre_usuario, asiento.nombre_producto, asiento.cantidad, id]
    );

    return resultado.rows[0] || null;
  }

  async eliminar(id: number): Promise<boolean> {
    const resultado = await pool.query(
      "DELETE FROM asientos WHERE id = $1",
      [id]
    );

    return (resultado.rowCount || 0) > 0;
  }
}