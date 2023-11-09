import {
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "@swan-io/chicane";
import { Breadcrumb, Layout, Menu, Select } from "antd";
import { ReactNode, useEffect } from "react";

import { useCurrentAdmin } from "../api";
import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";
import { useRestaurantIdStore } from "../stores/useRestaurantIdStore";

import type { BreadcrumbProps, MenuProps } from "antd";

export const Navbar = ({
  breadcrumbItems,
  children,
}: {
  breadcrumbItems: BreadcrumbProps["items"];
  children: ReactNode;
}) => {
  const { data: currentAdmin } = useCurrentAdmin();
  const destroy = useAdminSessionStore((s) => s.destroy);
  const restaurantIdStore = useRestaurantIdStore();

  useEffect(() => {
    if (
      !currentAdmin ||
      !currentAdmin.restaurants[0] ||
      restaurantIdStore.restaurantId
    )
      return;

    restaurantIdStore.create(currentAdmin.restaurants[0].id);
  }, [restaurantIdStore, currentAdmin]);

  const onLogout = () => {
    destroy();

    Router.push("Login");
  };

  const items: MenuProps["items"] = [
    {
      label: <Link to={Router.Dashboard()}>Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "1",
    },
    {
      label: <Link to={Router.Teams()}>Team</Link>,
      icon: <TeamOutlined />,
      key: "2",
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "3",
      onClick: onLogout,
    },
  ];

  const restaurantOptions = currentAdmin?.restaurants.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible theme="light">
        <Select
          bordered={false}
          className="w-full !h-12"
          onSelect={(v) => restaurantIdStore.create(v)}
          options={restaurantOptions}
          value={restaurantIdStore.restaurantId}
        />

        <Menu items={items} mode="vertical" selectedKeys={[]} />
      </Layout.Sider>
      <Layout>
        <Layout.Content className="mx-4 flex flex-col">
          <Breadcrumb className="!my-4" items={breadcrumbItems} />

          <div className="bg-white p-6 flex-1 flex flex-col">{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
