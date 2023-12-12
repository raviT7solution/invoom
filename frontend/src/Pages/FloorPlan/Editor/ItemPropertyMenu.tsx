import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { BiChair } from "@react-icons/all-files/bi/BiChair";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";

import { randomId } from "../../../helpers";
import {
  useFloorPlanItemsStore,
  useSelectedItems,
  useSelectedItemIdsStore,
  useTargetsStore,
  Item,
} from "../../../stores/useFloorPlanStore";
import { chairPositions, items } from "../constants";

export const ItemPropertyMenu = () => {
  const { selectedItemIds, setSelectedItemIds } = useSelectedItemIdsStore();
  const { items: floorObjects, updateItems } = useFloorPlanItemsStore();

  const selectedItems = useSelectedItems();

  const deleteItems = useFloorPlanItemsStore((s) => s.deleteItems);
  const updateItem = useFloorPlanItemsStore((s) => s.updateItem);

  const [name, setName] = useState("");

  const setTargets = useTargetsStore((s) => s.setTargets);

  useEffect(() => {
    if (selectedItems.length === 1) setName(selectedItems[0].name);
  }, [selectedItems]);

  if (!selectedItemIds || !selectedItems.length) return;

  const itemTitle = selectedItems[0].name || selectedItems[0].type;
  const item = items[selectedItems[0].type];

  const handleChangeName = () => {
    updateItem({ ...selectedItems[0], name });
  };

  const handleChangeProperty = <T extends keyof Item>(
    property: T,
    value: Item[T],
  ) => {
    updateItem({ ...selectedItems[0], [property]: value });
  };

  const handleDeleteObject = () => {
    deleteItems(selectedItemIds);
    setSelectedItemIds([]);
    setTargets([]);

    notification.warning({
      message: `Deleted "${selectedItems.map((i) => i.name).join(", ")}"`,
    });
  };

  const handleDuplicateObject = () => {
    updateItems([
      ...floorObjects,
      {
        ...selectedItems[0],
        id: randomId(),
        name: "",
        transform: "translate(0, 0)",
      },
    ]);

    notification.warning({
      message: `Duplicated "${selectedItems[0].name}"`,
    });
  };

  return (
    <Space direction="vertical">
      {selectedItems.length === 1 && (
        <>
          <Typography.Title level={5}>{itemTitle} details</Typography.Title>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-neutral-200 text-3xl text-zinc-800">
            <item.icon />
          </div>

          <Space className="w-full" direction="vertical">
            Name
            <Input
              onBlur={handleChangeName}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
              value={name}
            />
          </Space>

          <Space.Compact>
            <Space direction="vertical">
              Width
              <InputNumber
                max={9999999}
                min={0.1}
                onChange={(v) => {
                  if (v) handleChangeProperty("width", v * 65);
                }}
                step={0.1}
                style={{ width: "100%" }}
                value={selectedItems[0].width / 65}
              />
            </Space>

            <Space direction="vertical">
              Length
              <InputNumber
                max={9999999}
                min={0.1}
                onChange={(v) => {
                  if (v) handleChangeProperty("length", v * 65);
                }}
                step={0.1}
                style={{ width: "100%" }}
                value={selectedItems[0].length / 65}
              />
            </Space>
          </Space.Compact>
        </>
      )}

      {selectedItems.length === 1 && selectedItems[0].type === "table" && (
        <>
          <Typography.Title level={5}>Chairs</Typography.Title>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-neutral-200 text-3xl text-zinc-800">
            <BiChair />
          </div>

          {selectedItems[0].addons?.type === "oval" && (
            <Space className="w-full" direction="vertical">
              Chair quantity
              <InputNumber
                max={30}
                min={0}
                onChange={(v) => {
                  handleChangeProperty("addons", {
                    type: "oval",
                    chairQuantity: v || 0,
                  });
                }}
                step={1}
                style={{ width: "100%" }}
                value={selectedItems[0].addons.chairQuantity}
              />
            </Space>
          )}

          {selectedItems[0].addons?.type === "rectangular" && (
            <Space direction="vertical">
              Chair quantity
              <Space wrap>
                {chairPositions.map((pos) => (
                  <Space direction="vertical" key={pos.index}>
                    <pos.icon className="text-xl" />
                    <InputNumber
                      max={30}
                      min={0}
                      onChange={(v) => {
                        // :? condition is just for type checking
                        if (selectedItems[0].addons?.type === "rectangular") {
                          const arr = selectedItems[0].addons?.chairQuantity;
                          arr[pos.index] = v || 0;

                          handleChangeProperty("addons", {
                            type: "rectangular",
                            chairQuantity: arr,
                          });
                        }
                      }}
                      step={1}
                      value={
                        (
                          selectedItems[0]?.addons?.chairQuantity as [
                            number,
                            number,
                            number,
                            number,
                          ]
                        )[pos.index]
                      }
                    />
                  </Space>
                ))}
              </Space>
            </Space>
          )}
        </>
      )}

      {selectedItems.length === 1 && (
        <Button block icon={<CopyOutlined />} onClick={handleDuplicateObject}>
          Duplicate item
        </Button>
      )}

      <Popconfirm
        cancelText="No"
        okText="Yes"
        onConfirm={handleDeleteObject}
        title={`Are you sure to delete ${selectedItems
          .map((i) => i.name)
          .join(", ")}?`}
      >
        <Button block danger icon={<DeleteOutlined />}>
          {selectedItems.length > 1 ? "Delete items" : "Delete item"}
        </Button>
      </Popconfirm>
    </Space>
  );
};
