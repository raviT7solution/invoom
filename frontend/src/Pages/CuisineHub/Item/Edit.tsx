import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";

import {
  useAddons,
  useCategories,
  useItem,
  useItemCreate,
  useItemUpdate,
  useModifiers,
  useSettingsTaxes,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { UOM } from "../../../helpers/mapping";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  addonIds: string[];
  categoryId: string;
  costOfProduction: number;
  deliveryPrice: number;
  description: string;
  displayName: string;
  eqPrice: boolean;
  modifierIds: string[];
  name: string;
  price: number;
  takeoutPrice: number;
  taxId: string;
  visible: boolean;
};

const initialValues = {
  costOfProduction: 0,
  deliveryPrice: 0,
  description: "",
  displayName: "",
  eqPrice: true,
  name: "",
  price: 0,
  takeoutPrice: 0,
  uom: "item",
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

  const { data: item, isFetching } = useItem(id);
  const { data: addons } = useAddons(restaurantId);
  const { data: categories } = useCategories(restaurantId);
  const { data: modifiers } = useModifiers(restaurantId);
  const { data: taxes } = useSettingsTaxes(restaurantId);

  const { mutateAsync: itemCreate, isPending: isCreating } = useItemCreate();
  const { mutateAsync: itemUpdate, isPending: isUpdating } = useItemUpdate();

  const [form] = Form.useForm<schema>();
  const eqPrice = !!Form.useWatch("eqPrice", form);

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onSave = async (values: schema) => {
    const attributes = { ...values };

    isNew
      ? await itemCreate({
          input: { restaurantId: restaurantId, attributes: attributes },
        })
      : await itemUpdate({
          input: { attributes: attributes, id: id },
        });

    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
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
        form={form}
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
          <Input
            onChange={(e) =>
              form.setFieldsValue({ displayName: e.target.value })
            }
            placeholder="Name"
          />
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
            onChange={(v) => {
              const category = categories.find((i) => i.id === v);

              if (category?.taxId)
                form.setFieldsValue({
                  taxId: category.taxId,
                });
            }}
            options={categories.map((i) => ({
              label: i.name,
              value: i.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Tax"
          name="taxId"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            options={taxes.map((r) => ({
              label: r.displayName,
              value: r.id,
            }))}
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
            optionFilterProp="label"
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
            optionFilterProp="label"
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
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            onChange={(e: number | null) => {
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

        <Form.Item name="eqPrice" valuePropName="checked">
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
          label="UOM"
          name="uom"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            options={Object.entries(UOM).map(([value, label]) => ({
              label,
              value,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Takeout Price"
          name="takeoutPrice"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            disabled={eqPrice}
            placeholder="TakeOut Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Delivery Price"
          name="deliveryPrice"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            disabled={eqPrice}
            placeholder="Delivery Price"
            prefix="$"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Cost Of Production"
          name="costOfProduction"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            placeholder="Cost Of Production"
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
