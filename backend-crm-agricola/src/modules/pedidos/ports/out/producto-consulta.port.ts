export interface ProductoParaPedido {
  id: string
  producerProfileId: string
  precio: number
  cantidad: number
  disponible: boolean
}

export const PRODUCTO_CONSULTA_PORT = Symbol('PRODUCTO_CONSULTA_PORT')

export interface ProductoConsultaPort {
  findById(id: string): Promise<ProductoParaPedido | null>
  reservarStock(id: string, quantity: number): Promise<boolean>
  liberarStock(id: string, quantity: number): Promise<void>
}
