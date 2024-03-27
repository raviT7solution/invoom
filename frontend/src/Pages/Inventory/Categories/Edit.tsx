import { Button, Form, Input, Checkbox } from "antd";

import {
  useInventoryCategory,
  useInventoryCategoryCreate,
  useInventoryCategoryUpdate,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  description: string;
  menuIds: string[];
  name: string;
  visible: boolean;
};

const initialValues = { description: "", visible: true };

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

  const { data: category, isFetching } = useInventoryCategory(categoryId);
  const { mutateAsync: inventoryCategoryCreate, isPending: isCreating } =
    useInventoryCategoryCreate();
  const { mutateAsync: inventoryCategoryUpdate, isPending: isUpdating } =
    useInventoryCategoryUpdate();

  const onClose = () => showEditCategory("", false);

  const onSave = async (values: schema) => {
    isNew
      ? await inventoryCategoryCreate({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await inventoryCategoryUpdate({
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

        <Form.Item label="Description" name="description">
          <Input placeholder="Description" />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
