import { Col, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { useUserRole, useListUserRoles } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export const View = ({
  roleId,
  open,
  onClose,
}: {
  roleId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const { data: userRole, isFetching } = useUserRole(roleId);
  const { data: masterPermissions } = useListUserRoles("1");
  const [allowedPermissions, setAllowedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Build a set of allowed permission keys for the current role
    const allowed = new Set<string>();
    if (userRole?.menupermissions) {
      userRole.menupermissions.forEach((menu: any) => {
        (menu.subMenu || []).forEach((sub: any) => {
          (sub.action || []).forEach((action: any) => {
            allowed.add(`${menu.navMenuId}_${sub.navSubMenuId}_${action.navMenuActionId}`);
          });
        });
      });
    }
    setAllowedPermissions(allowed);
    if (userRole?.roleName) {
      form.setFieldsValue({ userRoleName: userRole.roleName });
    }
  }, [userRole, form]);

  return (
    <FormDrawer
      footer={null}
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title="View role"
      width={900}
    >
      <Form
        layout="vertical"
        name="role-view-form"
        form={form}
        initialValues={{ userRoleName: userRole?.roleName }}
        disabled
      >
        <Form.Item label="Role Name" name="userRoleName">
          <Input placeholder="Role Name" disabled />
        </Form.Item>

        {/* Permission Grid: Always show all master permissions */}
        {masterPermissions?.menupermissions?.map((navMenu: any) => (
          <div key={navMenu.navMenuId} style={{ marginBottom: 24 }}>
            <div className="bg-gray-200 font-semibold px-4 py-2 rounded mb-2">
              {navMenu.title}
            </div>
            <Row gutter={[16, 16]}>
              {navMenu.subMenu?.map((sub: any) => (
                <Col span={8} key={sub.navSubMenuId}>
                  <div className="font-medium mb-1">{sub.title}</div>
                  <Row>
                    {sub.action?.map((action: any) => {
                      const key = `${navMenu.navMenuId}_${sub.navSubMenuId}_${action.navMenuActionId}`;
                      const allowed = allowedPermissions.has(key);
                      return (
                        <Col span={24} key={action.navMenuActionId} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {allowed ? (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              marginBottom: '2px',
                              background: "green",
                              color: "#fff",
                              fontSize: 16,
                            }}>
                              <CheckOutlined />
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              marginBottom: '2px',
                              background: "red",
                              color: "#fff",
                              fontSize: 16,
                            }}>
                              <CloseOutlined />
                            </span>
                          )}
                          <span>{action.actionName}</span>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Form>
    </FormDrawer>
  );
}; 