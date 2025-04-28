import {
  LockOutlined,
  PlusOutlined,
  SaveOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Space, notification } from "antd";
import { useState } from "react";

import { AddItemModal } from "./Editor/AddItemModal";
import { ItemPropertyMenu } from "./Editor/ItemPropertyMenu";

import { useFloorObjectUpdate } from "../../api";
import {
  useFloorPlanItemsStore,
  useFloorPlanLockedStore,
} from "../../stores/useFloorPlanStore";
import { useRestaurantIdStore } from "../../stores/useRestaurantIdStore";

export const SubMenu = () => {
  const [open, setIsOpen] = useState(false);
  const { locked, setLocked } = useFloorPlanLockedStore();
  const items = useFloorPlanItemsStore((s) => s.items);
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const { mutateAsync, isPending } = useFloorObjectUpdate();

  const save = async () => {
    await mutateAsync({
      input: {
        attributes: items,
        restaurantId: restaurantId,
      },
    });

    notification.success({
      message: "Floor plan saved",
    });
  };

  return (
    <>
      <div className="nested-scroll-overflow-y-scroll w-72 space-y-8 border-r p-4">
        <Space className="w-full" direction="vertical">
          <Button block icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
            Add object
          </Button>

          <Button
            block
            icon={locked ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => setLocked(!locked)}
          >
            {locked ? "Unlock floor plan" : "Lock floor plan"}
          </Button>

          <Button
            block
            icon={<SaveOutlined />}
            loading={isPending}
            onClick={save}
            type="primary"
          >
            Save
          </Button>
        </Space>

        <ItemPropertyMenu />
      </div>

      <AddItemModal open={open} setOpen={setIsOpen} />
    </>
  );
};
