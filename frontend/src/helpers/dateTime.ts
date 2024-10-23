import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useRestaurantIdStore } from "../stores/useRestaurantIdStore";

dayjs.extend(utc);
dayjs.extend(timezone);

const BACKEND_DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT = "MM-DD-YYYY";
export const DATE_TIME_FORMAT = "MM-DD-YYYY hh:mm A";
export const TIME_FORMAT = "hh:mm A";

export const utcToRestaurantTimezone = (dateTime: string, tz: string) => {
  return dayjs(dateTime).tz(tz).format(DATE_TIME_FORMAT);
};

export const humanizeDuration = (startTime: string, endTime: string) => {
  const duration = Date.parse(endTime) - Date.parse(startTime);

  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  let durationString = "";

  if (hours > 0) durationString += `${hours} hours `;
  if (minutes > 0) durationString += `${minutes} min `;
  if (seconds > 0) durationString += `${seconds} sec`;

  return durationString.trim();
};

export const dateRangePickerToString = (
  start: string,
  end: string,
  tz: string,
) => {
  if (!start || !end) return { start: null, end: null };

  return {
    start: dayjs.tz(start, DATE_FORMAT, tz).startOf("day").toISOString(),
    end: dayjs.tz(end, DATE_FORMAT, tz).endOf("day").toISOString(),
  };
};

export const datePickerGetValueProps = (v?: string) => {
  return {
    value: v ? dayjs(v, BACKEND_DATE_FORMAT) : null,
  };
};

export const datePickerGetValueFromEvent = (_: unknown, v?: string) => {
  return v ? dayjs(v, DATE_FORMAT).format(BACKEND_DATE_FORMAT) : null;
};

export const multiDatePickerGetValueProps = (v?: string[]) => {
  return {
    value: v?.map((i) => dayjs(i, BACKEND_DATE_FORMAT)),
  };
};

export const multiDatePickerGetValueFromEvent = (_: unknown, v?: string[]) => {
  return v
    ? v.map((i) => dayjs(i, DATE_FORMAT).format(BACKEND_DATE_FORMAT))
    : [];
};

export const dateTimePickerGetValueProps = (v?: string) => {
  return {
    value: v ? dayjs(v).tz(useRestaurantIdStore.getState().tz) : null,
  };
};

export const dateTimePickerGetValueFromEvent = (_: unknown, v?: string) => {
  return v
    ? dayjs
        .tz(v, DATE_TIME_FORMAT, useRestaurantIdStore.getState().tz)
        .toISOString()
    : null;
};
