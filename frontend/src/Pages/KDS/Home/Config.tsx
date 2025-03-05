import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  Menu,
  Space,
  Typography,
  CollapseProps,
  Select,
  Modal,
  Form,
  Input,
} from "antd";
import { useState } from "react";

import {
  logout,
  useCurrentAdmin,
  useKDSSessionCreate,
  useKitchenProfiles,
  useRestaurants,
} from "../../../api/kds";
import { BOOKING_TYPES } from "../../../helpers/mapping";
import { useKDSConfigStore } from "../../../stores/useKDSConfigStore";
import { useKDSSessionStore } from "../../../stores/useKDSSessionStore";

type schema = {
  email: string;
  password: string;
};

const AccountSection = () => {
  const { data: currentAdmin } = useCurrentAdmin();
  const { data: restaurants } = useRestaurants();
  const { isPending, mutateAsync } = useKDSSessionCreate();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { configure, restaurantId } = useKDSConfigStore();
  const create = useKDSSessionStore((s) => s.create);

  const onFinish = async (values: schema) => {
    create(
      (await mutateAsync({ input: { ...values, subject: "kds_admin" } })).token,
    );

    configure("restaurantId", selectedRestaurantId);
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        destroyOnClose
        footer={
          <Button
            form="login"
            htmlType="submit"
            loading={isPending}
            type="primary"
          >
            Submit
          </Button>
        }
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        title="Admin Verification"
      >
        <Form
          layout="vertical"
          name="login"
          onFinish={onFinish}
          preserve={false}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Email" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Password"
              prefix={<LockOutlined />}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Space className="w-full" direction="vertical">
        <Typography.Title level={5}>{currentAdmin?.fullName}</Typography.Title>

        <Typography.Text type="secondary">Restaurant</Typography.Text>

        <Select
          className="w-full"
          onChange={(v) => {
            setSelectedRestaurantId(v);
            setIsOpen(true);
          }}
          options={restaurants.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          value={restaurantId}
        />

        <Button danger onClick={logout} type="primary">
          Logout
        </Button>
      </Space>
    </>
  );
};

export const ConfigureMenu = () => {
  const { configure, bookingTypes, kitchenProfileId, restaurantId } =
    useKDSConfigStore();

  const { data: kitchenProfiles } = useKitchenProfiles(restaurantId);

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Booking Type",
      children: (
        <Menu
          items={Object.entries(BOOKING_TYPES).map(([k, v]) => ({
            key: k,
            label: v,
          }))}
          multiple
          onDeselect={(e) =>
            configure(
              "bookingTypes",
              bookingTypes.filter((i) => i !== e.key),
            )
          }
          onSelect={(e) => configure("bookingTypes", [...bookingTypes, e.key])}
          selectedKeys={bookingTypes}
        />
      ),
    },
    {
      key: "2",
      label: "Kitchen Profile",
      children: (
        <Menu
          items={kitchenProfiles.map((i) => ({ key: i.id, label: i.name }))}
          onClick={(e) => configure("kitchenProfileId", e.key)}
          selectedKeys={[kitchenProfileId]}
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
