import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  deviceId: string;
  restaurantId: string;
  configure: <T extends keyof State>(k: T, v: State[T]) => void;
  reset: () => void;
};

const initial = {
  deviceId: "",
  restaurantId: "",
};

export const useCFDConfigStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      configure: (k, v) => set({ [k]: v }),
      reset: () => set(initial),
    }),
    { name: "cfd-config-store" },
  ),
);
