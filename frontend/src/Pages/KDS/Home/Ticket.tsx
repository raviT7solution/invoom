import { ClockCircleOutlined } from "@ant-design/icons";
import { Tree, Tag } from "antd";
import { useMemo } from "react";

import { BOOKING_TYPES, STATUSES } from "./helpers";

import { TicketsQuery } from "../../../api/base";
import { classNames } from "../../../helpers";
import {
  useDoubleClick,
  useLongPress,
  useRerender,
} from "../../../helpers/hooks";

const durationToString = (i: number) => {
  const minutes = Math.floor(i / 60000);
  const seconds = Math.floor((i % 60000) / 1000);

  const mins = String(minutes).padStart(2, "0");
  const secs = String(seconds).padStart(2, "0");

  return `${mins}:${secs}`;
};

const Duration = ({
  data,
}: {
  data: TicketsQuery["tickets"]["collection"][number];
}) => {
  useRerender(1000);

  const duration = durationToString(
    Date.now() - Date.parse(data.booking.clockedInAt),
  );

  return duration;
};

const TicketItem = ({
  item,
  showColor,
  updateStatus,
}: {
  item: TicketsQuery["tickets"]["collection"][number]["ticketItems"][number];
  showColor: boolean;
  updateStatus: (direction: 1 | -1, ticketItemId?: string) => void;
}) => {
  const color = useMemo(
    () => STATUSES.find((s) => s.status === item.status)?.color,
    [item.status],
  );

  const onTicketItemLongPress = useLongPress(
    () => updateStatus(-1, item.id),
    500,
  );
  const onTicketItemDoubleClick = useDoubleClick(
    () => updateStatus(1, item.id),
    500,
  );

  return (
    <div
      className={classNames(
        "flex justify-between rounded-md pl-2 items-center",
        showColor ? color ?? "" : "",
      )}
      onClick={onTicketItemDoubleClick}
      {...onTicketItemLongPress}
    >
      <b>{item.displayName}</b>
      <Tag>&times;{item.quantity}</Tag>
    </div>
  );
};

export const Ticket = ({
  data,
  showColor,
  updateStatus,
}: {
  data: TicketsQuery["tickets"]["collection"][number];
  showColor: boolean;
  updateStatus: (direction: 1 | -1, ticketItemId?: string) => void;
}) => {
  const onTicketLongPress = useLongPress(() => updateStatus(-1), 500);
  const onTicketDoubleClick = useDoubleClick(() => updateStatus(1), 500);

  const color = useMemo(
    () =>
      STATUSES.find((s) => data.ticketItems.find((i) => i.status === s.status))
        ?.color,
    [data.ticketItems],
  );

  return (
    <div className="h-full w-full bg-white rounded-md overflow-hidden select-none border shadow-md">
      <div
        className={classNames("p-1", color ?? "")}
        onClick={onTicketDoubleClick}
        {...onTicketLongPress}
      >
        <div className="flex justify-between items-center">
          <b className="text-base">
            {data.booking.bookingTables.map((b) => b.name).join(", ") || "-"}
          </b>
          <Tag color="red">{BOOKING_TYPES[data.booking.bookingType]}</Tag>
        </div>

        <div className="flex justify-between items-center">
          {["#1234", data.booking.customer?.name].filter(Boolean).join(" | ")}
          <div>
            <Tag>{data.booking.userFullName}</Tag>
            <Tag className="font-bold" icon={<ClockCircleOutlined />}>
              <Duration data={data} />
            </Tag>
          </div>
        </div>
      </div>

      <div className="p-1">
        <Tree
          blockNode
          defaultExpandAll
          selectable={false}
          treeData={data.ticketItems
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((i) => ({
              title: (
                <TicketItem
                  item={i}
                  showColor={showColor}
                  updateStatus={updateStatus}
                />
              ),
              key: i.id,
              children: [
                ...i.ticketItemAddons.map((j) => ({
                  title: j.name,
                  key: j.id,
                })),
                ...i.modifiers.map((j, idx) => ({
                  title: j,
                  key: idx,
                })),
              ],
            }))}
        />
      </div>
    </div>
  );
};
