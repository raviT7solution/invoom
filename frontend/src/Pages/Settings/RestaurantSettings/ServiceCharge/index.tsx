import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { chargeTypes, Edit } from "./Edit";

import { useServiceChargeDelete, useServiceCharges } from "../../../../api";
import { classNames } from "../../../../helpers";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

export const ServiceCharges = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: serviceCharges } = useServiceCharges(restaurantId);
  const { mutateAsync: deleteCharge } = useServiceChargeDelete();

  const [modal, setModal] = useState({ id: "", open: false });

  const showEdit = (id: string, open: boolean) => {
    setModal({ id, open });
  };

  return (
    <>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEdit("", true)}
          type="primary"
        >
          Add Charge
        </Button>
      </div>

      <Edit id={modal.id} open={modal.open} showEdit={showEdit} />

      <div>
        {serviceCharges.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {serviceCharges.map((i) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEdit(i.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deleteCharge({ id: i.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "w-64 h-44 shadow-md",
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
                      <li>
                        Type:
                        {chargeTypes[i.chargeType]}
                      </li>
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
    </>
  );
};
