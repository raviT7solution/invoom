import { Button, Form, Input, Checkbox, Select } from "antd";

import {
  useCategory,
  useCategoryCreate,
  useCategoryUpdate,
  useMenus,
  useSettingsTaxes,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  menuIds: string[];
  name: string;
  taxId?: string;
  visible: boolean;
};

const initialValues = { visible: true };

export const Edit = ({
  categoryId,
  open,
  showEditCategory,
}: {
  categoryId: string;
  open: boolean;
  showEditCategory: (id: string, open: boolean) => void;
}) => {
  const isNew = categoryId === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: category, isFetching } = useCategory(categoryId);
  const { mutateAsync: categoryCreate, isPending: isCreating } =
    useCategoryCreate();
  const { mutateAsync: categoryUpdate, isPending: isUpdating } =
    useCategoryUpdate();

  const { data: menus } = useMenus(restaurantId);
  const { data: taxes } = useSettingsTaxes(restaurantId);

  const onClose = () => showEditCategory("", false);

  const onSave = async (values: schema) => {
    isNew
      ? await categoryCreate({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await categoryUpdate({
          input: { attributes: values, id: categoryId },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="category-form"
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
      title={isNew ? "New Category" : "Edit Category"}
    >
      <Form
        initialValues={isNew ? initialValues : category}
        layout="vertical"
        name="category-form"
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
          label="Menu"
          name="menuIds"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={menus.map((r) => ({ label: r.name, value: r.id }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item label="Tax" name="taxId">
          <Select
            options={taxes.map((i) => ({
              label: i.displayName,
              value: i.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
