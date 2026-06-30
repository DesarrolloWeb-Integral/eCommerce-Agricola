import type { CartItem, CartProducerGroup, CartProduct, CartSummary } from '../types';

const CART_STORAGE_KEY = 'agro-shopping-cart-v1';
export const CART_CHANGED_EVENT = 'agro-shopping-cart-changed';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;

  const item = value as Partial<CartItem>;

  return (
    typeof item.productId === 'string' &&
    typeof item.producerProfileId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.category === 'string' &&
    typeof item.unitPrice === 'number' &&
    typeof item.availableQuantity === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.addedAt === 'string'
  );
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function normalizeQuantity(quantity: number, availableQuantity: number): number {
  if (!Number.isInteger(quantity) || quantity <= 0) return 1;

  return Math.min(quantity, Math.max(availableQuantity, 1));
}

function notifyCartChanged(): void {
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

export const cartService = {
  getItems(): CartItem[] {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) return [];

    try {
      const parsedCart: unknown = JSON.parse(rawCart);

      return Array.isArray(parsedCart) ? parsedCart.filter(isCartItem) : [];
    } catch {
      return [];
    }
  },

  setItems(items: CartItem[]): CartItem[] {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    notifyCartChanged();

    return items;
  },

  addItem(product: CartProduct, quantity: number): CartItem[] {
    const items = this.getItems();
    const existingItem = items.find((item) => item.productId === product.productId);
    const requestedQuantity = normalizeQuantity(quantity, product.availableQuantity);

    if (existingItem) {
      return this.setItems(
        items.map((item) =>
          item.productId === product.productId
            ? {
                ...item,
                ...product,
                quantity: normalizeQuantity(
                  item.quantity + requestedQuantity,
                  product.availableQuantity
                ),
              }
            : item
        )
      );
    }

    return this.setItems([
      ...items,
      {
        ...product,
        quantity: requestedQuantity,
        addedAt: new Date().toISOString(),
      },
    ]);
  },

  updateQuantity(productId: string, quantity: number): CartItem[] {
    const items = this.getItems();

    return this.setItems(
      items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: normalizeQuantity(quantity, item.availableQuantity),
            }
          : item
      )
    );
  },

  removeItem(productId: string): CartItem[] {
    return this.setItems(this.getItems().filter((item) => item.productId !== productId));
  },

  clearProducerGroup(producerProfileId: string): CartItem[] {
    return this.setItems(
      this.getItems().filter((item) => item.producerProfileId !== producerProfileId)
    );
  },

  clear(): CartItem[] {
    return this.setItems([]);
  },

  groupByProducer(items: CartItem[]): CartProducerGroup[] {
    const groups = new Map<string, CartItem[]>();

    for (const item of items) {
      const currentItems = groups.get(item.producerProfileId) ?? [];
      groups.set(item.producerProfileId, [...currentItems, item]);
    }

    return Array.from(groups.entries()).map(([producerProfileId, groupItems]) => {
      const subtotal = groupItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const totalItems = groupItems.reduce((sum, item) => sum + item.quantity, 0);
      const producerName = groupItems.find((item) => item.producerName)?.producerName;

      return {
        producerProfileId,
        producerName,
        items: groupItems,
        totalItems,
        subtotal: roundCurrency(subtotal),
      };
    });
  },

  getSummary(items: CartItem[]): CartSummary {
    const groups = this.groupByProducer(items);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalItems,
      totalGroups: groups.length,
      subtotal: roundCurrency(subtotal),
    };
  },
};
