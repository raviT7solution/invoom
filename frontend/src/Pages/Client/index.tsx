import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import { useState } from "react";

import { useClients } from "../../api";
import { Navbar } from "../../components/Navbar";
import { useTableState } from "../../helpers/hooks";
import { Edit } from "./Edit";

export const Client = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");

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
      dataIndex: "createdOn", // updated from 'createdAt'
      key: "createdOn",
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
          <Button
            icon={<DeleteOutlined />}
            danger
          />
        </Space>
      ),
    },
  ];


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
          />

          <Button onClick={() => showEditClient("", true)} type="primary">
            Add client
          </Button>
        </div>
      </div>

      <Table
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
