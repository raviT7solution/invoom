import { Button, Checkbox, Form, Skeleton } from "antd";
import { useState } from "react";

import {
  useReceiptConfiguration,
  useReceiptConfigurationUpdate,
} from "../../../../api";
import { ReceiptConfigurationAttributes } from "../../../../api/base";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

export const ReceiptConfigurations = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [isFormChanged, setIsFormChanged] = useState(false);

  const receiptConfiguration = useReceiptConfiguration(restaurantId);

  const receiptConfigurationUpdate = useReceiptConfigurationUpdate();

  const onFinish = async (values: ReceiptConfigurationAttributes) => {
    if (!receiptConfiguration.data) return;

    await receiptConfigurationUpdate.mutateAsync({
      input: { attributes: values, id: receiptConfiguration.data.id },
    });

    setIsFormChanged(false);
  };

  if (!receiptConfiguration.data) return <Skeleton />;

  return (
    <Form
      initialValues={receiptConfiguration.data}
      layout="vertical"
      name="receipt-configuration-form"
      onFinish={onFinish}
      onValuesChange={() => setIsFormChanged(true)}
      preserve={false}
    >
      <Form.Item name="showCustomerDetails" valuePropName="checked">
        <Checkbox>Show customer details</Checkbox>
      </Form.Item>

      <Form.Item name="showDiscount" valuePropName="checked">
        <Checkbox>Show discount</Checkbox>
      </Form.Item>

      <Form.Item name="showPlatformBranding" valuePropName="checked">
        <Checkbox>Show platform branding</Checkbox>
      </Form.Item>

      <Form.Item name="showUnitPrice" valuePropName="checked">
        <Checkbox>Show unit price</Checkbox>
      </Form.Item>

      <Button
        disabled={!isFormChanged}
        htmlType="submit"
        loading={receiptConfigurationUpdate.isPending}
        type="primary"
      >
        Update
      </Button>
    </Form>
  );
};
