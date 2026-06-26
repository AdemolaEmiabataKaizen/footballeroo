'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dish } from '../api';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish: Dish) => {
        set((state) => {
          const existing = state.items.find((i) => i.dish.id === dish.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.dish.id === dish.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { dish, quantity: 1 }] };
        });
      },

      removeItem: (dishId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.dish.id !== dishId),
        }));
      },

      updateQuantity: (dishId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.dish.id === dishId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, i) => sum + i.dish.price * i.quantity,
          0,
        );
      },
    }),
    {
      name: 'footballeroo-cart',
    },
  ),
);
