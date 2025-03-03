import { TicketItemStatusType } from "../../../api/base";

export const ITEM_STATUSES: TicketItemStatusType[] = [
  "queued",
  "preparing",
  "ready",
  "served",
];

export const STATUSES: {
  color: string;
  status: TicketItemStatusType;
}[] = [
  {
    color: "bg-gray-200",
    status: "queued",
  },
  {
    color: "bg-orange-300",
    status: "preparing",
  },
  {
    color: "bg-green-400",
    status: "ready",
  },
  {
    color: "bg-gray-200",
    status: "served",
  },
];

export const TABS: {
  key: string;
  label: string;
  statuses: TicketItemStatusType[];
}[] = [
  {
    key: "1",
    label: "Active",
    statuses: ["queued", "preparing", "ready"],
  },
  {
    key: "2",
    label: "New",
    statuses: ["queued"],
  },
  {
    key: "3",
    label: "Preparing",
    statuses: ["preparing"],
  },
  {
    key: "4",
    label: "Ready",
    statuses: ["ready"],
  },
  {
    key: "5",
    label: "Served",
    statuses: ["served"],
  },
];
