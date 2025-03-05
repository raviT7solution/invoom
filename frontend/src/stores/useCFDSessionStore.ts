import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  token?: string;
  create: (token: string) => void;
  destroy: () => void;
};

export const useCFDSessionStore = create<State>()(
  persist(
    (set) => ({
      token: undefined,
      create: (token) => set({ token: token }),
      destroy: () => set({ token: undefined }),
    }),
    { name: "cfd-session-store" },
  ),
);
