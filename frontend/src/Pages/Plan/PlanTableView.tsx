import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";

interface Plan {
  planId: string;
  planName: string;
  clientType: string;
  currency: string;
  monthly: number;
  annual: number;
}

interface PlanTableViewProps {
  plans: Plan[];
  onEdit: (planId: string) => void;
  onDelete: (planId: string) => void;
  onView: (planId: string) => void;
}

export const PlanTableView = ({ plans, onEdit, onDelete, onView }: PlanTableViewProps) => {
  const columns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
      render: (text: string, record: Plan) => (
        <Button
          type="link"
          onClick={() => onView(record.planId)}
          className="p-0"
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Default Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Default Monthly Price",
      dataIndex: "monthly",
      key: "monthly",
      render: (value: number) => `$${value}`,
    },
    {
      title: "Default Annual Price",
      dataIndex: "annual",
      key: "annual",
      render: (value: number) => `$${value}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Plan) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => onView(record.planId)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record.planId)}
          />
          <Popconfirm
            key="delete"
            onConfirm={() => onDelete(record.planId)}
            title="Are you sure you'd like to delete this plan?"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
   
      <Table
        columns={columns}
        dataSource={plans}
        rowKey="planId"
        size="small"
        pagination={false}
      />

  );
};
