import { useEffect } from "react";

import { Editor } from "./Editor";
import { SubMenu } from "./SubMenu";

import { useFloorObjects } from "../../api";
import floorUrl from "../../assets/floor.jpg";
import { Navbar } from "../../components/Navbar";
import {
  useFloorPlanItemsStore,
  useFloorPlanStore,
} from "../../stores/useFloorPlanStore";
import { useRestaurantIdStore } from "../../stores/useRestaurantIdStore";

export const FloorPlan = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const { data } = useFloorObjects({ restaurantId: restaurantId });

  const updateFloorPlan = useFloorPlanStore((s) => s.update);
  const updateItems = useFloorPlanItemsStore((s) => s.updateItems);

  useEffect(() => {
    updateItems(data);
    updateFloorPlan({
      name: "Venue 1",
      imageUrl: floorUrl,
      width: 1000,
      height: 600,
    });
  }, [data, updateItems, updateFloorPlan]);

  return (
    <Navbar breadcrumbItems={[{ title: "Floor Plan" }]} padding={false}>
      <div className="flex nested-scroll-h-full">
        <SubMenu />

        <div className="w-full">
          <Editor />
        </div>
      </div>
    </Navbar>
  );
};
