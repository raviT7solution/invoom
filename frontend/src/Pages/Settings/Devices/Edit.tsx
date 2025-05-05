import { Button, Form, Input } from "antd";

import { useDevice, useDeviceUpdate } from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";

type schema = {
  fingerprint: string;
  name: string;
};

export const Edit = ({
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (id: string, open: boolean) => void;
}) => {
  const device = useDevice(id);

  const deviceUpdate = useDeviceUpdate();

  const onClose = () => showEdit("", false);

  const onFinish = async (values: schema) => {
    await deviceUpdate.mutateAsync({ input: { attributes: values, id: id } });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="device-form"
          htmlType="submit"
          loading={deviceUpdate.isPending}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={device.isFetching}
      onClose={onClose}
      open={open}
      title="Edit device"
    >
      <Form
        initialValues={device.data}
        layout="vertical"
        name="device-form"
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
          label="Fingerprint"
          name="fingerprint"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input disabled placeholder="Fingerprint" />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
