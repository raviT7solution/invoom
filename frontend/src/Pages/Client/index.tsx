import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, PauseCircleOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Popconfirm, Select, Space, Table, Tag } from "antd";
import { useState } from "react";

import { useClientDelete, useClients, useClientStatusUpdate } from "../../api";
import { Navbar } from "../../components/Navbar";
import { useTableState } from "../../helpers/hooks";
import { Edit } from "./Edit";

export const Client = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { mutateAsync: deleteClient } = useClientDelete();
  const { mutateAsync: clientStatusUpdate } = useClientStatusUpdate();
  const showEditClient = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };

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

  const columns = [
    {
      title: "Client Name",
      dataIndex: "clientName", // updated from 'name'
      key: "clientName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone No",
      dataIndex: "mobileNumber", // updated from 'phone'
      key: "mobileNumber",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Client Type",
      dataIndex: "signupType", // updated from 'type'
      key: "signupType",
    },
    {
      title: "Plan",
      dataIndex: "businessName", // 'plan' doesn't exist, showing business name instead
      key: "businessName",
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
      dataIndex: "createdOn",
      key: "createdOn",
      render: (value: string) => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const handleStatusChange = async (status: string) => {
          await clientStatusUpdate({
            clientId: record.clientId,
            status,
          });
        };

        const menu = (
          <Menu
            onClick={({ key }) => {
              if (["active", "inactive", "suspended"].includes(key)) {
                handleStatusChange(
                  key === "active"
                    ? "Active"
                    : key === "inactive"
                    ? "Inactive"
                    : "Suspended"
                );
              } else if (key === "impersonate") {
                console.log("Impersonate:", record.clientId);
              }
            }}
          >
           <Menu.Item key="active" icon={<CheckCircleOutlined style={{ color: "green" }} />}>
      Mark as Active
    </Menu.Item>
    <Menu.Item key="inactive" icon={<CloseCircleOutlined style={{ color: "red" }} />}>
      Mark as Inactive
    </Menu.Item>
    <Menu.Item key="suspended" icon={<PauseCircleOutlined style={{ color: "#faad14" }} />}>
      Mark as Suspended
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="impersonate" icon={<UserSwitchOutlined />}>
      Impersonate
    </Menu.Item>
          </Menu>
        );

        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditClient(record.clientId, true)}
            />
            <Popconfirm
              title="Are you sure you want to delete this client?"
              onConfirm={() => deleteClient(record.clientId)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>

            <Dropdown overlay={menu} trigger={["click"]}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    }
  ];

  const {
    data: { data, dataTableMetaDTO },
    isFetching,
  } = useClients({
    start: pagination.page,
    length: pagination.perPage,
  });

  return (
    <Navbar breadcrumbItems={[{ title: "All clients" }]}>
      <Edit
        clientId={selectedMenuId}
        open={isModalOpen}
        showEditClient={showEditClient}
      />

      <div className="flex mb-4">
        <div className="flex flex-1 items-center justify-end gap-2">
        <Input.Search
          allowClear
          className="max-w-xs"
          enterButton
          placeholder="Search clients by name"
        />

        <Select
            className="w-1/4"
            mode="multiple"
            optionFilterProp="label"
            placeholder="Select plan"
          />

        <Select
          className="w-1/4"
          mode="multiple"
          optionFilterProp="label"
          placeholder="Select status"
          options={[
            { label: "Active", value: "Active" },
            { label: "Suspended", value: "Suspended" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />

        <Button onClick={() => showEditClient("", true)} type="primary">
          Add client
        </Button>
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
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
        rowKey="clientId"
        size="small"
      />
    </Navbar>
  );
};
