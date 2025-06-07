import { Tabs } from "antd";
import { Navbar } from "../../components/Navbar";
import { Active } from "./Active";

export const Subscription = () => {
  return (
    <Navbar
      breadcrumbItems={[
        { title: "Subscription" },
      ]}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Active",
            children: <Active/>,
          },
          {
            key: "2",
            label: "Cancelled",
            children: <div>Cancelled Content</div>,
          },
          {
            key: "3",
            label: "Renew",
            children: <div>Renew Content</div>,
          },
        ]}
      />
    </Navbar>
  );
};
