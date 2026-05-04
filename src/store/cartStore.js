import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      discount: null, // Stores the result from your discounts.js
      
      // UI Controls
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Cart Actions
      addItem: (item, stockLimit) => { 
        const currentItems = get().items;
        const cartItemId = `${item.productId}-${item.variantId || 'default'}`;
        const existingItem = currentItems.find((i) => i.cartItemId === cartItemId);

        if (existingItem) {
          // Check if adding more would exceed stock
          if (existingItem.quantity + item.quantity > stockLimit) {
            alert(`Only ${stockLimit} items available in stock.`);
            return;
          }
          set({
            items: currentItems.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Check if initial addition exceeds stock
          if (item.quantity > stockLimit) {
            alert(`Only ${stockLimit} items available.`);
            return;
          }
          set({ items: [...currentItems, { ...item, cartItemId, stockLimit }] }); 
        }
        set({ isOpen: true });
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((i) => i.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (!item) return;
        if (quantity > item.stockLimit) return; // Prevent incrementing past stock
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        });
      },
      
      // Discount Actions
      applyDiscount: (discountData) => set({ discount: discountData }),
      removeDiscount: () => set({ discount: null }),
      
      // Checkout Actions
      clearCart: () => set({ items: [], discount: null }),
    }),
    {
      name: 'reckless-era-cart', 
    }
  )
);