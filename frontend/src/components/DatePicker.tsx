import { FormItemProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

const BACKEND_DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT = "MM-DD-YYYY";
export const DATE_TIME_FORMAT = "MM-DD-YYYY HH:mm:ss";

export const datePickerGetValueProps: FormItemProps["getValueProps"] = (
  v?: string,
) => {
  return {
    value: v ? dayjs(v, BACKEND_DATE_FORMAT) : undefined,
  };
};

export const datePickerGetValueFromEvent: FormItemProps["getValueFromEvent"] = (
  e?: Dayjs,
) => {
  return e?.format(BACKEND_DATE_FORMAT);
};

export const dateTimePickerGetValueProps: FormItemProps["getValueProps"] = (
  v?: string,
) => {
  return {
    value: v ? dayjs(v) : undefined,
  };
};

export const dateTimePickerGetValueFromEvent: FormItemProps["getValueFromEvent"] =
  (e?: Dayjs) => {
    return e?.toISOString();
  };

export const multiDatePickerGetValueProps: FormItemProps["getValueProps"] = (
  v?: string[],
) => {
  return {
    value: v?.map((i) => dayjs(i, BACKEND_DATE_FORMAT)),
  };
};

export const multiDatePickerGetValueFromEvent: FormItemProps["getValueFromEvent"] =
  (e?: Dayjs[]) => {
    return e?.map((i) => i.format(BACKEND_DATE_FORMAT));
  };
