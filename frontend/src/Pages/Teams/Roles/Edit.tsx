import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { FormDrawer } from "../../../components/FormDrawer";

type schema = {
  name: string;
  permissions: string[];
};

const initialValues = {
  name: "",
  permissions: [],
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
  const onClose = () => showEditRole("", false);

  const [permissions, setPermissions] = useState<string[]>([]);

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setPermissions((prev) =>
      checked ? [...prev, name] : prev.filter((perm) => perm !== name)
    );
  };

  const onFinish = async (values: schema) => {
    values.permissions = permissions;
    onClose();
  };

  const adminPermissionConfig = [
    {
      key: "dashboard",
      title: "Dashboard",
      options: [{ name: "view_dashboard", label: "View dashboard" }],
    },
    {
      key: "client",
      title: "Client",
      options: [
        { name: "view_client", label: "View client" },
        {
          name: "add_client",
          label: "Add client",
          dependsOn: "view_client",
        },
        {
          name: "edit_client",
          label: "Edit client",
          dependsOn: "view_client",
        },
        {
          name: "delete_client",
          label: "Delete client",
          dependsOn: "view_client",
        },
        {
          name: "suspend",
          label: "Suspend",
          dependsOn: "view_client",
        },
        {
          name: "impersonate",
          label: "Impersonate",
          dependsOn: "view_client",
        },
      ],
    },
    {
      key: "plan",
      title: "Plan",
      options: [
        { name: "view_plan", label: "View plan" },
        {
          name: "add_plan",
          label: "Add plan",
          dependsOn: "view_plan",
        },
        {
          name: "edit_plan",
          label: "Edit plan",
          dependsOn: "view_plan",
        },
        {
          name: "delete_plan",
          label: "Delete plan",
          dependsOn: "view_plan",
        },
      ],
    },
    {
      key: "subscription",
      title: "Subscription",
      options: [
        { name: "active_subscription", label: "Active" },
        {
          name: "modify",
          label: "Modify",
          dependsOn: "active_subscription",
        },
        {
          name: "cancel",
          label: "Cancel",
          dependsOn: "active_subscription",
        },
        {
          name: "upgrade",
          label: "Upgrade",
          dependsOn: "active_subscription",
        },
        {
          name: "view_history",
          label: "View history",
          dependsOn: "active_subscription",
        },
        {
          name: "resend_onboarding_email",
          label: "Resend onboarding email",
          dependsOn: "active_subscription",
        },
        {
          name: "linked_integrations",
          label: "Linked integrations",
          dependsOn: "active_subscription",
        },
        { name: "cancelled_subscription", label: "Cancelled" },
        {
          name: "view_cancellation_history",
          label: "View cancellation history",
          dependsOn: "cancelled_subscription",
        },
        {
          name: "reactive_subscription",
          label: "Reactive Subscription",
          dependsOn: "cancelled_subscription",
        },
        { name: "renewals_subscription", label: "Renewals" },
      ],
    },
  ];

  return (
    <FormDrawer
      footer={
        <Button form="role-form" htmlType="submit" type="primary">
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New role" : "Edit role"}
      width={720}
    >
      <Form
        layout="vertical"
        name="role-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Role Name" />
            </Form.Item>
          </Col>
        </Row>

        <Typography.Title level={3}>Admin Permissions</Typography.Title>
        <Row gutter={[16, 16]}>
          {adminPermissionConfig.map(({ key, title, options }) => {
            const parentOptions = options.filter((opt) => !opt.dependsOn);
            return (
              <Col xs={24} sm={12} md={12} key={key}>
                <Card title={title} bordered className="h-full">
                  <Space direction="vertical" className="w-full">
                    {parentOptions.map((parent) => (
                      <div key={parent.name}>
                        <Checkbox
                          name={parent.name}
                          checked={permissions.includes(parent.name)}
                          onChange={handleCheckboxChange}
                        >
                          {parent.label}
                        </Checkbox>
                        <div className="pl-5 mt-1 flex flex-wrap gap-x-4 gap-y-2">
                          {options
                            .filter((opt) => opt.dependsOn === parent.name)
                            .map((child) => (
                              <Checkbox
                                key={child.name}
                                name={child.name}
                                onChange={handleCheckboxChange}
                                checked={permissions.includes(child.name)}
                                disabled={!permissions.includes(child.dependsOn!)}
                              >
                                {child.label}
                              </Checkbox>
                            ))}
                        </div>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Form>
    </FormDrawer>
  );
};
