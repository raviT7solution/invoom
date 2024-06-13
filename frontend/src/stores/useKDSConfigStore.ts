import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  bookingTypes: string[];
  kitchenProfileId: string;
  restaurantId: string;
  configure: <T extends keyof State>(k: T, v: State[T]) => void;
  reset: () => void;
};

const initial = {
  bookingTypes: [],
  kitchenProfileId: "",
  restaurantId: "",
};

export const useKDSConfigStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      configure: (k, v) => set({ [k]: v }),
      reset: () => set(initial),
    }),
    { name: "kitchen-config-store" },
  ),
);
