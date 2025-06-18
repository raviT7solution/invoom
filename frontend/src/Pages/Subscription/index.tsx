import { Tabs } from "antd";
import { Navbar } from "../../components/Navbar";
import { Active } from "./Active";
import { Cancelled } from "./Cancelled";
import { Renewals } from "./Renewals";

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
            children: <Cancelled/>,
          },
          {
            key: "3",
            label: "Renewals",
            children: <Renewals/>,
          },
        ]}
      />
    </Navbar>
  );
};
