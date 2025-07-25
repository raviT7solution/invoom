import {
  BarChartOutlined,
  BgColorsOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  IdcardOutlined,
  KeyOutlined,
  LinkOutlined,
  LogoutOutlined,
  MailOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Link } from "@swan-io/chicane";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbProps,
  Dropdown,
  Layout,
  Menu,
  MenuProps
} from "antd";
import { ReactNode } from "react";
import { Router } from "../Routes";
import { logout } from "../api";
import { classNames, initials } from "../helpers";
import { useAdminDataStore } from "../stores/useAdminDataStore";

export const Navbar = ({
  breadcrumbItems,
  children,
  padding = true,
}: {
  breadcrumbItems: BreadcrumbProps["items"];
  children: ReactNode;
  padding?: boolean;
}) => {

  const name = useAdminDataStore((s) => s.name);

  const items: MenuProps["items"] = [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      key: "1",
      children: [
        {
          label: <Link to={Router.Dashboard()}>Overview</Link>,
          icon: <BarChartOutlined />,
          key: "1.1",
        },
        {
          label: <Link to="">System Logs</Link>,
          icon: <FileSearchOutlined />,
          key: "1.2",
        },
      ],
    },
    {
      label: <Link to={Router.Client()}>Client</Link>,
      icon: <TeamOutlined />,
      key: "2",
    },
    {
      label: <Link to={Router.Plan()}>Plan</Link>,
      icon: <ProfileOutlined />,
      key: "3",
    },
    {
      label: <Link to={Router.Subscription()}>Subscription</Link>,
      icon: <CreditCardOutlined />,
      key: "4",
    },
    {
      label: <Link to={Router.OCREngines()}>OCR & AI Engine</Link>,
      icon: <RobotOutlined />,
      key: "5",
    },
    {
      label: "User & Roles",
      icon: <TeamOutlined />, // Changed to reflect users/roles context
      key: "6",
      children: [
        {
          label: <Link to={Router.Roles()}>Roles</Link>,
          icon: <IdcardOutlined />, // Represents roles or identity
          key: "6.1",
        },
        {
          label: <Link to={Router.Users()}>Users</Link>,
          icon: <UserOutlined />, // Clear representation of users
          key: "6.2",
        },
      ],
    },
    {
      label: "Settings",
      icon: <SettingOutlined />,
      key: "7",
      children: [
        {
          label: <Link to={Router.Integration()}>Integrations</Link>,
          icon: <BgColorsOutlined />,
          key: "7.1",
        },
        {
          label: <Link to="">Email Template</Link>,
          icon: <MailOutlined />,
          key: "7.2",
        },
        {
          label: <Link to="">Billing Settings</Link>,
          icon: <DollarOutlined />,
          key: "7.3",
        },
        {
          label: <Link to="">Webhook</Link>,
          icon: <LinkOutlined />,
          key: "7.4",
        },
        {
          label: <Link to="">Regional Preferences</Link>,
          icon: <GlobalOutlined />,
          key: "7.5",
        },
      ],
    },
    {
      label: "Support",
      icon: <QuestionCircleOutlined />,
      key: "8",
      children: [
        {
          label: <Link to={Router.Support()}>Help Center</Link>,
          icon: <MailOutlined />,
          key: "8.1",
        },
        {
          label: <Link to={Router.AdminSupport()}>Ticket Management</Link>,
          icon: <SafetyOutlined />,
          key: "8.2",
        },
      ],
    },
    {
      label: "Masters",
      icon: <SettingOutlined />,
      key: "9",
      children: [
        {
          label: <Link to={Router.Feature()}>Feature</Link>,
          icon: <TeamOutlined />,
          key: "9.1",
        },
      ],
    },
    // {
    //   label: "Logout",
    //   icon: <LogoutOutlined />,
    //   key: "10",
    //   onClick: logout,
    // },
  ];

  const headerItems: MenuProps["items"] = [
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "10",
      onClick: logout,
    },
    {
      label: <Link to="">Change password</Link>,
      icon: <KeyOutlined />,
      key: "1",
    },
  ];

  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible theme="light" className="invoom-sidebar">
        <div className="invoom-logo-container">
          <img
            className="invoom-logo"
            src="/images/logo.png"
            alt="Invoom - Automate. Account. Accelerate."
          />
          <div className="invoom-tagline">
            Automate. Account. Accelerate.
          </div>
        </div>

        <Menu items={items} mode="vertical" selectedKeys={[]} className="invoom-menu" />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="flex items-center !bg-white invoom-header">
          <div className="absolute right-4 cursor-pointer">
            <Dropdown menu={{ items: headerItems }} trigger={["click"]}>
              <Avatar className="invoom-avatar">
                {initials(name || "")}
              </Avatar>
            </Dropdown>
          </div>
        </Layout.Header>

        <Layout.Content className="mx-4 flex flex-col">
          <Breadcrumb className="!my-4 invoom-breadcrumb" items={breadcrumbItems} />

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
