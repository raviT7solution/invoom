import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { useState } from "react";

import { useUserRoleDelete, useUserRoles } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useTableState } from "../../../helpers/hooks";
import { Edit } from "./Edit";
import { View } from "./View";

export const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { mutateAsync: deleteUserRole } = useUserRoleDelete();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const { pagination,  setPagination } = useTableState(
    {},
    { page: 0, perPage: 10 },
  );

  const {
    data: { data, dataTableMetaDTO },
    isFetching,
  } = useUserRoles({
    start: pagination.page,
    length: pagination.perPage,
  });


  const showEditRole = (id: string, open: boolean) => {
    setSelectedRoleId(id);
    setIsModalOpen(open);
  };

  const showViewRole = (id: string, open: boolean) => {
    setSelectedRoleId(id);
    setIsViewOpen(open);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Role Name",
      dataIndex: "userRoleName",
      key: "userRoleName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showViewRole(record.userRoleId, true)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditRole(record.userRoleId, true)}
          />
          <Popconfirm
            title="Are you sure you want to delete this role?"
            onConfirm={() => deleteUserRole(record.userRoleId)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Users & Roles" }, { title: "Roles" }]}>
      <Edit
        roleId={selectedRoleId}
        open={isModalOpen}
        showEditRole={showEditRole}
      />
      <View
        roleId={selectedRoleId}
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
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

      <Table
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        loading={isFetching}
        onChange={(i) =>
          setPagination({ page: i.current!, perPage: i.pageSize! })
        }
        pagination={{
          current: pagination.page + 1, // AntD uses 1-based index
          pageSize: pagination.perPage,
          total: dataTableMetaDTO.total,
        }}
        rowKey="userRoleId"
        size="small"
      />
    </Navbar>
  );
};
