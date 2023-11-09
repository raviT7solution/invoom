import { Button, Col, Divider, Form, Input, Row, Select } from "antd";

import {
  useRoles,
  useUser,
  useUserCreate,
  useUserUpdate,
} from "../../../../api";
import { FormDrawer } from "../../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  startDate: string;
  wage: number;
  password: string;
  pin?: string;
  roleIds: string[];
};

const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const UserEdit = ({
  open,
  showEditUser,
  userId,
}: {
  open: boolean;
  showEditUser: (id: string, open: boolean) => void;
  userId: string;
}) => {
  const isNew = userId === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: roles } = useRoles({ restaurantId: restaurantId });
  const { data: user, isFetching } = useUser(userId);
  const { mutateAsync: userCreate, isPending: isCreating } = useUserCreate();
  const { mutateAsync: userUpdate, isPending: isUpdating } = useUserUpdate();

  const onClose = () => showEditUser("", false);

  const onFinish = async (values: schema) => {
    const attributes = { ...values, restaurantIds: [restaurantId] };

    isNew
      ? await userCreate({ input: { attributes: attributes } })
      : await userUpdate({ input: { attributes: attributes, id: userId } });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="user-form"
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
      title={isNew ? "New User" : "Edit User"}
      width={720}
    >
      <Form
        initialValues={user}
        layout="vertical"
        name="user-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Gender" name="gender">
              <Select options={genders} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Phone"
              name="phoneNumber"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Address details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="Address Line" name="address">
              <Input placeholder="Address Line" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Postal Code" name="zipCode">
              <Input placeholder="Postal Code" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Employment details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              getValueFromEvent={(e) => parseFloat(e.target.value)}
              label="Wage"
              name="wage"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Wage" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Security details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: isNew, message: "Required" }]}
            >
              <Input placeholder="Password" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Pin" name="pin">
              <Input placeholder="Pin" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Roles
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Role"
              name="roleIds"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                mode="multiple"
                options={roles?.map((r) => ({ label: r.name, value: r.id }))}
                placeholder="Select"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};
