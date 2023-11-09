import { create } from "zustand";

type State = {
  restaurantId: string;

  create: (id: string) => void;
  destroy: () => void;
};

export const useRestaurantIdStore = create<State>()((set) => ({
  restaurantId: "",

  create: (id) => set({ restaurantId: id }),
  destroy: () => set({ restaurantId: "" }),
}));
