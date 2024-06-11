import { Button, Col, Form, Input, Row, Typography, notification } from "antd";
import { useState } from "react";

import { useChangePassword } from "../../../api";
import { Navbar } from "../../../components/Navbar";

type schema = {
  currentPassword: string;
  password: string;
};

export const ChangePassword = () => {
  const { mutateAsync, isPending } = useChangePassword();

  const [form] = Form.useForm<schema>();

  const [showPolicy, setShowPolicy] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alpha: false,
    numbers: false,
    specialChars: false,
  });

  const onFinish = async (values: schema) => {
    await mutateAsync({
      input: {
        currentPassword: values.currentPassword,
        password: values.password,
      },
    });

    notification.success({ message: "Password updated successfully." });

    form.resetFields();
    setShowPolicy(false);
  };

  const validatePassword = (_: unknown, value: string) => {
    const validations = {
      length: /^.{8,}$/.test(value),
      alpha: /^(?=.*[A-Z])(?=.*[a-z])/.test(value),
      numbers: /^(?=.*\d)/.test(value),
      specialChars: /^(?=.*[~!@#$%^&*()_\-=+])/.test(value),
    };

    setShowPolicy(true);
    setPasswordValidation(validations);

    const valid = Object.values(validations).every((valid) => valid);

    if (!valid) {
      return Promise.reject("Password does not meet the requirements.");
    }

    return Promise.resolve();
  };

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (value !== form.getFieldValue("password")) {
      return Promise.reject("The new password that you entered do not match");
    }

    return Promise.resolve();
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Setting" }, { title: "Change Password" }]}
    >
      <Typography.Title level={4}>Change Password</Typography.Title>

      <div className="py-4">
        {showPolicy && (
          <>
            <Typography.Title level={5}>The Password should:</Typography.Title>
            <ul>
              <li
                style={{ color: passwordValidation.length ? "green" : "red" }}
              >
                Be at least 8 characters in length
              </li>
              <li style={{ color: passwordValidation.alpha ? "green" : "red" }}>
                Contain both upper and lowercase alphabetic characters (e.g.
                A-Z, a-z)
              </li>
              <li
                style={{ color: passwordValidation.numbers ? "green" : "red" }}
              >
                Have at least one numerical character (e.g. 0-9)
              </li>
              <li
                style={{
                  color: passwordValidation.specialChars ? "green" : "red",
                }}
              >
                Have at least one special character (e.g. ~!@#$%^&*()_-+=)
              </li>
            </ul>
          </>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        name="change-password-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Current Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: "Required" },
                { validator: validatePassword },
              ]}
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              dependencies={["password"]}
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Required" },
                { validator: validateConfirmPassword },
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
          </Col>
        </Row>

        <Button
          form="change-password-form"
          htmlType="submit"
          loading={isPending}
          type="primary"
        >
          Submit
        </Button>
      </Form>
    </Navbar>
  );
};
