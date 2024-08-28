import { Button, Form, Input, Select } from "antd";

import { useRole, useRoleCreate, useRoleUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  name: string;
  permissions: string[];
};

const permissions = [
  {
    label: "Apply Discount",
    value: "apply_discount",
  },
  {
    label: "Clock In / Clock Out",
    value: "clock_in_clock_out",
  },
  {
    label: "Delete Order Item",
    value: "delete_ticket_item",
  },
  {
    label: "Floor Plan",
    value: "floor_plan",
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
        initialValues={role}
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
      </Form>
    </FormDrawer>
  );
};
