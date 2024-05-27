import { Button, Collapse, Menu, Space, Typography, CollapseProps } from "antd";

import { useCurrentAdmin } from "../../../api/kds";
import { Router } from "../../../Routes";
import { useKDSConfigStore } from "../../../stores/useKDSConfigStore";
import { useKDSSessionStore } from "../../../stores/useKDSSessionStore";

const BOOKING_TYPES = [
  "All",
  "Dine",
  "Delivery",
  "Takeout",
  "Take & Delivery",
].map((tab, index) => ({
  key: index + 1,
  label: tab,
}));

const KITCHEN_PROFILES = ["Egg Section", "Kitchen Chaat"].map((tab, index) => ({
  key: index + 1,
  label: tab,
}));

const AccountSection = () => {
  const { data: currentAdmin } = useCurrentAdmin();

  const destroy = useKDSSessionStore((s) => s.destroy);
  const reset = useKDSConfigStore((s) => s.reset);

  const onLogout = () => {
    destroy();
    reset();

    Router.push("KDSLogin");
  };

  return (
    <Space direction="vertical">
      <Typography.Title level={5}>{currentAdmin?.fullName}</Typography.Title>
      <Button danger onClick={onLogout} type="primary">
        Logout
      </Button>
    </Space>
  );
};

export const ConfigureMenu = () => {
  const { configure, bookingTypes, kitchenProfile } = useKDSConfigStore();

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Booking Type",
      children: (
        <Menu
          items={BOOKING_TYPES}
          onClick={(e) => configure("bookingTypes", e.keyPath)}
          selectedKeys={bookingTypes}
        />
      ),
    },
    {
      key: "2",
      label: "Kitchen Profile",
      children: (
        <Menu
          items={KITCHEN_PROFILES}
          onClick={(e) => configure("kitchenProfile", e.key)}
          selectedKeys={[kitchenProfile]}
        />
      ),
    },
    {
      key: "3",
      label: "Account",
      children: <AccountSection />,
    },
  ];

  return <Collapse items={items} />;
};
