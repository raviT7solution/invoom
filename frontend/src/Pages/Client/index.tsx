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
      title: "Client Type / Plan",
      dataIndex: "typePlan",
      key: "typePlan",
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
      typePlan: "Enterprise",
      status: "Active",
      createdAt: "2024-06-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+44 1234 567890",
      country: "UK",
      typePlan: "Standard",
      status: "Inactive",
      createdAt: "2024-05-10",
    },
    {
      id: "3",
      name: "Ravi Kumar",
      email: "ravi@example.in",
      phone: "+91 98765 43210",
      country: "India",
      typePlan: "Basic",
      status: "Active",
      createdAt: "2024-04-20",
    },
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Client" }, { title: "All" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
      />

      <div className="flex mb-4">
        <Typography.Title level={4}>Labour report</Typography.Title>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button onClick={() => showEditMenu("", true)} type="primary">
            Add timesheet
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
