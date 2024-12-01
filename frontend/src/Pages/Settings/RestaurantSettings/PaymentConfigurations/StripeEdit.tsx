import { Button, Form, Input, Radio } from "antd";

import { useRestaurant, useRestaurantUpdate } from "../../../../api";
import { RestaurantStripeAccountTypeEnum } from "../../../../api/base";
import { FormDrawer } from "../../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  paymentPublishableKey: string | null;
  paymentSecretKey: string | null;
  stripeAccountId: string | null;
  stripeAccountType: RestaurantStripeAccountTypeEnum;
};

export const StripeEdit = ({
  open,
  showEdit,
}: {
  open: boolean;
  showEdit: (destroyed: boolean, open: boolean) => void;
}) => {
  const id = useRestaurantIdStore((s) => s.restaurantId);

  const restaurant = useRestaurant(id);
  const restaurantUpdate = useRestaurantUpdate();

  const [form] = Form.useForm<schema>();

  const stripeAccountType = Form.useWatch("stripeAccountType", form);
  const isConnect = stripeAccountType === "connect";
  const isOwn = stripeAccountType === "own";

  const onClose = () => showEdit(false, false);
  const afterClose = () => showEdit(true, false);

  const onFinish = async (values: schema) => {
    await restaurantUpdate.mutateAsync({
      input: { id: id, attributes: values },
    });

    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={
        <Button
          form="stripe-payment-form"
          htmlType="submit"
          loading={restaurantUpdate.isPending}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={restaurant.isFetching}
      onClose={onClose}
      open={open}
      title="Configure stripe account"
    >
      <Form
        form={form}
        initialValues={restaurant.data}
        layout="vertical"
        name="stripe-payment-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="Account type"
          name="stripeAccountType"
          rules={[{ required: true, message: "Required" }]}
        >
          <Radio.Group
            onChange={() =>
              form.setFieldsValue({
                paymentPublishableKey: null,
                paymentSecretKey: null,
                stripeAccountId: null,
              })
            }
            options={[
              { label: "Connect account", value: "connect" },
              { label: "Own account", value: "own" },
            ]}
          />
        </Form.Item>

        <Form.Item
          hidden={!isOwn}
          label="Publishable key"
          name="paymentPublishableKey"
          rules={[{ required: isOwn, message: "Required" }]}
        >
          <Input placeholder="Publishable key" />
        </Form.Item>

        <Form.Item
          hidden={!isOwn}
          label="Secret key"
          name="paymentSecretKey"
          rules={[{ required: isOwn, message: "Required" }]}
        >
          <Input placeholder="Secret key" />
        </Form.Item>

        <Form.Item
          hidden={!isConnect}
          label="Connect account ID"
          name="stripeAccountId"
          rules={[{ required: isConnect, message: "Required" }]}
        >
          <Input placeholder="Connect account ID" />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
