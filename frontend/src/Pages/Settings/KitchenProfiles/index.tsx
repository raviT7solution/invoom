import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, List, Popconfirm } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useKitchenProfileDelete, useKitchenProfiles } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const KitchenProfiles = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [selectedKitchenProfileId, setSelectedKitchenProfileId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching } = useKitchenProfiles(restaurantId);
  const { mutateAsync } = useKitchenProfileDelete();

  const showEditKitchenProfile = (id: string, open: boolean) => {
    setSelectedKitchenProfileId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Settings" }, { title: "Kitchen Profiles" }]}
    >
      <Edit
        kitchenProfileId={selectedKitchenProfileId}
        open={isModalOpen}
        showEditKitchenProfile={showEditKitchenProfile}
      />

      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditKitchenProfile("", true)}
          type="primary"
        >
          Add Kitchen Profile
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
                onClick={() => showEditKitchenProfile(i.id, true)}
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
