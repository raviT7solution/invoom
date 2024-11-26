import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useAddonsDelete, useAddons } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Addons = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [modal, setModal] = useState({ destroyed: false, id: "", open: false });

  const { mutateAsync: deleteAddons } = useAddonsDelete();

  const { data: addons } = useAddons(restaurantId);

  const showEdit = (destroyed: boolean, id: string, open: boolean) => {
    setModal({ destroyed, id, open });
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Cuisine Hub" }, { title: "Addons" }]}>
      {!modal.destroyed && (
        <Edit id={modal.id} open={modal.open} showEdit={showEdit} />
      )}

      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEdit(false, "", true)}
          type="primary"
        >
          Add Addons
        </Button>
      </div>

      <div>
        {addons.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {addons.map((addon) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEdit(false, addon.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deleteAddons({ id: addon.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "w-64 h-44 shadow-md",
                  addon.visible ? "" : "opacity-50",
                )}
                key={addon.id}
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
                      <>
                        <li>Price: ${addon.price}</li>
                        <li>Takeout Price: ${addon.takeoutPrice}</li>
                      </>
                    </Typography.Paragraph>
                  }
                  title={addon.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
