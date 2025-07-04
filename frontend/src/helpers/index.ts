import { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const selectLabelFilterSort = (
  a: {
    label: string;
    value: string;
  },
  b: {
    label: string;
    value: string;
  },
) => a.label.toLowerCase().localeCompare(b.label.toLowerCase());

export const initials = (name: string) =>
  name.split(" ").map((i) => i.charAt(0).toUpperCase());

export const TIME_RANGE_PRESETS: TimeRangePickerProps["presets"] = [
  { label: "Last 7 days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 days", value: [dayjs().add(-90, "d"), dayjs()] },
];

export const formatAmount = (v: number) =>
  `${v < 0 ? "-" : ""}$${Math.abs(v).toFixed(2)}`;

// Export authentication utilities
export { getAuthToken, hasValidAuthToken, clearAuthToken, createAuthHeaders } from './auth';
