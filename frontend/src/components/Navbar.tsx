import {
  AuditOutlined,
  BookOutlined,
  CarryOutOutlined,
  CoffeeOutlined,
  ContainerOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  FormOutlined,
  FormatPainterOutlined,
  InsertRowAboveOutlined,
  KeyOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  PercentageOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  RiseOutlined,
  SettingOutlined,
  TabletOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link } from "@swan-io/chicane";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbProps,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Select,
  Typography,
} from "antd";
import { ReactNode, useEffect } from "react";

import { logout, useCurrentAdmin, useRestaurants } from "../api";
import { classNames, initials } from "../helpers";
import { assetsPath } from "../helpers/assets";
import { Router } from "../Routes";
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
  const { data: restaurants } = useRestaurants("active");
  const restaurantIdStore = useRestaurantIdStore();

  useEffect(() => {
    if (
      !restaurants.length ||
      !restaurants[0] ||
      restaurantIdStore.restaurantId
    )
      return;

    restaurantIdStore.create(restaurants[0].id, restaurants[0].timezone);
  }, [restaurants, restaurantIdStore]);

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
      label: "Promotions",
      icon: <RiseOutlined />,
      key: "5",
      children: [
        {
          label: <Link to={Router.PromotionsDiscounts()}>Discounts</Link>,
          icon: <PercentageOutlined />,
          key: "5.1",
        },
      ],
    },
    {
      label: "Inventory",
      icon: <AuditOutlined />,
      key: "6",
      children: [
        {
          label: <Link to={Router.InventoryCategories()}>Category</Link>,
          icon: <MenuUnfoldOutlined />,
          key: "6.1",
        },
        {
          label: <Link to={Router.InventoryProducts()}>Products</Link>,
          icon: <BookOutlined />,
          key: "6.2",
        },
      ],
    },
    {
      label: "Reports",
      icon: <CarryOutOutlined />,
      key: "7",
      children: [
        {
          label: <Link to={Router.ReportsCustomers()}>Customers Report</Link>,
          icon: <ProfileOutlined />,
          key: "7.1",
        },
        {
          label: <Link to={Router.ReportsLabour()}>Labour Report</Link>,
          icon: <FieldTimeOutlined />,
          key: "7.2",
        },
        {
          label: <Link to={Router.ReportsSales()}>Sales Report</Link>,
          icon: <FileDoneOutlined />,
          key: "7.3",
        },
      ],
    },
    {
      label: "Settings",
      icon: <SettingOutlined />,
      key: "8",
      children: [
        {
          label: (
            <Link to={Router.RestaurantSettings()}>Restaurant Settings</Link>
          ),
          icon: <PercentageOutlined />,
          key: "8.1",
        },
        {
          label: (
            <Link to={Router.SettingsKitchenProfiles()}>Kitchen Profiles</Link>
          ),
          icon: <InsertRowAboveOutlined />,
          key: "8.2",
        },
        {
          label: <Link to={Router.SettingsDevices()}>Device Settings</Link>,
          icon: <TabletOutlined />,
          key: "8.3",
        },
      ],
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "9",
      onClick: logout,
    },
  ];

  const headerItems: MenuProps["items"] = [
    {
      label: <Link to={Router.SettingsRestaurants()}>My Restaurants</Link>,
      icon: <UserAddOutlined />,
      key: "1",
    },
    {
      label: <Link to={Router.ChangePassword()}>Change Password</Link>,
      icon: <KeyOutlined />,
      key: "2",
    },
  ];

  const restaurantOptions = restaurants.map((r) => ({
    value: r.id,
    label: r.name,
    tz: r.timezone,
  }));

  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible theme="light">
        <Select
          className="w-full !h-16 border-4 rounded-lg border-neutral-100"
          labelRender={({ label }) => (
            <Typography.Text strong>{label}</Typography.Text>
          )}
          onSelect={(_, i) => restaurantIdStore.create(i.value, i.tz)}
          options={restaurantOptions}
          value={restaurantIdStore.restaurantId}
          variant="borderless"
        />

        <Menu items={items} mode="vertical" selectedKeys={[]} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="!bg-white flex items-center">
          <img
            className="h-14 absolute left-1/2 -translate-x-1/2"
            src={assetsPath("logo/horizontal.png")}
          />

          <div className="absolute cursor-pointer right-4">
            <Dropdown menu={{ items: headerItems }} trigger={["click"]}>
              <Avatar className="!bg-zinc-400">
                {initials(currentAdmin?.fullName || "")}
              </Avatar>
            </Dropdown>
          </div>
        </Layout.Header>

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
