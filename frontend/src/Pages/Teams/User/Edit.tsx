import { Button, Form, Input, Select } from "antd";
import { FormDrawer } from "../../../components/FormDrawer";

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

  const onFinish = async (values: schema) => {
    // isNew
    //   ? await menuCreate({
    //       input: { restaurantId: restaurantId, attributes: values },
    //     })
    //   : await menuUpdate({ input: { attributes: values, id: menuId } });

    onClose();
  };

  const onClose = () => showEditMenu("", false);

  return (
    <FormDrawer
      footer={
        <Button
          form="user- form"
          htmlType="submit"
          // loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New user" : "Edit user"}
    >
      <Form
        // initialValues={isNew ? initialValues : user}
        layout="vertical"
        name="user-form"
        // onFinish={onSave}
        preserve={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Role" name="role">
          <Select
            mode="multiple"
            optionFilterProp="label"
            // options={.map((r) => ({ label: r.name, value: r.id }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
        <Select
          optionFilterProp="label"
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
          placeholder="Select status"
        />
        </Form.Item>

      </Form>
    </FormDrawer>
  );
};
