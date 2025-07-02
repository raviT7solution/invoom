import { DeleteOutlined, EditOutlined, StopOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Space, Table, Tag } from "antd";
import { useState } from "react";

import { useClientDelete, useClients } from "../../api";
import { Navbar } from "../../components/Navbar";
import { useTableState } from "../../helpers/hooks";
import { Edit } from "./Edit";

export const Client = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


  const { mutateAsync: deleteClient } = useClientDelete();
  const showEditClient = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };
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
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditClient(record.clientId, true)} // updated from record.id
          />
          <Popconfirm
            key="delete"
            onConfirm={() => deleteClient(record.clientId)}
            title="Are you sure you'd like to delete this?"
          >
            <DeleteOutlined />
          </Popconfirm>

          <Button
            size="small"
            icon={<StopOutlined />}
            onClick={() => {
              // Implement suspend logic here
              console.log(`Suspending client: ${record.clientId}`);
            }}
          >
            Suspend
          </Button>

        <Button
          size="small"
          icon={<UserSwitchOutlined />}
          type="dashed"
          onClick={() => {
            // Implement impersonation logic here
            console.log(`Impersonating client: ${record.clientId}`);
          }}
        >
          Impersonate
        </Button>
        </Space>
      ),
    },
  ];

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
