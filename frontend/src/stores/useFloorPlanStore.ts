import { useMemo } from "react";
import { create } from "zustand";

import { FloorObjectsQuery } from "../api/base";

export type FloorPlan = {
  name: string;
  imageUrl: string;
  width: number;
  height: number;
};

export type Item = FloorObjectsQuery["floorObjects"][number];

type FloorPlanStore = {
  floorPlan: FloorPlan;
  update: (floorPlan: FloorPlan) => void;
};

export const useFloorPlanStore = create<FloorPlanStore>()((set) => ({
  floorPlan: {
    name: "",
    imageUrl: "",
    width: 0,
    height: 0,
  },
  update: (floorPlan) => set({ floorPlan: floorPlan }),
}));

type ItemsStore = {
  items: Item[];
  updateItem: (item: Item) => void;
  updateItemData: (id: string, data: Partial<Item["data"]>) => void;
  updateItems: (items: Item[]) => void;
  deleteItems: (ids: string[]) => void;
};

const updateItemData = (item: Item, data: Partial<Item["data"]>): Item => {
  return { ...item, data: { ...item.data, ...data } };
};

export const useFloorPlanItemsStore = create<ItemsStore>()((set) => ({
  items: [],
  updateItem: (item) =>
    set((s) => ({ items: s.items.map((i) => (i.id === item.id ? item : i)) })),
  updateItemData: (id, data) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? updateItemData(i, data) : i)),
    })),
  updateItems: (items) => set({ items: items }),
  deleteItems: (ids) =>
    set((s) => ({
      items: s.items.filter((i) => !ids.includes(i.id)),
    })),
}));

type SelectedItemStore = {
  selectedItemIds: string[];
  setSelectedItemIds: (ids: string[]) => void;
};

export const useSelectedItemIdsStore = create<SelectedItemStore>()((set) => ({
  selectedItemIds: [],
  setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),
}));

export const useSelectedItems = () => {
  const items = useFloorPlanItemsStore((s) => s.items);
  const selectedItemIds = useSelectedItemIdsStore((s) => s.selectedItemIds);

  const selectedItems = useMemo(
    () => items.filter((i) => selectedItemIds.includes(i.id)),
    [items, selectedItemIds],
  );

  return selectedItems;
};

type LockedStore = {
  locked: boolean;
  setLocked: (locked: boolean) => void;
};

export const useFloorPlanLockedStore = create<LockedStore>()((set) => ({
  locked: true,
  setLocked: (locked) => set({ locked }),
}));

type TargetsStore = {
  targets: (SVGElement | HTMLElement)[];
  setTargets: (targets: (SVGElement | HTMLElement)[]) => void;
};

export const useTargetsStore = create<TargetsStore>()((set) => ({
  targets: [],
  setTargets: (targets) => set({ targets }),
}));
