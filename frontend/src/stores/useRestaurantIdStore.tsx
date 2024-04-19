import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  restaurantId: string;

  create: (id: string) => void;
  destroy: () => void;
};

export const useRestaurantIdStore = create<State>()(
  persist(
    (set) => ({
      restaurantId: "",
      create: (id) => set({ restaurantId: id }),
      destroy: () => set({ restaurantId: "" }),
    }),
    { name: "restaurant-store" },
  ),
);
