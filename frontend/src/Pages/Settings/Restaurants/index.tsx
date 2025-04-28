import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, List, Space } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useRestaurants } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Restaurants = () => {
  const { data: activeRestaurants } = useRestaurants("active");
  const { data: pendingRestaurants } = useRestaurants("pending");

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [modal, setModal] = useState({ destroyed: false, id: "", open: false });

  const showEdit = (destroyed: boolean, id: string, open: boolean) => {
    setModal({ destroyed, id, open });
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Settings" }, { title: "My Restaurants" }]}
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
          Add Restaurant
        </Button>
      </div>

      <div className="space-y-4">
        <Card title={`In Progress (${pendingRestaurants.length})`} type="inner">
          <List
            dataSource={pendingRestaurants}
            grid={{ column: 2, gutter: 16 }}
            renderItem={(item, index) => (
              <List.Item>
                <div className="rounded-lg border p-4">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    description={[item.city, item.province].join(", ")}
                    title={item.name}
                  />
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card title={`Active (${activeRestaurants.length})`} type="inner">
          <List
            dataSource={activeRestaurants}
            grid={{ column: 2, gutter: 16 }}
            renderItem={(item, index) => (
              <List.Item>
                <div className="flex items-center rounded-lg border p-4">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    description={[item.city, item.province].join(", ")}
                    title={
                      <Space>
                        {item.name}
                        {item.id === restaurantId && (
                          <Badge color="green" count="Current" />
                        )}
                      </Space>
                    }
                  />

                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showEdit(false, item.id, true)}
                  >
                    Edit
                  </Button>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Navbar>
  );
};
