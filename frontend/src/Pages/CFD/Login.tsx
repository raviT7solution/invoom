import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Select } from "antd";
import { useState } from "react";

import { useCFDSessionCreate, useDevices, useRestaurants } from "../../api/cfd";
import { Router } from "../../Routes";
import { useCFDConfigStore } from "../../stores/useCFDConfigStore";
import { useCFDSessionStore } from "../../stores/useCFDSessionStore";

type schema = {
  email: string;
  password: string;
};

type configSchema = {
  deviceId: string;
  restaurantId: string;
};

const ConfigForm = () => {
  const [form] = Form.useForm<configSchema>();

  const restaurantId = Form.useWatch("restaurantId", form) || "";

  const configure = useCFDConfigStore((s) => s.configure);

  const devices = useDevices(restaurantId);
  const restaurants = useRestaurants();

  const onFinish = (values: configSchema) => {
    configure("deviceId", values.deviceId);
    configure("restaurantId", values.restaurantId);

    Router.push("CFD");
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
          options={restaurants.data.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          placeholder="Restaurant"
        />
      </Form.Item>

      <Form.Item
        label="Device"
        name="deviceId"
        rules={[{ required: true, message: "Required" }]}
      >
        <Select
          options={devices.data.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          placeholder="Select"
        />
      </Form.Item>
    </Form>
  );
};

export const CFDLogin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const create = useCFDSessionStore((s) => s.create);

  const { isPending, mutateAsync } = useCFDSessionCreate();

  const onFinish = async (values: schema) => {
    create(
      (await mutateAsync({ input: { ...values, subject: "cfd_admin" } })).token,
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
        <Card className="w-11/12 drop-shadow-xl lg:w-1/4" title="CFD Login">
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
