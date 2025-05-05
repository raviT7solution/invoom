import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, List, Popconfirm } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useKitchenProfileDelete, useKitchenProfiles } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const KitchenProfiles = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [modal, setModal] = useState({ destroyed: false, id: "", open: false });

  const { data, isFetching } = useKitchenProfiles(restaurantId);
  const { mutateAsync } = useKitchenProfileDelete();

  const showEdit = (destroyed: boolean, id: string, open: boolean) => {
    setModal({ destroyed, id, open });
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Settings" }, { title: "Kitchen profiles" }]}
    >
      {!modal.destroyed && (
        <Edit id={modal.id} open={modal.open} showEdit={showEdit} />
      )}

      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEdit(false, "", true)}
          type="primary"
        >
          Add kitchen profile
        </Button>
      </div>

      <List
        bordered
        dataSource={data}
        itemLayout="horizontal"
        loading={isFetching}
        renderItem={(i) => (
          <List.Item
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => showEdit(false, i.id, true)}
              />,
              <Popconfirm
                key="delete"
                onConfirm={() => mutateAsync({ id: i.id })}
                title="Are you sure you'd like to delete this?"
              >
                <DeleteOutlined />
              </Popconfirm>,
            ]}
          >
            <b>{i.name}</b>
          </List.Item>
        )}
        size="large"
      />
    </Navbar>
  );
};
