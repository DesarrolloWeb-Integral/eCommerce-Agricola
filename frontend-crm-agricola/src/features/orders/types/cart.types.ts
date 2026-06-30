import type { CategoriaProducto } from '../../products/types/producto.types';

export interface CartProduct {
  productId: string;
  producerProfileId: string;
  producerName?: string;
  name: string;
  category: CategoriaProducto;
  unitPrice: number;
  availableQuantity: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
  addedAt: string;
}

export interface CartProducerGroup {
  producerProfileId: string;
  producerName?: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalGroups: number;
  subtotal: number;
}
