export interface VueloProps {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  fecha_creacion?: Date;
}

export class Vuelo {
  public readonly id?: number;
  public readonly nombre: string;
  public readonly precio: number;
  public readonly stock: number;
  public readonly fecha_creacion?: Date;

  constructor(props: VueloProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.precio = props.precio;
    this.stock = props.stock;
    this.fecha_creacion = props.fecha_creacion;
  }
}