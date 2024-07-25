import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select } from "antd";

import {
  useCategories,
  useItems,
  useModifier,
  useModifierCreate,
  useModifierUpdate,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  categoryIds: string[];
  globalModifier: boolean;
  values: string[];
  multiSelect: boolean;
  name: string;
  visible: boolean;
};

const initialValues = {
  globalModifier: true,
  values: [""],
  multiSelect: true,
  name: "",
  visible: true,
};

export const Edit = ({
  modifierId,
  open,
  showEditModifier,
}: {
  modifierId: string;
  open: boolean;
  showEditModifier: (id: string, open: boolean) => void;
}) => {
  const isNew = modifierId === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { mutateAsync: modifierCreate, isPending: isCreating } =
    useModifierCreate();
  const { mutateAsync: modifierUpdate, isPending: isUpdating } =
    useModifierUpdate();

  const { data: modifier, isFetching } = useModifier(modifierId);
  const { data: categories } = useCategories(restaurantId);
  const { data: items } = useItems(restaurantId);

  const onClose = () => showEditModifier("", false);

  const onSave = async (values: schema) => {
    const attributes = { ...values };

    isNew
      ? await modifierCreate({
          input: { attributes: attributes, restaurantId: restaurantId },
        })
      : await modifierUpdate({
          input: { attributes: attributes, id: modifierId },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="modifier-form"
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
      title={isNew ? "New Modifier" : "Edit Modifier"}
    >
      <Form
        initialValues={isNew ? initialValues : modifier}
        layout="vertical"
        name="modifier-form"
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

        <Form.List name="values">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div className="flex gap-2" key={field.key}>
                  <Form.Item
                    label="Options"
                    name={field.name}
                    rules={[
                      {
                        required: true,
                        message: "Required",
                      },
                    ]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>

                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </div>
              ))}

              <Form.Item>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                  type="dashed"
                >
                  Add Options
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Categories"
          name="categoryIds"
          rules={[{ required: false, message: "Required" }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={categories.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Items"
          name="itemIds"
          rules={[{ required: false, message: "Required" }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={items?.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item name="multiSelect" valuePropName="checked">
          <Checkbox>Multi-Select Values</Checkbox>
        </Form.Item>

        <Form.Item name="globalModifier" valuePropName="checked">
          <Checkbox>Global Modifier</Checkbox>
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
