import { useEffect } from "react";

import { Editor } from "./Editor";
import { SubMenu } from "./SubMenu";

import { useFloorObjects } from "../../api";
import { Navbar } from "../../components/Navbar";
import { useFloorPlanItemsStore } from "../../stores/useFloorPlanStore";
import { useRestaurantIdStore } from "../../stores/useRestaurantIdStore";

export const FloorPlan = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const { data } = useFloorObjects({ restaurantId: restaurantId });

  const updateItems = useFloorPlanItemsStore((s) => s.updateItems);

  useEffect(() => {
    updateItems(data);
  }, [data, updateItems]);

  return (
    <Navbar breadcrumbItems={[{ title: "Floor Plan" }]} padding={false}>
      <div className="nested-scroll-h-full flex">
        <SubMenu />

        <div className="w-full">
          <Editor />
        </div>
      </div>
    </Navbar>
  );
};
