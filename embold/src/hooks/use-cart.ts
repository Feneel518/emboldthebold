// // add items
// // remove items
// // clear the cart
// // (keep track of cart items)

// import { Inventory } from "@/types/Inventory";
import { Inventory } from "@/types/Inventory";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  Inventory: Inventory;
  Quantity: number;
};

export type CartState = {
  items: CartItem[];
  paymentIntent: string;
  addressId: string;
};

export type Actions = {
  addItem: (inventory: Inventory, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  increaseItemQuantity: (id: string) => void;
  decreaseItemQuantity: (id: string) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setAddressId: (addressId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState & Actions>()(
  persist(
    (set) => ({
      items: [],
      paymentIntent: "",
      addressId: "",
      addItem(inventory, quantity) {
        set((state) => ({
          items: [...state.items, { Inventory: inventory, Quantity: quantity }],
        }));
      },
      removeItem(id) {
        set((state) => ({
          items: state.items.filter((item) => item.Inventory.id !== id),
        }));
      },
      updateItem(id, quantity) {
        set((state) => ({
          items: state.items.map((item) =>
            item.Inventory.id === id ? { ...item, Quantity: quantity } : item
          ),
        }));
      },
      increaseItemQuantity(id) {
        set((state) => ({
          items: state.items.map((item) =>
            item.Inventory.id === id
              ? { ...item, Quantity: item.Quantity + 1 }
              : item
          ),
        }));
      },
      decreaseItemQuantity(id) {
        set((state) => ({
          items: state.items.map((item) =>
            item.Inventory.id === id
              ? { ...item, Quantity: item.Quantity - 1 }
              : item
          ),
        }));
      },
      setPaymentIntent(paymentIntent) {
        set((state) => ({
          paymentIntent: paymentIntent,
        }));
      },
      setAddressId(addressId) {
        set((state) => ({
          addressId: addressId,
        }));
      },
      clearCart() {
        set((state) => ({
          items: [],
          paymentIntent: "",
          addressId: "",
        }));
      },
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
