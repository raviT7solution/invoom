import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Empty,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import { Edit } from "./Edit";

import { useCategories, useItemDelete } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Item = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { mutateAsync: deleteItem } = useItemDelete();

  const { data: categories } = useCategories(restaurantId);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeKeys = useMemo(() => categories.map((c) => c.id), [categories]);

  const showEditItem = (id: string, open: boolean) => {
    setSelectedItemId(id);
    setIsModalOpen(open);
  };

  const items: CollapseProps["items"] = categories.map((category) => ({
    key: category.id,
    label: <Typography.Text strong>{category.name}</Typography.Text>,
    children: (
      <div>
        {category.items.length === 0 ? (
          <Empty />
        ) : (
          <Space direction="horizontal" wrap>
            {category.items.map((item) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit-item"
                    onClick={() => showEditItem(item.id, true)}
                  />,
                  <Popconfirm
                    key="delete-item"
                    onConfirm={() => deleteItem({ id: item.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "w-64 h-44 shadow-md",
                  item.visible ? "" : "opacity-50",
                )}
                key={item.id}
              >
                <Card.Meta
                  className="h-20"
                  description={
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: false,
                      }}
                      type="secondary"
                    >
                      Price:{item.price}
                    </Typography.Paragraph>
                  }
                  title={item.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    ),
  }));

  return (
    <Navbar breadcrumbItems={[{ title: "Cuisine Hub" }, { title: "Items" }]}>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditItem("", true)}
          type="primary"
        >
          Add Item
        </Button>
      </div>

      <Edit
        itemId={selectedItemId}
        open={isModalOpen}
        showEditItem={showEditItem}
      />

      <div className="nested-scroll-overflow-y-scroll">
        {items.length === 0 ? (
          <Empty />
        ) : (
          <Collapse defaultActiveKey={activeKeys} items={items} />
        )}
      </div>
    </Navbar>
  );
};
