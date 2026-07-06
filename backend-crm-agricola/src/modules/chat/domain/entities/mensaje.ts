export class Mensaje {
  constructor(
    public readonly id: string,
    public readonly conversacionId: string,
    public readonly remitenteId: string,
    public readonly contenido: string,
    public readonly createdAt: Date
  ) {}
}
