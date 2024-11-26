import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
} from "antd";

import {
  useCategories,
  useDiscount,
  useDiscountCreate,
  useDiscountUpdate,
  useItems,
} from "../../../api";
import {
  DiscountChannelEnum,
  DiscountOnEnum,
  DiscountRepeatEnum,
  DiscountTypeEnum,
} from "../../../api/base";
import { FormDrawer } from "../../../components/FormDrawer";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  dateTimePickerGetValueFromEvent,
  dateTimePickerGetValueProps,
  multiDatePickerGetValueFromEvent,
  multiDatePickerGetValueProps,
} from "../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  autoApply: boolean;
  blackOutDates: string[];
  capping: number;
  categoryIds: string[];
  channels: DiscountChannelEnum[];
  clubbed: boolean;
  discountOn: DiscountOnEnum;
  discountType: DiscountTypeEnum;
  endDateTime: string | null;
  itemIds: string[];
  name: string;
  repeat: DiscountRepeatEnum[];
  startDateTime: string | null;
  threshold: number;
  value: number;
  visible: boolean;
};

const initialValues = {
  autoApply: false,
  blackOutDates: [],
  capping: 0,
  clubbed: false,
  discountOn: "bill_wise",
  discountValue: 0,
  repeat: [],
  threshold: 0,
  visible: true,
};

export const discountTypes: Record<DiscountTypeEnum, string> = {
  percentage: "Percentage",
  flat: "Flat Rate",
  bogo: "BOGO",
  combo: "Combo",
  compoff: "Comp-off",
  coupons: "Coupons",
};

const discountTypesOptions = Object.entries(discountTypes).map(
  ([value, label]) => ({
    label,
    value,
  }),
);

const channels = [
  {
    label: "Dine-In",
    value: "dine_in",
  },
  {
    label: "TakeOut",
    value: "takeout",
  },
  {
    label: "Delivery",
    value: "delivery",
  },
  {
    label: "All",
    value: "all",
  },
];

export const Edit = ({
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (destroyed: boolean, id: string, open: boolean) => void;
}) => {
  const isNew = id === "";
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { mutateAsync: discountCreate, isPending: isCreating } =
    useDiscountCreate();
  const { mutateAsync: discountUpdate, isPending: isUpdating } =
    useDiscountUpdate();

  const { data: discount, isFetching } = useDiscount(id);
  const { data: categories } = useCategories(restaurantId);
  const { data: items } = useItems(restaurantId);

  const [form] = Form.useForm<schema>();
  const autoApply = Form.useWatch("autoApply", form);
  const discountOn = Form.useWatch("discountOn", form);
  const itemWise = discountOn === "item_wise";

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onFinish = async (values: schema) => {
    isNew
      ? await discountCreate({
          input: { attributes: values, restaurantId: restaurantId },
        })
      : await discountUpdate({
          input: { attributes: values, id: id },
        });

    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={[
        <Button
          form="discount-form"
          htmlType="submit"
          key="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>,
      ]}
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Discount" : "Edit Discount"}
    >
      <Form
        form={form}
        initialValues={isNew ? initialValues : discount}
        layout="vertical"
        name="discount-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="Discount Name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Discount Type"
          name="discountType"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select options={discountTypesOptions} placeholder="Select" />
        </Form.Item>

        <Form.Item
          label="Channel"
          name="channels"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={channels}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Discount Value"
          name="value"
          rules={[
            { required: true, message: "Required" },
            { type: "number", min: 0, message: "Must be non-negative" },
          ]}
        >
          <InputNumber placeholder="Value" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Threshold"
          name="threshold"
          rules={[{ type: "number", min: 0, message: "Must be non-negative" }]}
        >
          <InputNumber placeholder="Threshold" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Capping"
          name="capping"
          rules={[{ type: "number", min: 0, message: "Must be non-negative" }]}
        >
          <InputNumber placeholder="Capping" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Discount On"
          name="discountOn"
          rules={[{ required: true, message: "Required" }]}
        >
          <Radio.Group
            onChange={() =>
              form.setFieldsValue({ categoryIds: [], itemIds: [] })
            }
            options={[
              { label: "Bill Wise", value: "bill_wise" },
              { label: "Item Wise", value: "item_wise" },
            ]}
          />
        </Form.Item>

        <Form.Item hidden={!itemWise} label="Categories" name="categoryIds">
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={categories.map((i) => ({
              label: i.name,
              value: i.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item hidden={!itemWise} label="Items" name="itemIds">
          <Select
            mode="multiple"
            optionFilterProp="label"
            options={items.map((i) => ({
              label: i.name,
              value: i.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item
          label="Auto Apply"
          name="autoApply"
          rules={[{ required: true, message: "Required" }]}
        >
          <Radio.Group
            onChange={() =>
              form.setFieldsValue({
                endDateTime: null,
                repeat: [],
                startDateTime: null,
              })
            }
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
        </Form.Item>

        <Form.Item
          getValueFromEvent={dateTimePickerGetValueFromEvent}
          getValueProps={dateTimePickerGetValueProps}
          hidden={!autoApply}
          label="Start Date & Time"
          name="startDateTime"
          rules={[{ required: autoApply, message: "Required" }]}
        >
          <DatePicker
            format={DATE_TIME_FORMAT}
            showTime
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          getValueFromEvent={dateTimePickerGetValueFromEvent}
          getValueProps={dateTimePickerGetValueProps}
          hidden={!autoApply}
          label="End Date & Time"
          name="endDateTime"
          rules={[{ required: autoApply, message: "Required" }]}
        >
          <DatePicker
            format={DATE_TIME_FORMAT}
            showTime
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Clubbed"
          name="clubbed"
          rules={[{ required: true, message: "Required" }]}
        >
          <Radio.Group
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
        </Form.Item>

        <Form.Item
          hidden={!autoApply}
          label="Repeat"
          name="repeat"
          rules={[{ required: autoApply, message: "Required" }]}
        >
          <Checkbox.Group>
            <Checkbox value="Sun">Sun</Checkbox>
            <Checkbox value="Mon">Mon</Checkbox>
            <Checkbox value="Tue">Tue</Checkbox>
            <Checkbox value="Wed">Wed</Checkbox>
            <Checkbox value="Thu">Thu</Checkbox>
            <Checkbox value="Fri">Fri</Checkbox>
            <Checkbox value="Sat">Sat</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          getValueFromEvent={multiDatePickerGetValueFromEvent}
          getValueProps={multiDatePickerGetValueProps}
          label="Blackout Dates"
          name="blackOutDates"
        >
          <DatePicker format={DATE_FORMAT} multiple />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
