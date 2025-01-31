import { Button, Checkbox, Form, Input, Select } from "antd";

import { useRole, useRoleCreate, useRoleUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  autoClockIn: boolean;
  name: string;
  permissions: string[];
};

const permissions = [
  {
    label: "Apply discount",
    value: "apply_discount",
  },
  {
    label: "Clock in / Clock out",
    value: "clock_in_clock_out",
  },
  {
    label: "Delete order item",
    value: "delete_ticket_item",
  },
  {
    label: "Edit Item",
    value: "edit_item",
  },
  {
    label: "Floor plan",
    value: "floor_plan",
  },
  {
    label: "Force clock out",
    value: "force_clock_out",
  },
  {
    label: "Force unlock",
    value: "force_unlock",
  },
  {
    label: "Inventory",
    value: "inventory",
  },
  {
    label: "Orders",
    value: "orders",
  },
  {
    label: "Payments",
    value: "payments",
  },
  {
    label: "Reservations",
    value: "reservations",
  },
  {
    label: "Takeout",
    value: "takeout",
  },
];

const initialValues = {
  autoClockIn: true,
};

export const Edit = ({
  roleId,
  open,
  showEditRole,
}: {
  roleId: string;
  open: boolean;
  showEditRole: (id: string, open: boolean) => void;
}) => {
  const isNew = roleId === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: role, isFetching } = useRole(roleId);
  const { mutateAsync: roleCreate, isPending: isCreating } = useRoleCreate();
  const { mutateAsync: roleUpdate, isPending: isUpdating } = useRoleUpdate();

  const onClose = () => showEditRole("", false);

  const onFinish = async (values: schema) => {
    isNew
      ? await roleCreate({
          input: { attributes: values, restaurantId: restaurantId },
        })
      : await roleUpdate({ input: { attributes: values, id: roleId } });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="role-form"
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
      title={isNew ? "New Role" : "Edit Role"}
    >
      <Form
        initialValues={isNew ? initialValues : role}
        layout="vertical"
        name="role-form"
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
        <Form.Item
          label="Permissions"
          name="permissions"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={permissions}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item name="autoClockIn" valuePropName="checked">
          <Checkbox>Auto Clock-In</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
