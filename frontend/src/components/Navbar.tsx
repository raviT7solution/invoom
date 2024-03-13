import {
  BookOutlined,
  CoffeeOutlined,
  ContainerOutlined,
  DashboardOutlined,
  FormatPainterOutlined,
  FormOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  ReconciliationOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "@swan-io/chicane";
import {
  Breadcrumb,
  BreadcrumbProps,
  Layout,
  Menu,
  MenuProps,
  Select,
} from "antd";
import { ReactNode, useEffect } from "react";

import { useCurrentAdmin } from "../api";
import { classNames } from "../helpers";
import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";
import { useRestaurantIdStore } from "../stores/useRestaurantIdStore";

export const Navbar = ({
  breadcrumbItems,
  children,
  padding = true,
}: {
  breadcrumbItems: BreadcrumbProps["items"];
  children: ReactNode;
  padding?: boolean;
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
      label: <Link to={Router.Teams()}>Teams</Link>,
      icon: <TeamOutlined />,
      key: "2",
    },

    {
      label: "Cuisine Hub",
      icon: <ReconciliationOutlined />,
      key: "3",
      children: [
        {
          label: <Link to={Router.CuisineHubMenus()}>Menu</Link>,
          icon: <BookOutlined />,
          key: "3.1",
        },
        {
          label: <Link to={Router.CuisineHubCategories()}>Category</Link>,
          icon: <ContainerOutlined />,
          key: "3.2",
        },
        {
          label: <Link to={Router.CuisineHubAddons()}>Addons</Link>,
          icon: <PlusCircleOutlined />,
          key: "3.3",
        },
        {
          label: <Link to={Router.CuisineHubItems()}>Items</Link>,
          icon: <CoffeeOutlined />,
          key: "3.4",
        },
        {
          label: <Link to={Router.CuisineHubModifiers()}>Modifiers</Link>,
          icon: <FormOutlined />,
          key: "3.5",
        },
      ],
    },
    {
      label: <Link to={Router.FloorPlan()}>Floor Plan</Link>,
      icon: <FormatPainterOutlined />,
      key: "4",
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "5",
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
          className="w-full !h-12"
          onSelect={(v) => restaurantIdStore.create(v)}
          options={restaurantOptions}
          value={restaurantIdStore.restaurantId}
          variant="borderless"
        />

        <Menu items={items} mode="vertical" selectedKeys={[]} />
      </Layout.Sider>
      <Layout>
        <Layout.Content className="mx-4 flex flex-col">
          <Breadcrumb className="!my-4" items={breadcrumbItems} />

          <div
            className={classNames(
              "bg-white flex-1 flex flex-col nested-scroll-overflow-y-scroll",
              padding ? "p-4" : "",
            )}
          >
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
