import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";

import { Navbar } from "../../components/Navbar";
import { Edit } from "./Edit";

export const Client = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");

  const showEditMenu = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };

  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Client Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditMenu(record.id, true)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            // onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const collection = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555 123 4567",
      country: "USA",
      type: "Enterprise",
      plan: "Silver",
      status: "Active",
      createdAt: "2024-06-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+44 1234 567890",
      country: "UK",
      type: "Enterprise",
      plan: "Silver",
      status: "Inactive",
      createdAt: "2024-05-10",
    },
    {
      id: "3",
      name: "Ravi Kumar",
      email: "ravi@example.in",
      phone: "+91 98765 43210",
      country: "India",
      type: "Enterprise",
      plan: "Silver",
      status: "Active",
      createdAt: "2024-04-20",
    },
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Client" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
      />

      <div className="flex mb-4">
        <Typography.Title level={4}>All Client</Typography.Title>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button onClick={() => showEditMenu("", true)} type="primary">
            Add client
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={collection}
        rowKey="id"
      />
    </Navbar>
  );
};
