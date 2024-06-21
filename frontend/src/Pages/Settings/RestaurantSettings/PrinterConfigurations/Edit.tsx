import { Button, Form, Input, Checkbox } from "antd";

import {
  usePrinterConfiguration,
  usePrinterConfigurationCreate,
  usePrinterConfigurationUpdate,
} from "../../../../api";
import { FormDrawer } from "../../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  ipAddress: string;
  name: string;
  port: string;
  visible: boolean;
};

const initialValues = { visible: true };

export const Edit = ({
  open,
  printerId,
  showEditPrinter,
}: {
  open: boolean;
  printerId: string;
  showEditPrinter: (id: string, open: boolean) => void;
}) => {
  const isNew = printerId === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: printerConfig, isFetching } =
    usePrinterConfiguration(printerId);
  const { mutateAsync: create, isPending: isCreating } =
    usePrinterConfigurationCreate();
  const { mutateAsync: update, isPending: isUpdating } =
    usePrinterConfigurationUpdate();

  const onClose = () => showEditPrinter("", false);

  const onSave = async (values: schema) => {
    isNew
      ? await create({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await update({
          input: { attributes: values, id: printerId },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="printer-form"
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
      title={isNew ? "New Printer Configuration" : "Edit Printer Configuration"}
    >
      <Form
        initialValues={isNew ? initialValues : printerConfig}
        layout="vertical"
        name="printer-form"
        onFinish={onSave}
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
          label="Port"
          name="port"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="Port" />
        </Form.Item>

        <Form.Item
          label="IP Address"
          name="ipAddress"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="IP Address" />
        </Form.Item>

        <Form.Item name="visible" valuePropName="checked">
          <Checkbox>Visible</Checkbox>
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
