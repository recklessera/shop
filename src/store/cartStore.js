import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // UI Controls
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Cart Actions
      addItem: (item) => {
        const currentItems = get().items;
        // Create a unique ID based on product ID and variant properties
        const cartItemId = `${item.productId}-${item.variantId || 'default'}`;
        const existingItem = currentItems.find((i) => i.cartItemId === cartItemId);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, cartItemId }] });
        }
        
        // Auto-open cart when adding an item
        set({ isOpen: true });
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((i) => i.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'reckless-cart-storage', // key in localStorage
    }
  )
);