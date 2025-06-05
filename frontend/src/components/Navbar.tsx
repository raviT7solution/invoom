import {
  DashboardOutlined,
  KeyOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserAddOutlined
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
  Typography
} from "antd";
import { ReactNode } from "react";

import { Router } from "../Routes";
import { classNames } from "../helpers";
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
  // const { data: currentAdmin } = useCurrentAdmin();
  // const { data: restaurants } = useRestaurants("active");
  const restaurantIdStore = useRestaurantIdStore();

  // useEffect(() => {
  //   if (
  //     !restaurants.length ||
  //     !restaurants[0] ||
  //     restaurantIdStore.restaurantId
  //   )
  //     return;

  //   restaurantIdStore.create(restaurants[0].id, restaurants[0].timezone);
  // }, [restaurants, restaurantIdStore]);

  const items: MenuProps["items"] = [
    {
      label: <Link to={Router.Dashboard()}>Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "1",
    },
    {
      label: <Link to={Router.Client()}>Client</Link>,
      icon: <TeamOutlined />,
      key: "2",
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "9",
      // onClick: logout,
    },
  ];

  const headerItems: MenuProps["items"] = [
    {
      label: <Link to="">My restaurants</Link>,
      icon: <UserAddOutlined />,
      key: "1",
    },
    {
      label: <Link to="">Change password</Link>,
      icon: <KeyOutlined />,
      key: "2",
    },
  ];

  const restaurantOptions = [{
    value: 1,
    label: "Invom",
    // tz: r.timezone,
  }];

  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible theme="light">
        <Select
          className="!h-16 w-full rounded-lg border-4 border-neutral-100"
          labelRender={({ label }) => (
            <Typography.Text strong>{label}</Typography.Text>
          )}
          // onSelect={(_, i) => restaurantIdStore.create(i.value, i.tz)}
          options={restaurantOptions}
          value={1}
          variant="borderless"
        />

        <Menu items={items} mode="vertical" selectedKeys={[]} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="flex items-center !bg-white">
          <img
            className="absolute left-1/2 h-14 -translate-x-1/2"
            // src={assetsPath("logo/horizontal.png")}
            src="./src/./assets/logo.png"
          />

          <div className="absolute right-4 cursor-pointer">
            <Dropdown menu={{ items: headerItems }} trigger={["click"]}>
              <Avatar className="!bg-zinc-400">
                {/* {initials(currentAdmin?.fullName || "")} */}
                RS
              </Avatar>
            </Dropdown>
          </div>
        </Layout.Header>

        <Layout.Content className="mx-4 flex flex-col">
          <Breadcrumb className="!my-4" items={breadcrumbItems} />

          <div
            className={classNames(
              "nested-scroll-overflow-y-scroll flex flex-1 flex-col bg-white",
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
