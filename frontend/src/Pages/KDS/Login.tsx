import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, List, Modal } from "antd";
import { useState } from "react";

import { useKDSSessionCreate, useRestaurants } from "../../api/kds";
import { Router } from "../../Routes";
import { useKDSConfigStore } from "../../stores/useKDSConfigStore";
import { useKDSSessionStore } from "../../stores/useKDSSessionStore";

type schema = {
  email: string;
  password: string;
};

export const KDSLogin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { create } = useKDSSessionStore((s) => s);
  const { configure } = useKDSConfigStore((s) => s);

  const { data: restaurants } = useRestaurants();
  const { isPending, mutateAsync } = useKDSSessionCreate();

  const onFinish = async (values: schema) => {
    create((await mutateAsync({ input: { ...values, subject: "kds" } })).token);

    setIsOpen(true);
  };

  return (
    <>
      <Modal
        footer={null}
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        title="Select a Restaurant"
      >
        <List
          dataSource={restaurants}
          itemLayout="horizontal"
          renderItem={(r) => (
            <List.Item>
              <List.Item.Meta
                description={`${r.city} ${r.province}`}
                title={
                  <a
                    className="font-bold"
                    onClick={() => {
                      configure("restaurantId", r.id);

                      Router.push("KDS");
                    }}
                  >
                    {r.name}
                  </a>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      <div className="h-screen flex justify-center items-center bg-neutral-100">
        <Card className="drop-shadow-xl w-11/12 lg:w-1/4" title="KDS Login">
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
