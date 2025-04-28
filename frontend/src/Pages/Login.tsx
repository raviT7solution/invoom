import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input } from "antd";

import { useAdminSessionCreate } from "../api";
import { assetsPath } from "../helpers/assets";
import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

type schema = {
  email: string;
  password: string;
};

export const Login = () => {
  const { isPending, mutateAsync } = useAdminSessionCreate();
  const create = useAdminSessionStore((s) => s.create);

  const onFinish = async (values: schema) => {
    create(
      (await mutateAsync({ input: { ...values, subject: "web_admin" } }))
        .adminSessionCreate.token,
    );

    Router.push("Dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <Card
        className="w-11/12 drop-shadow-xl lg:w-1/4"
        title={
          <img
            className="m-auto h-14"
            src={assetsPath("logo/horizontal.png")}
          />
        }
      >
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
            <Checkbox defaultChecked>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button block htmlType="submit" loading={isPending} type="primary">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
