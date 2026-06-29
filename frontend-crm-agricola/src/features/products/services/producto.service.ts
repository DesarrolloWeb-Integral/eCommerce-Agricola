import { apiClient } from '../../../services/api-client';
import type { Producto } from '../types/producto.types';

export async function registrarProducto(data: object): Promise<Producto> {
  return apiClient<Producto>('/productos', {
    method: 'POST',
    body: data,
    requiresAuth: true,
  });
}

export async function editarProducto(id: string, data: object): Promise<Producto> {
  return apiClient<Producto>(`/productos/${id}`, {
    method: 'PATCH',
    body: data,
    requiresAuth: true,
  });
}

export async function eliminarProducto(id: string): Promise<void> {
  await apiClient<unknown>(`/productos/${id}`, {
    method: 'DELETE',
    requiresAuth: true,
  });
}

export async function getMisProductos(): Promise<Producto[]> {
  return apiClient<Producto[]>('/productos/mis-productos', {
    requiresAuth: true,
  });
}

export async function getProductosDisponibles(): Promise<Producto[]> {
  return apiClient<Producto[]>('/productos');
}

export async function buscarProductos(q: string): Promise<Producto[]> {
  return apiClient<Producto[]>(`/productos/buscar?q=${encodeURIComponent(q)}`);
}
