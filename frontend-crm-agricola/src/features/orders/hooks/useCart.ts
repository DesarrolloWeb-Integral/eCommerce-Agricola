import { useCallback, useEffect, useMemo, useState } from 'react';

import { CART_CHANGED_EVENT, cartService } from '../services';
import type { CartItem, CartProduct } from '../types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => cartService.getItems());

  const refreshCart = useCallback(() => {
    setItems(cartService.getItems());
  }, []);

  useEffect(() => {
    window.addEventListener(CART_CHANGED_EVENT, refreshCart);
    window.addEventListener('storage', refreshCart);

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, refreshCart);
      window.removeEventListener('storage', refreshCart);
    };
  }, [refreshCart]);

  const groups = useMemo(() => cartService.groupByProducer(items), [items]);
  const summary = useMemo(() => cartService.getSummary(items), [items]);

  const addItem = useCallback((product: CartProduct, quantity: number) => {
    setItems(cartService.addItem(product, quantity));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(cartService.updateQuantity(productId, quantity));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(cartService.removeItem(productId));
  }, []);

  const clearProducerGroup = useCallback((producerProfileId: string) => {
    setItems(cartService.clearProducerGroup(producerProfileId));
  }, []);

  const clearCart = useCallback(() => {
    setItems(cartService.clear());
  }, []);

  return {
    items,
    groups,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clearProducerGroup,
    clearCart,
  };
}
