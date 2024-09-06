import { Button, Checkbox, Form, Input, InputNumber } from "antd";

import { useAddon, useAddonsCreate, useAddonsUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  deliveryPrice: number;
  eqPrice: boolean;
  name: string;
  price: number;
  takeoutPrice: number;
  visible: boolean;
};

const initialValues = {
  deliveryPrice: 0,
  eqPrice: true,
  name: "",
  price: 0,
  takeoutPrice: 0,
  visible: true,
};

export const Edit = ({
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (destroyed: boolean, id: string, open: boolean) => void;
}) => {
  const isNew = id === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: addon, isFetching } = useAddon(id);

  const { mutateAsync: addonsCreate, isPending: isCreating } =
    useAddonsCreate();
  const { mutateAsync: addonsUpdate, isPending: isUpdating } =
    useAddonsUpdate();

  const [form] = Form.useForm<schema>();
  const eqPrice = !!Form.useWatch("eqPrice", form);

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onSave = async (attributes: schema) => {
    isNew
      ? await addonsCreate({
          input: { attributes: attributes, restaurantId: restaurantId },
        })
      : await addonsUpdate({
          input: { attributes: attributes, id: id },
        });
    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
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
        form={form}
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
            onChange={(e) => {
              if (eqPrice)
                form.setFieldsValue({
                  deliveryPrice: e ?? 0,
                  takeoutPrice: e ?? 0,
                });
            }}
            placeholder="Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="eqPrice" name="eqPrice" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              if (e)
                form.setFieldsValue({
                  deliveryPrice: form.getFieldValue("price"),
                  takeoutPrice: form.getFieldValue("price"),
                });
            }}
          >
            = Price
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="Takeout Price"
          name="takeoutPrice"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            disabled={eqPrice}
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
            disabled={eqPrice}
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
