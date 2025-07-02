import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Select, Table } from "antd";

export const Active = () => {

  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "User & Client",
      key: "userClient",
      render: (_: any, record: any) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Doc Used",
      dataIndex: "docUsed",
      key: "docUsed",
      render: () => "—", // Placeholder — update with actual logic
    },
    {
      title: "Renewal Date",
      dataIndex: "createdAt",
      key: "renewalDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any) => {
        const menu = (
          <Menu>
            <Menu.Item key="modify">
              Modify
            </Menu.Item>
            <Menu.Item key="cancel" danger>
              Cancel
            </Menu.Item>
            <Menu.Item key="upgrade">Upgrade</Menu.Item>
            <Menu.Item key="history">View History</Menu.Item>
            <Menu.Item key="resend">Resend Onboarding Email</Menu.Item>
            <Menu.Item key="integration">Linked Integration</Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    }
    ,
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
      plan: "Gold",
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
      plan: "Platinum",
      status: "Active",
      createdAt: "2024-04-20",
    },
  ];

  return (
    <>
      <div className="flex mb-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Select className="w-1/4" mode="multiple" placeholder="Select plan" />
          <Select className="w-1/4" mode="multiple" placeholder="Select billing cycle" />
        </div>
      </div>

      <Table columns={columns} dataSource={collection} rowKey="id" />
    </>
  );
};
