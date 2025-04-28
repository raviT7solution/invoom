import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Select } from "antd";
import { useState } from "react";

import {
  useKDSSessionCreate,
  useKitchenProfiles,
  useRestaurants,
} from "../../api/kds";
import { Router } from "../../Routes";
import { useKDSConfigStore } from "../../stores/useKDSConfigStore";
import { useKDSSessionStore } from "../../stores/useKDSSessionStore";

type schema = {
  email: string;
  password: string;
};

type configSchema = {
  kitchenProfileId: string;
  restaurantId: string;
};

const ConfigForm = () => {
  const [form] = Form.useForm<configSchema>();

  const restaurantId = Form.useWatch("restaurantId", form) || "";

  const { data: restaurants } = useRestaurants();
  const { data: kitchenProfiles } = useKitchenProfiles(restaurantId);

  const configure = useKDSConfigStore((s) => s.configure);

  const onFinish = (values: configSchema) => {
    configure("kitchenProfileId", values.kitchenProfileId);
    configure("restaurantId", values.restaurantId);

    Router.push("KDS");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="config-form"
      onFinish={onFinish}
      preserve={false}
    >
      <Form.Item
        label="Restaurant"
        name="restaurantId"
        rules={[{ required: true, message: "Required" }]}
      >
        <Select
          options={restaurants.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          placeholder="Restaurant"
        />
      </Form.Item>

      <Form.Item
        label="Kitchen Profile"
        name="kitchenProfileId"
        rules={[{ required: true, message: "Required" }]}
      >
        <Select
          options={kitchenProfiles.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          placeholder="Select"
        />
      </Form.Item>
    </Form>
  );
};

export const KDSLogin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const create = useKDSSessionStore((s) => s.create);

  const { isPending, mutateAsync } = useKDSSessionCreate();

  const onFinish = async (values: schema) => {
    create(
      (await mutateAsync({ input: { ...values, subject: "kds_admin" } })).token,
    );

    setIsOpen(true);
  };

  return (
    <>
      <Modal
        destroyOnClose
        okButtonProps={{ form: "config-form", htmlType: "submit" }}
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        title="Configure"
      >
        <ConfigForm />
      </Modal>

      <div className="flex h-screen items-center justify-center bg-neutral-100">
        <Card className="w-11/12 drop-shadow-xl lg:w-1/4" title="KDS Login">
          <Form onFinish={onFinish}>
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

            <Form.Item>
              <Button
                block
                htmlType="submit"
                loading={isPending}
                type="primary"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};
