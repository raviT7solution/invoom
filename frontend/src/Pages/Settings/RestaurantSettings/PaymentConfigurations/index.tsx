import { Alert, Button, Spin, Typography } from "antd";
import { useState } from "react";

import { StripeEdit } from "./StripeEdit";

import { useRestaurant } from "../../../../api";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

export const PaymentConfiguration = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [modal, setModal] = useState({ destroyed: false, open: false });

  const restaurant = useRestaurant(restaurantId);

  const requiresConfiguration = !restaurant.data?.stripeAccountType;

  const isConnect = restaurant.data?.stripeAccountType === "connect";
  const isOwn = restaurant.data?.stripeAccountType === "own";

  const showEdit = (destroyed: boolean, open: boolean) => {
    setModal({ destroyed, open });
  };

  return (
    <Spin spinning={restaurant.isFetching}>
      {!modal.destroyed && <StripeEdit open={modal.open} showEdit={showEdit} />}

      <Alert
        action={
          <Button onClick={() => showEdit(false, true)}>
            {requiresConfiguration ? "Configure" : "Reconfigure"}
          </Button>
        }
        className="max-w-xl"
        description={
          <Typography.Text type="secondary">
            {isConnect &&
              `Uses stripe connect account id: ${restaurant.data?.stripeAccountId}`}
            {isOwn && "Uses stripe own account"}
          </Typography.Text>
        }
        message={
          requiresConfiguration
            ? "Stripe account is not configured"
            : "Stripe account is already configured"
        }
        showIcon
        type={requiresConfiguration ? "error" : "success"}
      />
    </Spin>
  );
};
