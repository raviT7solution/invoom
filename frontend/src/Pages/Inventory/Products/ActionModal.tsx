import { Button, Form, Input, InputNumber, Select } from "antd";

import {
  useProduct,
  useProductTransactionCreate,
  useSettingsTaxes,
} from "../../../api";
import { FormModal } from "../../../components/FormModal";
import { UOM } from "../../../helpers/mapping";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  price: number;
  quantity: number;
};

const TITLES: { [key: string]: string } = {
  day_end: "Day End",
  receive: "Receive",
};

const initialValues = {
  price: 0,
};

export const ActionModal = ({
  open,
  productId,
  showActionModal,
  stockType,
}: {
  open: boolean;
  productId: string;
  showActionModal: (id: string, open: boolean, stockType: string) => void;
  stockType: string;
}) => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: product, isFetching } = useProduct(productId);
  const { data: taxes } = useSettingsTaxes(restaurantId);

  const { mutateAsync: productTransactionCreate, isPending: isCreating } =
    useProductTransactionCreate();

  const onCancel = () => showActionModal("", false, "");

  const onSave = async (values: schema) => {
    const attributes = { ...values, stockType };

    await productTransactionCreate({
      input: { attributes: attributes, productId },
    });

    onCancel();
  };

  return (
    <FormModal
      footer={
        <Button
          form="product-transaction-form"
          htmlType="submit"
          loading={isCreating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onCancel={onCancel}
      open={open}
      title={TITLES[stockType]}
    >
      <Form
        initialValues={initialValues}
        layout="vertical"
        name="product-transaction-form"
        onFinish={onSave}
        preserve={false}
      >
        <Form.Item label="Product Name">
          <Input disabled placeholder="Product Name" value={product?.name} />
        </Form.Item>

        <Form.Item label="UOM">
          <Select
            disabled
            options={Object.entries(UOM).map(([value, label]) => ({
              label,
              value,
            }))}
            placeholder="Select"
            value={product?.uom}
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            placeholder="Quantity"
            style={{ width: "100%" }}
            type="number"
          />
        </Form.Item>

        <Form.Item
          hidden={stockType !== "receive"}
          label="Cost"
          name="price"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber
            placeholder="Cost per UOM"
            style={{ width: "100%" }}
            type="number"
          />
        </Form.Item>

        <Form.Item hidden={stockType !== "receive"} label="Tax">
          <Select
            disabled
            options={taxes.map((i) => ({
              label: i.displayName,
              value: i.id,
            }))}
            placeholder="Select"
            value={product?.taxId}
          />
        </Form.Item>
      </Form>
    </FormModal>
  );
};
