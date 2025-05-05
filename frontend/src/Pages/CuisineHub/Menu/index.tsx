import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useMenuDelete, useMenus } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Menus = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const { data: menus } = useMenus(restaurantId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync: deleteMenu } = useMenuDelete();
  const [selectedMenuId, setSelectedMenuId] = useState("");

  const showEditMenu = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Cuisine hub" }, { title: "Menu" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
      />

      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditMenu("", true)}
          type="primary"
        >
          Add menu
        </Button>
      </div>

      <div>
        {menus.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {menus.map((menu) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditMenu(menu.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deleteMenu({ id: menu.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "h-44 w-64 shadow-md",
                  menu.visible ? "" : "opacity-50",
                )}
                key={menu.id}
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
                      {menu.description}
                    </Typography.Paragraph>
                  }
                  title={menu.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
