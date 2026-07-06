export class Conversacion {
  constructor(
    public readonly id: string,
    public readonly clienteId: string,
    public readonly producerProfileId: string,
    public readonly productoId: string | null,
    public readonly pedidoId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  perteneceACliente(usuarioId: string): boolean {
    return this.clienteId === usuarioId
  }
}
