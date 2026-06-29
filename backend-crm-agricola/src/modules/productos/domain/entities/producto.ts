export class Producto {
  constructor(
    public readonly id: string,
    public readonly producerProfileId: string,
    public nombre: string,
    public descripcion: string,
    public categoria: string,
    public precio: number,
    public cantidad: number,
    public disponible: boolean,
    public readonly creadoEn: Date,
    public actualizadoEn: Date
  ) {}
}
