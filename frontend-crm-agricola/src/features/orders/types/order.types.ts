export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  clientId: string;
  producerProfileId: string;
  items: OrderItem[];
  subtotal: number;
  estado: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
