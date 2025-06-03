import {
  UserAddOutlined
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";
import { UserEdit } from "./User/Edit";

import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Roles = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isRoleEditOpen, setIsRoleEditOpen] = useState(false);
  const [userModal, setUserModal] = useState({
    destroyed: false,
    id: "",
    open: false,
  });

  // const { data: roles } = useRoles({ restaurantId: restaurantId });
  // const { mutateAsync: deleteRole } = useRoleDelete();
  // const { mutateAsync: deleteUser } = useUserDelete();

  const showEditUser = (destroyed: boolean, id: string, open: boolean) => {
    setUserModal({ destroyed, id, open });
  };

  const showEditRole = (id: string, open: boolean) => {
    setSelectedRoleId(id);
    setIsRoleEditOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Teams" }]}>
      {!userModal.destroyed && (
        <UserEdit
          id={userModal.id}
          open={userModal.open}
          showEdit={showEditUser}
        />
      )}

      <Edit
        open={isRoleEditOpen}
        roleId={selectedRoleId}
        showEditRole={showEditRole}
      />

      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showEditRole("", true)}
          type="primary"
        >
          Add role
        </Button>
        <Button
          icon={<UserAddOutlined />}
          onClick={() => showEditUser(false, "", true)}
          type="primary"
        >
          Add user
        </Button>
      </div>

      <div className="flex h-full w-full overflow-x-scroll">
        {/* {roles.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
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
              className="!mr-4 flex h-full flex-col !bg-neutral-50 text-center shadow-md"
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
                          onClick={() => showEditUser(false, user.id, true)}
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
                      <div className="relative -mt-2 rounded border border-blue-300 bg-sky-100 p-0.5 text-xs text-blue-700">
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
        )} */}
      </div>
    </Navbar>
  );
};
