import { apiClient } from '../../../services';
import type { CreateOrderRequest, Order } from '../types';

export function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  return apiClient<Order>('/pedidos', {
    method: 'POST',
    body: orderData,
    requiresAuth: true,
  });
}

export function getMyOrders(): Promise<Order[]> {
  return apiClient<Order[]>('/pedidos/mis-pedidos', {
    method: 'GET',
    requiresAuth: true,
  });
}

export function getOrdersForMyProducts(): Promise<Order[]> {
  return apiClient<Order[]>('/pedidos/mis-productos', {
    method: 'GET',
    requiresAuth: true,
  });
}

export function cancelOrder(orderId: string): Promise<Order> {
  return apiClient<Order>(`/pedidos/${encodeURIComponent(orderId)}/cancelar`, {
    method: 'PATCH',
    requiresAuth: true,
  });
}

export function confirmOrder(orderId: string): Promise<Order> {
  return apiClient<Order>(`/pedidos/${encodeURIComponent(orderId)}/confirmar`, {
    method: 'PATCH',
    requiresAuth: true,
  });
}
