import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminDataState = {
  userfrontId?: string;
  name?: string;
  create: (userfrontId: string, name: string) => void;
  destroy: () => void;
};

export const useAdminDataStore = create<AdminDataState>()(
  persist(
    (set) => ({
      userfrontId: undefined,
      name: undefined,
      create: (userfrontId, name) => set({ userfrontId, name }),
      destroy: () => set({ userfrontId: undefined, name: undefined }),
    }),
    { name: "admin-data-store" }
  )
);
