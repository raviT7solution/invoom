import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import {
  useListUserRoles,
  useUserRole,
  useUserRoleCreate,
  useUserRoleUpdate,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";

export type RoleSchema = {
  userRoleName: string;
  branchId: number;
  isDefault: number;
  permissions: Array<{
    navMenuId: number;
    navSubMenuId: number;
    navMenuActionId: number;
    status: string;
  }>;
};

const initialValues: RoleSchema = {
  userRoleName: "",
  branchId: 1,
  isDefault: 0,
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
  const [form] = Form.useForm();
  const isNew = roleId === "";

  const { data } = useListUserRoles("1");
  const { mutateAsync: userRoleCreate, isPending: isCreating } = useUserRoleCreate();
  const { mutateAsync: userRoleUpdate, isPending: isUpdating } = useUserRoleUpdate(roleId);
  const { data: userRole, isFetching } = useUserRole(roleId);

  const [permissionsState, setPermissionsState] = useState<Record<string, number[]>>({});

  const onFinish = async (values: any) => {
    const permissions: RoleSchema["permissions"] = [];

    if (data?.menupermissions) {
      data.menupermissions.forEach((navMenu: any) => {
        (navMenu.subMenu || []).forEach((sub: any) => {
          const checkedActions = permissionsState[sub.title] || [];
          (sub.action || []).forEach((action: any) => {
            if (checkedActions.includes(action.navMenuActionId)) {
              permissions.push({
                navMenuId: parseInt(navMenu.navMenuId),
                navSubMenuId: parseInt(sub.navSubMenuId),
                navMenuActionId: action.navMenuActionId,
                status: "active",
              });
            }
          });
        });
      });
    }

    const payload: RoleSchema = {
      userRoleName: values.userRoleName,
      branchId: 1,
      isDefault: 0,
      permissions,
    };

    isNew ? await userRoleCreate(payload) : await userRoleUpdate(payload);
    onClose();
  };

  const onClose = () => {
    setPermissionsState({});
    form.resetFields();
    showEditRole("", false);
  };

  useEffect(() => {
    if (userRole?.menupermissions) {
      const permissionMap: Record<string, number[]> = {};

      userRole.menupermissions.forEach((menu: any) => {
        (menu.subMenu || []).forEach((sub: any) => {
          const activeActionIds = (sub.action || [])
            .map((action: any) => action.navMenuActionId);

          if (activeActionIds.length > 0) {
            permissionMap[sub.title] = activeActionIds;
          }
        });
      });

      form.setFieldsValue({
        userRoleName: userRole.roleName,
      });

      setPermissionsState(permissionMap);
    }
  }, [userRole, form]);

  return (
    <FormDrawer
      footer={
        <Button
          form="role-form"
          htmlType="submit"
          type="primary"
          loading={isCreating || isUpdating}
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New role" : "Edit role"}
      width={900}
    >
      <Form
        layout="vertical"
        name="role-form"
        onFinish={onFinish}
        preserve={false}
        form={form}
        initialValues={isNew ? initialValues : { ...userRole, userRoleName: userRole?.roleName }}
      >
        <Form.Item
          label="Role Name"
          name="userRoleName"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Role Name" />
        </Form.Item>

        {/* Permission Grid */}
        {data?.menupermissions?.map((navMenu: any) => (
          <div key={navMenu.navMenuId} style={{ marginBottom: 24 }}>
            <div className="bg-gray-200 font-semibold px-4 py-2 rounded mb-2">
              {navMenu.title}
            </div>
            <Row gutter={[16, 16]}>
              {navMenu.subMenu?.map((sub: any) => (
                <Col span={8} key={sub.navSubMenuId}>
                  <div className="font-medium mb-1">{sub.title}</div>
                  <Checkbox.Group
                    value={permissionsState[sub.title] || []}
                    onChange={(checked) => {
                      setPermissionsState((prev) => ({
                        ...prev,
                        [sub.title]: checked as number[],
                      }));
                    }}
                  >
                    <Row>
                      {sub.action?.map((action: any) => (
                        <Col span={24} key={action.navMenuActionId}>
                          <Checkbox value={action.navMenuActionId}>
                            {action.actionName}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Form>
    </FormDrawer>
  );
};
