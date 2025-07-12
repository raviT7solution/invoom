import { Table, Tag } from "antd";

export const Renewals = () => {
  const columns = [
    {
      title: "Client",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewalDate",
      key: "renewalDate",
    },
    {
      title: "Billing Cycle",
      dataIndex: "billingCycle",
      key: "billingCycle",
    },
    {
      title: "Auto-renew Status",
      dataIndex: "autoRenew",
      key: "autoRenew",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Enabled" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
  ];

  const collection = [
    {
      id: "1",
      name: "Alpha Inc",
      plan: "Silver",
      renewalDate: "2025-06-01",
      billingCycle: "Monthly",
      autoRenew: true,
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      name: "Beta LLC",
      plan: "Gold",
      renewalDate: "2025-07-10",
      billingCycle: "Yearly",
      autoRenew: false,
      paymentMethod: "PayPal",
    },
    {
      id: "3",
      name: "Gamma Ltd",
      plan: "Platinum",
      renewalDate: "2025-06-25",
      billingCycle: "Quarterly",
      autoRenew: true,
      paymentMethod: "Bank Transfer",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={collection} rowKey="id" />
    </>
  );
};
