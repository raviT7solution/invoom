import { Button, Form, Input } from "antd";

import { useRestaurant, useRestaurantUpdate } from "../../../../api";
import { FormDrawer } from "../../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  twilioAccountSid: string | null;
  twilioAuthToken: string | null;
  twilioSmsPhoneNumber: string | null;
};

export const Edit = ({
  modal,
  setModal,
}: {
  modal: { open: boolean };
  setModal: (i: { open: boolean }) => void;
}) => {
  const id = useRestaurantIdStore((s) => s.restaurantId);

  const restaurant = useRestaurant(id);
  const restaurantUpdate = useRestaurantUpdate();

  const onClose = () => setModal({ open: false });

  const onFinish = async (values: schema) => {
    await restaurantUpdate.mutateAsync({
      input: { id: id, attributes: values },
    });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="sms-configuration-form"
          htmlType="submit"
          loading={restaurantUpdate.isPending}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={restaurant.isFetching}
      onClose={onClose}
      open={modal.open}
      title="Configure twilio account"
    >
      <Form
        initialValues={restaurant.data}
        layout="vertical"
        name="sms-configuration-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="Account SID"
          name="twilioAccountSid"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Account SID" />
        </Form.Item>

        <Form.Item
          label="Auth Token"
          name="twilioAuthToken"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Auth Token" />
        </Form.Item>

        <Form.Item
          label="SMS Phone Number"
          name="twilioSmsPhoneNumber"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="SMS Phone Number" />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
