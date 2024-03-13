import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Empty, Popconfirm, Space } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";
import { UserEdit } from "./User/Edit";

import { useRoleDelete, useUserDelete, useRoles } from "../../../api/index";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Roles = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isRoleEditOpen, setIsRoleEditOpen] = useState(false);

  const { data: roles } = useRoles({ restaurantId: restaurantId });
  const { mutateAsync: deleteRole } = useRoleDelete();
  const { mutateAsync: deleteUser } = useUserDelete();

  const showEditUser = (id: string, open: boolean) => {
    setSelectedUserId(id);
    setIsUserEditOpen(open);
  };
  const showEditRole = (id: string, open: boolean) => {
    setSelectedRoleId(id);
    setIsRoleEditOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Teams" }]}>
      <UserEdit
        open={isUserEditOpen}
        showEditUser={showEditUser}
        userId={selectedUserId}
      />
      <Edit
        open={isRoleEditOpen}
        roleId={selectedRoleId}
        showEditRole={showEditRole}
      />

      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showEditRole("", true)}
          type="primary"
        >
          Add Role
        </Button>
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showEditUser("", true)}
          type="primary"
        >
          Add User
        </Button>
      </div>

      <div className="w-full h-full flex overflow-x-scroll">
        {roles.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          roles.map((role) => (
            <Card
              actions={[
                <EditOutlined
                  key="edit-role"
                  onClick={() => showEditRole(role.id, true)}
                />,
                <Popconfirm
                  key="delete-role"
                  onConfirm={() => deleteRole({ id: role.id })}
                  title="Sure to delete?"
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ]}
              bordered={false}
              className="text-center h-full !mr-4 shadow-md flex flex-col !bg-neutral-50"
              key={role.id}
              size="small"
              styles={{
                body: {
                  overflowY: "scroll",
                  height: 0,
                  flexGrow: 1,
                },
              }}
              title={role.name}
            >
              <Space direction="vertical">
                {role?.users?.length ? (
                  role.users.map((user) => (
                    <Card
                      actions={[
                        <EditOutlined
                          key="edit-role"
                          onClick={() => showEditUser(user.id, true)}
                        />,
                        <Popconfirm
                          key="delete-role"
                          onConfirm={() => deleteUser({ id: user.id })}
                          title="Sure to delete?"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                      hoverable
                      key={user.id}
                    >
                      <Avatar
                        size={70}
                        src={`https://picsum.photos/200?id=${user.id}`}
                      />
                      <div className="p-0.5 bg-sky-100 text-blue-700 border-blue-300 border rounded -mt-2 relative text-xs">
                        {user.fullName}
                      </div>
                    </Card>
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Space>
            </Card>
          ))
        )}
      </div>
    </Navbar>
  );
};
