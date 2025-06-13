import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Select, Table, Tag } from "antd";
import { useState } from "react";

export const Cancelled = () => {
  const [selectedId, setSelectedId] = useState("");

  const handleAction = (key: string, id: string) => {
    setSelectedId(id);
    if (key === "history") {
      console.log("Viewing history for:", id);
    }
    if (key === "reactivate") {
      console.log("Reactivating subscription for:", id);
    }
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Cancellation Date",
      dataIndex: "cancelledAt",
      key: "cancelledAt",
    },
    {
      title: "Reason",
      dataIndex: "cancellationReason",
      key: "cancellationReason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Cancelled" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleAction(key, record.id)}
            items={[
              { key: "history", label: "View Cancellation History" },
              { key: "reactivate", label: "Reactivate Subscription" },
            ]}
          />
        );

        return (
          <Dropdown overlay={menu} placement="bottomLeft" trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const collection = [
    {
      id: "1",
      name: "Alpha Inc",
      plan: "Silver",
      cancelledAt: "2024-05-15",
      cancellationReason: "Cost too high",
      status: "Cancelled",
    },
    {
      id: "2",
      name: "Beta LLC",
      plan: "Gold",
      cancelledAt: "2024-06-01",
      cancellationReason: "Switched to competitor",
      status: "Cancelled",
    },
    {
      id: "3",
      name: "Gamma Ltd",
      plan: "Platinum",
      cancelledAt: "2024-06-07",
      cancellationReason: "No longer needed",
      status: "Cancelled",
    },
  ];

  return (
    <>
      <div className="flex mb-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Select className="w-1/4" mode="multiple" placeholder="Select plan type"/>
          <Select className="w-1/4" mode="multiple" placeholder="Select reason" />
        </div>
      </div>

      <Table columns={columns} dataSource={collection} rowKey="id" />
    </>
  );
};
