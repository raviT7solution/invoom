import { PlusOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, List } from "antd";
import { ReactNode, useState } from "react";

import { Edit } from "./Edit";

import { useRestaurants } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

const WithRibbon = ({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) =>
  active ? (
    <Badge.Ribbon color="green" text="Current">
      {children}
    </Badge.Ribbon>
  ) : (
    children
  );

export const Restaurants = () => {
  const { data: activeRestaurants } = useRestaurants("active");
  const { data: pendingRestaurants } = useRestaurants("pending");

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditRestaurant = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Settings" }, { title: "My Restaurants" }]}
    >
      <Edit open={isModalOpen} showEditRestaurant={showEditRestaurant} />

      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditRestaurant(true)}
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
                <div className="border p-4 rounded-lg">
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
                <WithRibbon active={item.id === restaurantId}>
                  <div className="border p-4 rounded-lg">
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
                </WithRibbon>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Navbar>
  );
};
