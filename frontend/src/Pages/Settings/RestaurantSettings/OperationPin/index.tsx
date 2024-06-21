import { Button, Col, Form, Input, Row } from "antd";

import { useRestaurantUpdate } from "../../../../api";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  pin: string;
  confirmPin: string;
};

const initialValues = { pin: "", confirmPin: "" };

export const OperationPin = () => {
  const [form] = Form.useForm<schema>();
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { mutateAsync: restaurantUpdate, isPending } = useRestaurantUpdate();

  const onFinish = async (values: schema) => {
    await restaurantUpdate({
      input: { id: restaurantId, attributes: { pin: values.pin } },
    });

    form.resetFields();
  };

  const validateConfirmPin = (_: unknown, value: string) => {
    const pinValue = form.getFieldValue("pin");

    if (value !== pinValue) {
      return Promise.reject("The Pin is not matched with confirm pin");
    }

    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onFinish}
      preserve={false}
    >
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="Pin"
            name="pin"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Pin" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="Confirm Pin"
            name="confirmPin"
            rules={[
              { required: true, message: "Required" },
              { validator: validateConfirmPin },
            ]}
          >
            <Input placeholder="Confirm Pin" />
          </Form.Item>
        </Col>
      </Row>

      <Button htmlType="submit" loading={isPending} type="primary">
        Submit
      </Button>
    </Form>
  );
};
