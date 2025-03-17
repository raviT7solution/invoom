import { Alert, Button, Spin, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useRestaurant } from "../../../../api";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

export const SmsConfigurations = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [modal, setModal] = useState({ open: false });

  const restaurant = useRestaurant(restaurantId);

  const requiresConfiguration =
    !restaurant.data?.twilioAccountSid ||
    !restaurant.data.twilioAuthToken ||
    !restaurant.data.twilioSmsPhoneNumber;

  return (
    <Spin spinning={restaurant.isFetching}>
      <Edit modal={modal} setModal={setModal} />

      <Alert
        action={
          <Button onClick={() => setModal({ open: true })}>
            {requiresConfiguration ? "Configure" : "Reconfigure"}
          </Button>
        }
        className="max-w-xl"
        description={
          <Typography.Text type="secondary">
            {restaurant.data?.twilioAccountSid &&
              `Account SID: ${restaurant.data.twilioAccountSid}`}
          </Typography.Text>
        }
        message={
          requiresConfiguration
            ? "Twilio account is not configured"
            : "Twilio account is already configured"
        }
        showIcon
        type={requiresConfiguration ? "error" : "success"}
      />
    </Spin>
  );
};
