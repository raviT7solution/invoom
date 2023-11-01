import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link } from "@swan-io/chicane";
import { Breadcrumb, Layout, Menu } from "antd";
import { ReactNode } from "react";

import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

import type { BreadcrumbProps, MenuProps } from "antd";

export const Navbar = ({
  breadcrumbItems,
  children,
}: {
  breadcrumbItems: BreadcrumbProps["items"];
  children: ReactNode;
}) => {
  const destroy = useAdminSessionStore((s) => s.destroy);

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
      label: "Setting",
      icon: <SettingOutlined />,
      key: "2",
      children: [
        {
          label: <Link to={Router.SettingsUsers()}>Users</Link>,
          icon: <UserOutlined />,
          key: "3",
        },
      ],
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "4",
      onClick: onLogout,
    },
  ];

  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible>
        <Menu
          defaultSelectedKeys={["1"]}
          items={items}
          mode="vertical"
          theme="dark"
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content className="mx-4">
          <Breadcrumb className="!my-4" items={breadcrumbItems} />

          <div className="bg-white p-6">{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
