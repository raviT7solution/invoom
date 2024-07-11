import { Button, Col, Form, Input, Row } from "antd";

import { useRestaurantUpdate } from "../../../../api";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  paymentPublishableKey: string;
  paymentSecretKey: string;
};

export const PaymentConfiguration = () => {
  const [form] = Form.useForm<schema>();
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { mutateAsync: restaurantUpdate, isPending } = useRestaurantUpdate();

  const onFinish = async (values: schema) => {
    await restaurantUpdate({
      input: {
        id: restaurantId,
        attributes: values,
      },
    });

    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} preserve={false}>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="Payment Publishable Key"
            name="paymentPublishableKey"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Publishable Key" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label="Payment Secret Key"
            name="paymentSecretKey"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Secret Key" />
          </Form.Item>
        </Col>
      </Row>

      <Button htmlType="submit" loading={isPending} type="primary">
        Submit
      </Button>
    </Form>
  );
};
