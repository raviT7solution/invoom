import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";

import {
  useServiceCharge,
  useServiceChargeCreate,
  useServiceChargeUpdate,
  useSettingsTaxes,
} from "../../../../api";
import { ServiceChargeTypeEnum } from "../../../../api/base";
import { FormDrawer } from "../../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  chargeType: ServiceChargeTypeEnum;
  name: string;
  taxId: string;
  value: number;
  visible: boolean;
};

const initialValues = {
  visible: true,
};

export const chargeTypes: Record<ServiceChargeTypeEnum, string> = {
  percentage: "Percentage",
  flat: "Flat Rate",
};

const chargeTypesOptions = Object.entries(chargeTypes).map(
  ([value, label]) => ({
    label,
    value,
  }),
);

export const Edit = ({
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (id: string, open: boolean) => void;
}) => {
  const isNew = id === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: serviceCharge, isFetching } = useServiceCharge(id);
  const { data: taxes } = useSettingsTaxes(restaurantId);

  const { mutateAsync: serviceChargeCreate, isPending: isCreating } =
    useServiceChargeCreate();
  const { mutateAsync: serviceChargeUpdate, isPending: isUpdating } =
    useServiceChargeUpdate();

  const onClose = () => showEdit("", false);

  const onFinish = async (values: schema) => {
    isNew
      ? await serviceChargeCreate({
          input: { attributes: values, restaurantId: restaurantId },
        })
      : await serviceChargeUpdate({
          input: { attributes: values, id: id },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="service-charge-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Charge" : "Edit Charge"}
    >
      <Form
        initialValues={isNew ? initialValues : serviceCharge}
        layout="vertical"
        name="service-charge-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Charge Type"
          name="chargeType"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select options={chargeTypesOptions} placeholder="Select" />
        </Form.Item>

        <Form.Item
          label="Value"
          name="value"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber placeholder="Value" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Tax"
          name="taxId"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            options={taxes.map((r) => ({
              label: r.displayName,
              value: r.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
