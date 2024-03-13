import { FormItemProps } from "antd";
import dayjs from "dayjs";

const BACKEND_DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT = "MM-DD-YYYY";
export const DATE_TIME_FORMAT = "MM-DD-YYYY HH:mm:ss";

export const datePickerGetValueProps: FormItemProps["getValueProps"] = (v) => {
  return {
    value: v ? dayjs(v, BACKEND_DATE_FORMAT) : undefined,
  };
};

export const datePickerGetValueFromEvent: FormItemProps["getValueFromEvent"] = (
  e,
) => {
  return e.format(BACKEND_DATE_FORMAT);
};

export const multiDatePickerGetValueProps: FormItemProps["getValueProps"] = (
  v,
) => {
  return {
    value: v?.map((i: string) => dayjs(i, BACKEND_DATE_FORMAT)),
  };
};

export const multiDatePickerGetValueFromEvent: FormItemProps["getValueFromEvent"] =
  (e) => {
    return e.map((i: dayjs.Dayjs) => i.format(BACKEND_DATE_FORMAT));
  };
