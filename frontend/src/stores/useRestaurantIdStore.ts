import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  create: (id: string, tz: string) => void;
  destroy: () => void;
  restaurantId: string;
  tz: string;
};

export const useRestaurantIdStore = create<State>()(
  persist(
    (set) => ({
      create: (id, tz) => set({ restaurantId: id, tz: tz }),
      destroy: () => set({ restaurantId: "", tz: "UTC" }),
      restaurantId: "",
      tz: "UTC",
    }),
    { name: "restaurant-store", version: 2 },
  ),
);
