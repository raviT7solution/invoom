import { Button, DatePicker, Form, Select } from "antd";

import {
  useTimeSheet,
  useTimeSheetCreate,
  useTimeSheetUpdate,
  useUsers,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import {
  DATE_TIME_FORMAT,
  dateTimePickerGetValueFromEvent,
  dateTimePickerGetValueProps,
} from "../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  endTime?: string | null;
  startTime: string;
  userId: string;
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
  const isNew = id === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: users, isFetching: isUsersFetching } = useUsers(restaurantId);
  const { data: timeSheet, isFetching } = useTimeSheet(id);

  const { mutateAsync: timeSheetCreate, isPending: isCreating } =
    useTimeSheetCreate();
  const { mutateAsync: timeSheetUpdate, isPending: isUpdating } =
    useTimeSheetUpdate();

  const onClose = () => showEdit("", false);

  const onFinish = async (values: schema) => {
    const attributes = { endTime: values.endTime, startTime: values.startTime };

    isNew
      ? await timeSheetCreate({
          input: { attributes: attributes, userId: values.userId },
        })
      : await timeSheetUpdate({
          input: { attributes: attributes, id: id },
        });

    onClose();
  };

  return (
    <FormDrawer
      footer={
        <Button
          form="time-sheet-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Save
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Timesheet" : "Edit Timesheet"}
    >
      <Form
        initialValues={timeSheet}
        layout="vertical"
        name="time-sheet-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="User"
          name="userId"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            disabled={!isNew}
            loading={isUsersFetching}
            optionFilterProp="label"
            options={users.map((i) => ({
              label: i.fullName,
              value: i.id,
            }))}
            placeholder="Select"
            showSearch
          />
        </Form.Item>

        <Form.Item
          getValueFromEvent={dateTimePickerGetValueFromEvent}
          getValueProps={dateTimePickerGetValueProps}
          label="Start Time"
          name="startTime"
          rules={[{ required: true, message: "Required" }]}
        >
          <DatePicker className="w-full" format={DATE_TIME_FORMAT} showTime />
        </Form.Item>

        <Form.Item
          getValueFromEvent={dateTimePickerGetValueFromEvent}
          getValueProps={dateTimePickerGetValueProps}
          label="End Time"
          name="endTime"
        >
          <DatePicker className="w-full" format={DATE_TIME_FORMAT} showTime />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
};
