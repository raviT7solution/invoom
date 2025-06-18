import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useState } from "react";

import { Navbar } from "../../../components/Navbar";
import { Edit } from "./Edit";

export const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const showEditRole = (id: string, open: boolean) => {
    setSelectedUserId(id);
    setIsModalOpen(open);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditRole(record.id, true)}
          >
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const users = [
    {
      id: "1",
      name: "John Doe",
    },
    {
      id: "2",
      name: "Jane Smith",
    },
    {
      id: "3",
      name: "Ravi Kumar",
    },
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Users & Roles" }, { title: "Roles" }]}>
      <Edit
        roleId={selectedUserId}
        open={isModalOpen}
        showEditRole={showEditRole}
      />

      <div className="flex mb-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Input.Search
            allowClear
            className="max-w-xs"
            enterButton
            placeholder="Search roles by name"
          />

          <Button onClick={() => showEditRole("", true)} type="primary">
            Add Role
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" />
    </Navbar>
  );
};
