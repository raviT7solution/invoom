import { Button, Form, Input, Checkbox } from "antd";

import { useMenu, useMenuCreate, useMenuUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  description: string;
  name: string;
  visible: boolean;
};

const initialValues = { description: "", visible: true };

export const Edit = ({
  menuId,
  open,
  showEditMenu,
}: {
  menuId: string;
  open: boolean;
  showEditMenu: (id: string, open: boolean) => void;
}) => {
  const isNew = menuId === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: menu, isFetching } = useMenu(menuId);
  const { mutateAsync: menuCreate, isPending: isCreating } = useMenuCreate();
  const { mutateAsync: menuUpdate, isPending: isUpdating } = useMenuUpdate();

  const onFinish = async (values: schema) => {
    console.log(values);
    isNew
      ? await menuCreate({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await menuUpdate({ input: { attributes: values, id: menuId } });

    onClose();
  };

  const onClose = () => showEditMenu("", false);

  return (
    <FormDrawer
      footer={
        <Button
          form="menu-form"
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
      title={isNew ? "New Menu" : "Edit Menu"}
    >
      <Form
        initialValues={isNew ? initialValues : menu}
        layout="vertical"
        name="menu-form"
        onFinish={onFinish}
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
