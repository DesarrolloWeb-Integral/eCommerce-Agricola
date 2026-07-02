import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import { Pedido } from '../../domain/entities/pedido'
import { PedidoFactory } from '../../domain/services/pedido.factory'
import {
  PEDIDO_REPOSITORY_PORT,
  type PedidoRepositoryPort,
} from '../../ports/out/pedido-repository.port'
import {
  PRODUCTO_CONSULTA_PORT,
  type ProductoConsultaPort,
  type ProductoParaPedido,
} from '../../ports/out/producto-consulta.port'
import { RegistrarLogUseCase } from 'src/modules/auditoria/application/use-cases/registrar-log.use-case'

export interface CrearPedidoItemInput {
  productId: string
  quantity: number
}

export interface CrearPedidoInput {
  clientId: string
  items: CrearPedidoItemInput[]
}

@Injectable()
export class CrearPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY_PORT)
    private readonly pedidoRepository: PedidoRepositoryPort,
    @Inject(PRODUCTO_CONSULTA_PORT)
    private readonly productoConsulta: ProductoConsultaPort,
    private readonly registrarLogUseCase: RegistrarLogUseCase
  ) {}

  async execute(input: CrearPedidoInput): Promise<Pedido> {
    this.validarItems(input.items)

    const productos = await this.obtenerProductos(input.items)
    const producerProfileId = this.obtenerProducerProfileIdUnico(productos)
    const reservas: CrearPedidoItemInput[] = []

    try {
      for (const item of input.items) {
        const producto = productos.get(item.productId)

        if (!producto) {
          throw new NotFoundException('El producto solicitado no existe.')
        }

        const stockReservado = await this.productoConsulta.reservarStock(producto.id, item.quantity)

        if (!stockReservado) {
          throw new BadRequestException(
            'La cantidad solicitada supera el stock disponible o el producto ya no esta disponible.'
          )
        }

        reservas.push({
          productId: producto.id,
          quantity: item.quantity,
        })
      }

      const pedido = PedidoFactory.crear({
        id: randomUUID(),
        clientId: input.clientId,
        producerProfileId,
        items: input.items.map((item) => {
          const producto = productos.get(item.productId)

          if (!producto) {
            throw new NotFoundException('El producto solicitado no existe.')
          }

          return {
            productId: producto.id,
            quantity: item.quantity,
            unitPrice: producto.precio,
          }
        }),
      })

      const pedidoGuardado = await this.pedidoRepository.save(pedido)

      await this.registrarLogUseCase.execute({
        usuarioId: input.clientId,
        accion: 'CREAR_PEDIDO',
        recursoAfectado: `Pedido:${pedidoGuardado.id}`,
        detalle: `Pedido solicitado al productor Profile:${producerProfileId} con ${input.items.length} productos.`,
      })

      return pedidoGuardado
    } catch (error) {
      await this.liberarReservas(reservas)
      throw error
    }
  }

  private validarItems(items: CrearPedidoItemInput[]): void {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('El pedido debe incluir al menos un producto.')
    }

    const productIds = new Set<string>()

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException(
          'La cantidad del pedido debe ser un numero entero mayor a cero.'
        )
      }

      if (productIds.has(item.productId)) {
        throw new BadRequestException('No repitas productos dentro del mismo pedido.')
      }

      productIds.add(item.productId)
    }
  }

  private async obtenerProductos(
    items: CrearPedidoItemInput[]
  ): Promise<Map<string, ProductoParaPedido>> {
    const productos = await Promise.all(
      items.map(async (item) => ({
        productId: item.productId,
        producto: await this.productoConsulta.findById(item.productId),
      }))
    )

    const productosPorId = new Map<string, ProductoParaPedido>()

    for (const { productId, producto } of productos) {
      if (!producto) {
        throw new NotFoundException('El producto solicitado no existe.')
      }

      if (!producto.disponible) {
        throw new BadRequestException('El producto solicitado no esta disponible.')
      }

      productosPorId.set(productId, producto)
    }

    return productosPorId
  }

  private obtenerProducerProfileIdUnico(productos: Map<string, ProductoParaPedido>): string {
    const producerProfileIds = new Set(
      Array.from(productos.values()).map((producto) => producto.producerProfileId)
    )

    if (producerProfileIds.size !== 1) {
      throw new BadRequestException(
        'Todos los productos del pedido deben pertenecer al mismo productor.'
      )
    }

    const [producerProfileId] = producerProfileIds

    if (!producerProfileId) {
      throw new BadRequestException('El pedido debe incluir productos validos.')
    }

    return producerProfileId
  }

  private async liberarReservas(reservas: CrearPedidoItemInput[]): Promise<void> {
    await Promise.allSettled(
      reservas.map((reserva) =>
        this.productoConsulta.liberarStock(reserva.productId, reserva.quantity)
      )
    )
  }
}
