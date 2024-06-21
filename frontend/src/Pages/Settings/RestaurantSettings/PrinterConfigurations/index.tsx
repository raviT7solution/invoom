import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import {
  usePrinterConfigurationDelete,
  usePrinterConfigurations,
} from "../../../../api";
import { classNames } from "../../../../helpers";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

export const PrinterConfigurations = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: printerConfigurations } =
    usePrinterConfigurations(restaurantId);
  const { mutateAsync: deletePrinterConfig } = usePrinterConfigurationDelete();

  const [selectedPrinterId, setSelectedPrinterId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditPrinter = (id: string, open: boolean) => {
    setSelectedPrinterId(id);
    setIsModalOpen(open);
  };

  return (
    <>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditPrinter("", true)}
          type="primary"
        >
          Add Printer
        </Button>
      </div>

      <Edit
        open={isModalOpen}
        printerId={selectedPrinterId}
        showEditPrinter={showEditPrinter}
      />

      <div>
        {printerConfigurations.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {printerConfigurations.map((i) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditPrinter(i.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deletePrinterConfig({ id: i.id })}
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
                      <li>IP: {i.ipAddress}</li>
                      <li>Port: {i.port}</li>
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
