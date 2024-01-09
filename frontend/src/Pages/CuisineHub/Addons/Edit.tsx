import { Button, Checkbox, Form, Input, InputNumber } from "antd";

import { useAddon, useAddonsCreate, useAddonsUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  name: string;
  price: number;
  takeoutPrice: number;
  deliveryPrice: number;
  visible: boolean;
};

const initialValues = {
  name: "",
  visible: true,
  price: 0,
  takeoutPrice: 0,
  deliveryPrice: 0,
};

export const Edit = ({
  addonId,
  open,
  showEditAddon,
}: {
  addonId: string;
  open: boolean;
  showEditAddon: (id: string, open: boolean) => void;
}) => {
  const isNew = addonId === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: addon, isFetching } = useAddon(addonId);

  const { mutateAsync: addonsCreate, isPending: isCreating } =
    useAddonsCreate();
  const { mutateAsync: addonsUpdate, isPending: isUpdating } =
    useAddonsUpdate();

  const onClose = () => showEditAddon("", false);

  const onSave = async (values: schema) => {
    const attributes = { ...values };
    isNew
      ? await addonsCreate({
          input: { attributes: attributes, restaurantId: restaurantId },
        })
      : await addonsUpdate({
          input: { attributes: attributes, id: addonId },
        });
    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="addons-form"
          htmlType="submit"
          key="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Addons" : "Edit Addons"}
    >
      <Form
        initialValues={isNew ? initialValues : addon}
        layout="vertical"
        name="addons-form"
        onFinish={onSave}
        preserve={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            min={0}
            placeholder="Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Takeout Price"
          name="takeoutPrice"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            min={0}
            placeholder="Takeout Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Delivery Price"
          name="deliveryPrice"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            min={0}
            placeholder="Delivery Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
