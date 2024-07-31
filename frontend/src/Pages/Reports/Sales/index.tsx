import { DatePicker, Select, Table, TableColumnsType, Typography } from "antd";
import { useMemo, useState } from "react";

import { useBookings, useInvoices, useRestaurants } from "../../../api";
import { BookingsQuery } from "../../../api/base";
import { Navbar } from "../../../components/Navbar";
import { TIME_RANGE_PRESETS } from "../../../helpers";
import {
  dateRangePickerToString,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";
import { BOOKING_TYPES } from "../../KDS/Home/helpers";

type InvoicesType = BookingsQuery["bookings"]["collection"][number]["invoices"];

type DateRangeType = {
  start: string | null;
  end: string | null;
};

const REPORT_TYPES = [
  {
    label: "Order Wise",
    value: "orders",
  },
  {
    label: "Invoice Wise",
    value: "invoices",
  },
];

const invoicesTotal = (invoices: InvoicesType) => {
  return invoices.reduce((p, c) => p + c.total, 0);
};

const invoiceTax = (invoice: InvoicesType[number]) => {
  let totalTax = 0;

  invoice.invoiceItems.forEach((i) => {
    totalTax += i.discountedPrice * (i.ticketItem.cst / 100);
    totalTax += i.discountedPrice * (i.ticketItem.gst / 100);
    totalTax += i.discountedPrice * (i.ticketItem.hst / 100);
    totalTax += i.discountedPrice * (i.ticketItem.pst / 100);
    totalTax += i.discountedPrice * (i.ticketItem.qst / 100);
    totalTax += i.discountedPrice * (i.ticketItem.rst / 100);
  });

  return totalTax;
};

const invoicesTax = (invoices: InvoicesType) => {
  return invoices.reduce((t, i) => t + invoiceTax(i), 0);
};

const OrdersWise = ({
  dateRange,
  tz,
}: {
  dateRange: DateRangeType;
  tz?: string;
}) => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useBookings({
    endDate: dateRange.end,
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
    startDate: dateRange.start,
  });

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. No",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        title: "Order ID",
        dataIndex: ["number"],
      },
      {
        title: "Invoice ID",
        render: (_, r) => r.invoices.map((i) => i.number).join(", "),
      },
      {
        title: "Order Type",
        render: (_, r) => BOOKING_TYPES[r.bookingType],
      },
      {
        title: "Start Time",
        render: (_, r) => utcToRestaurantTimezone(r.clockedInAt, tz),
      },
      {
        title: "End Time",
        render: (_, r) =>
          r.clockedOutAt ? utcToRestaurantTimezone(r.clockedOutAt, tz) : "-",
      },
      {
        title: "Table No.",
        render: (_, r) => {
          if (r.bookingType === "dine_in")
            return r.bookingTables.map((i) => i.name).join(", ");

          if (r.bookingType === "takeout") return r.token;
        },
      },
      {
        title: "Pax",
        dataIndex: ["pax"],
      },
      {
        title: "SubTotal",
        render: (_, r) => invoicesTotal(r.invoices).toFixed(2),
      },
      {
        title: "Total Tax",
        render: (_, r) => invoicesTax(r.invoices).toFixed(2),
      },
      {
        title: "Total",
        render: (_, r) =>
          (invoicesTotal(r.invoices) + invoicesTax(r.invoices)).toFixed(2),
      },
      {
        title: "Payment Type",
        render: (_, r) =>
          r.invoices
            .map((i) => i.paymentMode)
            .filter(Boolean)
            .join(", "),
      },
      {
        title: "Customer Name",
        render: (_, r) => r.customer?.name ?? "-",
      },
      {
        title: "Server Name",
        dataIndex: ["userFullName"],
      },
    ],
    [metadata, tz],
  );

  return (
    <Table
      columns={columns}
      dataSource={collection}
      loading={isFetching}
      pagination={{
        current: metadata.currentPage,
        onChange: (page, pageSize) =>
          setPagination({ page, perPage: pageSize }),
        total: metadata.totalCount,
      }}
      rowKey="id"
    />
  );
};

const InvoicesWise = ({
  dateRange,
  tz,
}: {
  dateRange: DateRangeType;
  tz?: string;
}) => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useInvoices({
    endDate: dateRange.end,
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
    startDate: dateRange.start,
  });

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. No",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        title: "Order ID",
        dataIndex: ["booking", "number"],
      },
      {
        title: "Invoice ID",
        dataIndex: ["number"],
      },
      {
        title: "Order Type",
        render: (_, r) => BOOKING_TYPES[r.booking.bookingType],
      },
      {
        title: "Start Time",
        render: (_, r) => utcToRestaurantTimezone(r.booking.clockedInAt, tz),
      },
      {
        title: "End Time",
        render: (_, r) =>
          r.booking.clockedOutAt
            ? utcToRestaurantTimezone(r.booking.clockedOutAt, tz)
            : "-",
      },
      {
        title: "Table No.",
        render: (_, r) => {
          if (r.booking.bookingType === "dine_in")
            return r.booking.bookingTables.map((i) => i.name).join(", ");

          if (r.booking.bookingType === "takeout") return r.booking.token;
        },
      },
      {
        title: "Pax",
        dataIndex: ["booking", "pax"],
      },
      {
        title: "Sub Total",
        render: (_, r) => r.total.toFixed(2),
      },
      {
        title: "Total Tax",
        render: (_, r) => invoiceTax(r).toFixed(2),
      },
      {
        title: "Total",
        render: (_, r) => (r.total + invoiceTax(r)).toFixed(2),
      },
      {
        title: "Payment Type",
        dataIndex: ["paymentMode"],
      },
      {
        title: "Customer Name",
        render: (_, r) => r.booking.customer?.name ?? "-",
      },
      {
        title: "Server Name",
        dataIndex: ["booking", "userFullName"],
      },
    ],
    [metadata, tz],
  );

  return (
    <Table
      columns={columns}
      dataSource={collection}
      loading={isFetching}
      pagination={{
        current: metadata.currentPage,
        onChange: (page, pageSize) =>
          setPagination({ page, perPage: pageSize }),
        total: metadata.totalCount,
      }}
      rowKey="id"
    />
  );
};

export const ReportsSales = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [reportType, setReportType] = useState("orders");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: null,
    end: null,
  });

  const { data: restaurants } = useRestaurants("active");

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === restaurantId),
    [restaurantId, restaurants],
  );

  const onDateChange = (_: unknown, dates: [string, string]) => {
    setDateRange(
      dateRangePickerToString(dates[0], dates[1], restaurant?.timezone),
    );
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Report" }, { title: "Sales Report" }]}>
      <div className="flex">
        <Typography.Title level={4}>Sales Report</Typography.Title>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Select
            className="w-1/4"
            defaultValue="orders"
            onChange={(i) => setReportType(i)}
            options={REPORT_TYPES}
            placeholder="Select type"
          />

          <DatePicker.RangePicker
            onChange={onDateChange}
            presets={TIME_RANGE_PRESETS}
          />
        </div>
      </div>

      {reportType === "orders" && (
        <OrdersWise dateRange={dateRange} tz={restaurant?.timezone} />
      )}
      {reportType === "invoices" && (
        <InvoicesWise dateRange={dateRange} tz={restaurant?.timezone} />
      )}
    </Navbar>
  );
};
