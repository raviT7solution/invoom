import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input } from "antd";

import { useAdminSessionCreate } from "../api";
import { Router } from "../Routes";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

type schema = {
  email: string;
  password: string;
};

export const Login = () => {
  const [form] = Form.useForm<schema>();

  const { isLoading, mutateAsync } = useAdminSessionCreate();
  const create = useAdminSessionStore((s) => s.create);

  const onFinish = async (values: schema) => {
    create((await mutateAsync({ input: values })).adminSessionCreate.token);

    Router.push("Dashboard");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-neutral-100">
      <Card className="drop-shadow-xl w-11/12 lg:w-1/4" title="Login">
        <Form form={form} onFinish={onFinish}>
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
            <Button block htmlType="submit" loading={isLoading} type="primary">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
