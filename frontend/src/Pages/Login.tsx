import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input } from "antd";

import { Router } from "../Routes";
import { useAdminSessionCreate } from "../api";
import { useAdminDataStore } from "../stores/useAdminDataStore";
import { useAdminSessionStore } from "../stores/useAdminSessionStore";

type schema = {
  username: string;
  password: string;
};

export const Login = () => {
  const { isPending, mutateAsync } = useAdminSessionCreate();
  const createSession = useAdminSessionStore((s) => s.create);
const createAdminData = useAdminDataStore((s) => s.create);

const onFinish = async (values: schema) => {
  const res = await mutateAsync(values);

  createSession(res.response.token);
  createAdminData(res.response.user.userFrontId, res.response.user.name);

  Router.push("Dashboard");
};

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <Card
        className="w-11/12 drop-shadow-xl lg:w-1/4"
        title={
          <img
            className="m-auto h-10"
            src="./src/assets/logo.png"
          />
        }
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Username" prefix={<UserOutlined />} />
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
            <Button block htmlType="submit" loading={isPending}  type="primary">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
