import { Button, Checkbox, Divider, Form, Input, Select, Slider } from "antd";

import {
  useCategories,
  useKitchenProfile,
  useKitchenProfileCreate,
  useKitchenProfileUpdate,
  usePrinterConfigurations,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  categoryIds: string[];
  columns: number;
  name: string;
  notify: boolean;
  printerConfigurationId: string | null;
  rows: number;
};

const initialValues = {
  notify: true,
};

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

  const [form] = Form.useForm<schema>();
  const rows = Form.useWatch("rows", form) || "";
  const columns = Form.useWatch("columns", form) || "";

  const { data: categories, isFetching: isCategoriesFetching } =
    useCategories(restaurantId);
  const { data: kitchenProfile, isFetching } = useKitchenProfile(id);
  const printerConfigurations = usePrinterConfigurations(restaurantId);

  const { mutateAsync: kitchenProfileCreate, isPending: isCreating } =
    useKitchenProfileCreate();
  const { mutateAsync: kitchenProfileUpdate, isPending: isUpdating } =
    useKitchenProfileUpdate();

  const onFinish = async (values: schema) => {
    isNew
      ? await kitchenProfileCreate({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await kitchenProfileUpdate({
          input: { attributes: values, id: id },
        });

    onClose();
  };

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={
        <Button
          form="kitchen-profile-form"
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
      title={isNew ? "New kitchen profile" : "Edit kitchen profile"}
    >
      <Form
        form={form}
        initialValues={isNew ? initialValues : kitchenProfile}
        layout="vertical"
        name="kitchen-profile-form"
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
          label="Categories"
          name="categoryIds"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            loading={isCategoriesFetching}
            mode="multiple"
            optionFilterProp="label"
            options={categories.map((i) => ({ label: i.name, value: i.id }))}
            placeholder="Select"
          />
        </Form.Item>

        <Form.Item label="Printer" name="printerConfigurationId">
          <Select
            allowClear
            loading={printerConfigurations.isFetching}
            onChange={(i) => {
              if (!i) form.setFieldsValue({ printerConfigurationId: null });
            }}
            options={printerConfigurations.data.map((i) => ({
              label: i.name,
              value: i.id,
            }))}
            placeholder="Select"
          />
        </Form.Item>

        <Divider orientation="left" plain>
          Layout
        </Divider>

        <Form.Item label="Rows" name="rows">
          <Slider
            marks={{ 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" }}
            max={6}
            min={1}
          />
        </Form.Item>

        <Form.Item label="Columns" name="columns">
          <Slider
            marks={{ 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" }}
            max={6}
            min={1}
          />
        </Form.Item>

        {[...Array(rows)].map((_, r) => (
          <div className="flex" key={r}>
            {[...Array(columns)].map((_, c) => (
              <div
                className="m-0.5 flex-1 border border-gray-400 bg-gray-200 p-3"
                key={c}
              />
            ))}
          </div>
        ))}

        <Divider />

        <Form.Item name="notify" valuePropName="checked">
          <Checkbox>New ticket sound alert</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
