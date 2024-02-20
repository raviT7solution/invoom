import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";

import {
  useAddons,
  useCategories,
  useItem,
  useItemCreate,
  useItemUpdate,
  useModifiers,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  addonIds: string[];
  categoryId: string;
  costOfProduction: number;
  deliveryPrice: number;
  description: string;
  displayName: string;
  modifierIds: string[];
  name: string;
  price: number;
  takeOutPrice: number;
  visible: boolean;
};

const initialValues = {
  costOfProduction: 0,
  deliveryPrice: 0,
  description: "",
  displayName: "",
  name: "",
  price: 0,
  takeOutPrice: 0,
  visible: true,
};

export const Edit = ({
  itemId,
  open,
  showEditItem,
}: {
  itemId: string;
  open: boolean;
  showEditItem: (id: string, open: boolean) => void;
}) => {
  const isNew = itemId === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: item, isFetching } = useItem(itemId);
  const { data: addons } = useAddons(restaurantId);
  const { data: categories } = useCategories(restaurantId);
  const { data: modifiers } = useModifiers(restaurantId);

  const { mutateAsync: itemCreate, isPending: isCreating } = useItemCreate();
  const { mutateAsync: itemUpdate, isPending: isUpdating } = useItemUpdate();

  const onClose = () => showEditItem("", false);

  const onSave = async (values: schema) => {
    const attributes = { ...values };

    isNew
      ? await itemCreate({
          input: { restaurantId: restaurantId, attributes: attributes },
        })
      : await itemUpdate({
          input: { attributes: attributes, id: itemId },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="item-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Item" : "Edit Item"}
    >
      <Form
        initialValues={isNew ? initialValues : item}
        layout="vertical"
        name="item-form"
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
          label="Display Name"
          name="displayName"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Display Name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            options={categories.map((a) => ({ label: a.name, value: a.id }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Modifiers"
          name="modifierIds"
          rules={[{ required: false, message: "Required" }]}
        >
          <Select
            mode="multiple"
            options={modifiers.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Addons"
          name="addonIds"
          rules={[{ required: false, message: "Required" }]}
        >
          <Select
            mode="multiple"
            options={addons.map((a) => ({ label: a.name, value: a.id }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: false, message: "Required" }]}
        >
          <Input placeholder="Description" />
        </Form.Item>

        <Form.Item
          label="Cost Of Production"
          name="costOfProduction"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            min={0}
            placeholder="Cost Of Production"
            prefix="$"
            style={{ width: "100%" }}
          />
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
          name="takeOutPrice"
          rules={[{ required: true, message: "Required" }]}
        >
          <InputNumber
            min={0}
            placeholder="TakeOut Price"
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
