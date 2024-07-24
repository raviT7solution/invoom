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
  const updateItemData = useFloorPlanItemsStore((s) => s.updateItemData);

  const [name, setName] = useState("");

  const setTargets = useTargetsStore((s) => s.setTargets);

  useEffect(() => {
    if (selectedItems.length === 1) setName(selectedItems[0].name);
  }, [selectedItems]);

  if (!selectedItemIds || !selectedItems.length) return;

  const itemTitle = selectedItems[0].name || selectedItems[0].objectType;
  const item =
    items[selectedItems[0].data.addons?.type || selectedItems[0].objectType];

  const handleChangeName = () => {
    updateItem({ ...selectedItems[0], name });
  };

  const handleChangeProperty = <T extends keyof Item["data"]>(
    property: T,
    value: Item["data"][T],
  ) => {
    updateItemData(selectedItems[0].id, { [property]: value });
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
        id: randomId(),
        name: "",
        objectType: selectedItems[0].objectType,
        data: {
          ...selectedItems[0].data,
          translateX: 0,
          translateY: 0,
          rotate: 0,
        },
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
            {selectedItems[0].objectType === "table" ? "Number" : "Name"}
            <Input
              onBlur={handleChangeName}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
              value={name}
            />
          </Space>

          {selectedItems[0].data.addons?.type === "oval" ? (
            <Space.Compact>
              <Space direction="vertical">
                Size
                <InputNumber
                  max={9999999}
                  min={1}
                  onChange={(v) => {
                    if (v) handleChangeProperty("width", v);
                    if (v) handleChangeProperty("length", v);
                  }}
                  step={0.1}
                  style={{ width: "100%" }}
                  value={selectedItems[0].data.width}
                />
              </Space>
            </Space.Compact>
          ) : (
            <Space.Compact>
              <Space direction="vertical">
                Width
                <InputNumber
                  max={9999999}
                  min={1}
                  onChange={(v) => {
                    if (v) handleChangeProperty("width", v);
                  }}
                  step={0.1}
                  style={{ width: "100%" }}
                  value={selectedItems[0].data.width}
                />
              </Space>

              <Space direction="vertical">
                Length
                <InputNumber
                  max={9999999}
                  min={1}
                  onChange={(v) => {
                    if (v) handleChangeProperty("length", v);
                  }}
                  step={0.1}
                  style={{ width: "100%" }}
                  value={selectedItems[0].data.length}
                />
              </Space>
            </Space.Compact>
          )}
        </>
      )}

      {selectedItems.length === 1 &&
        selectedItems[0].objectType === "table" && (
          <>
            <Typography.Title level={5}>Chairs</Typography.Title>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-neutral-200 text-3xl text-zinc-800">
              <BiChair />
            </div>

            {selectedItems[0].data.addons?.type === "oval" && (
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
                  value={selectedItems[0].data.addons.chairQuantity}
                />
              </Space>
            )}

            {selectedItems[0].data.addons?.type === "rectangular" && (
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
                          if (
                            selectedItems[0].data.addons?.type === "rectangular"
                          ) {
                            const arr =
                              selectedItems[0].data.addons.chairQuantity;
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
                            selectedItems[0].data?.addons?.chairQuantity as [
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
        title={`Are you sure you'd like to delete ${selectedItems
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
