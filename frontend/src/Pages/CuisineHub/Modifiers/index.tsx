import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useModifierDelete, useModifiers } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Modifiers = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: modifiers } = useModifiers(restaurantId);
  const { mutateAsync: modifierDelete } = useModifierDelete();

  const [selectedModifierId, setSelectedModifierId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditModifier = (id: string, open: boolean) => {
    setSelectedModifierId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Cuisine Hub" }, { title: "Modifiers" }]}
    >
      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditModifier("", true)}
          type="primary"
        >
          Add Modifier
        </Button>
      </div>

      <Edit
        id={selectedModifierId}
        open={isModalOpen}
        showEditModifier={showEditModifier}
      />

      <div>
        {modifiers.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {modifiers.map((modifier) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditModifier(modifier.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => modifierDelete({ id: modifier.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "h-44 w-64 shadow-md",
                  modifier.visible ? "" : "opacity-50",
                )}
                key={modifier.id}
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
                      Global Modifier: {modifier.globalModifier ? "Yes" : "No"}
                    </Typography.Paragraph>
                  }
                  title={modifier.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
