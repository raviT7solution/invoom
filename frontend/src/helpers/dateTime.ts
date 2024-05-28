import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_TIME_FORMAT = "YYYY-MM-DD hh:mm A";

export const utcToRestaurantTimezone = (dateTime: string, tz?: string) => {
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
  tz?: string,
) => {
  if (!start || !end) return { start: "", end: "" };

  return {
    start: dayjs.tz(start, tz).startOf("day").toISOString(),
    end: dayjs.tz(end, tz).endOf("day").toISOString(),
  };
};
