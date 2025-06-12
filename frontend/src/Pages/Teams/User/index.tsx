import { EditOutlined, KeyOutlined, MailOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import { useState } from "react";

import { Navbar } from "../../../components/Navbar";
import { Edit } from "./Edit";

export const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const showEditUser = (id: string, open: boolean) => {
    setSelectedUserId(id);
    setIsModalOpen(open);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
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
          <Button icon={<StopOutlined />} danger>
            Deactivate
          </Button>
          <Button icon={<KeyOutlined />}>Reset Password</Button>
          <Button icon={<EditOutlined />} onClick={() => showEditUser(record.id, true)} />
          <Button icon={<MailOutlined />}>Resend Invite</Button>
        </Space>
      ),
    },
  ];

  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-06-10",
      createdAt: "2024-06-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "Inactive",
      lastLogin: "2024-05-15",
      createdAt: "2024-05-10",
    },
    {
      id: "3",
      name: "Ravi Kumar",
      email: "ravi@example.in",
      role: "Support",
      status: "Active",
      lastLogin: "2024-06-12",
      createdAt: "2024-04-20",
    },
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Users & Roles" }, { title: "Users" }]}>
      <Edit
        menuId={selectedUserId}
        open={isModalOpen}
        showEditMenu={showEditUser}
      />

      <div className="flex mb-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Input.Search
            allowClear
            className="max-w-xs"
            enterButton
            placeholder="Search users by name"
          />

          <Select
            className="w-1/4"
            mode="multiple"
            optionFilterProp="label"
            placeholder="Select role"
          />

          <Select
            className="w-1/4"
            mode="multiple"
            optionFilterProp="label"
            placeholder="Select status"
          />

          <Button onClick={() => showEditUser("", true)} type="primary">
            Add User
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" />
    </Navbar>
  );
};
