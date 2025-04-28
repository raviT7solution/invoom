import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { discountTypes, Edit } from "./Edit";

import { useDiscountDelete, useDiscounts } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Discounts = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: discounts } = useDiscounts(restaurantId);
  const { mutateAsync: deleteDiscount } = useDiscountDelete();

  const [modal, setModal] = useState({ destroyed: false, id: "", open: false });

  const showEdit = (destroyed: boolean, id: string, open: boolean) => {
    setModal({ destroyed, id, open });
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Promotions" }, { title: "Discounts" }]}>
      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEdit(false, "", true)}
          type="primary"
        >
          Add Discount
        </Button>
      </div>

      {!modal.destroyed && (
        <Edit id={modal.id} open={modal.open} showEdit={showEdit} />
      )}

      <div>
        {discounts.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {discounts.map((i) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEdit(false, i.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deleteDiscount({ id: i.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "h-44 w-64 shadow-md",
                  i.visible ? "" : "opacity-50",
                )}
                key={i.id}
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
                      <li>Type: {discountTypes[i.discountType]}</li>
                      <li>Value: {i.value}</li>
                    </Typography.Paragraph>
                  }
                  title={i.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
