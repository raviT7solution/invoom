import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

import { useKDSSessionCreate } from "../../api/kds";
import { Router } from "../../Routes";
import { useKDSSessionStore } from "../../stores/useKDSSessionStore";

type schema = {
  email: string;
  password: string;
};

export const KDSLogin = () => {
  const { isPending, mutateAsync } = useKDSSessionCreate();
  const create = useKDSSessionStore((s) => s.create);

  const onFinish = async (values: schema) => {
    create((await mutateAsync({ input: { ...values, subject: "kds" } })).token);

    Router.push("KDS");
  };

  return (
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
            <Button block htmlType="submit" loading={isPending} type="primary">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
