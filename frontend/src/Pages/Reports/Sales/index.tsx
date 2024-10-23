import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Select,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import { Summary } from "./Summary";

import {
  useBookings,
  useBookingsExport,
  useInvoices,
  useInvoicesExport,
} from "../../../api";
import { BookingsQuery } from "../../../api/base";
import { Navbar } from "../../../components/Navbar";
import { TIME_RANGE_PRESETS } from "../../../helpers";
import {
  DATE_FORMAT,
  dateRangePickerToString,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { exportAsCSV } from "../../../helpers/exports";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";
import { BOOKING_TYPES } from "../../KDS/Home/helpers";

type InvoicesType = BookingsQuery["bookings"]["collection"][number]["invoices"];

type DateRangeType = {
  start: string | null;
  end: string | null;
};

const REPORT_TYPES = [
  {
    label: "Sales By Order",
    value: "orders",
  },
  {
    label: "Sales By Invoice",
    value: "invoices",
  },
];

const invoiceServiceCharge = (invoice: InvoicesType[number]) => {
  return invoice.invoiceServiceCharges.reduce((p, i) => p + i.chargeAmount, 0);
};

const invoiceTax = (invoice: InvoicesType[number]) => {
  return invoice.taxSummary.reduce((p, i) => p + i.value, 0);
};

const invoiceTip = (invoice: InvoicesType[number]) => {
  return invoice.payments.reduce((p, i) => p + i.tip, 0);
};

const invoicePaymentModes = (invoice: InvoicesType[number]) => {
  return invoice.payments.map((i) => i.paymentMode);
};

const OrdersWise = ({ dateRange }: { dateRange: DateRangeType }) => {
  const { restaurantId, tz } = useRestaurantIdStore();

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
        title: "Table/Order No.",
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
        title: "Subtotal",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + i.subTotal, 0).toFixed(2)}`,
      },
      {
        title: "Total Dis.",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + i.totalDiscount, 0).toFixed(2)}`,
      },
      {
        title: "Total Service Charge",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + invoiceServiceCharge(i), 0)}`,
      },
      {
        title: "Total Tax",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + invoiceTax(i), 0).toFixed(2)}`,
      },
      {
        title: "Tip",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + invoiceTip(i), 0).toFixed(2)}`,
      },
      {
        title: "Total",
        render: (_, r) =>
          `$${r.invoices.reduce((p, i) => p + i.total, 0).toFixed(2)}`,
      },
      {
        title: "Payment Type",
        render: (_, r) => r.invoices.flatMap(invoicePaymentModes).join(", "),
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
      size="small"
    />
  );
};

const InvoicesWise = ({ dateRange }: { dateRange: DateRangeType }) => {
  const { restaurantId, tz } = useRestaurantIdStore();

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
        title: "Table/Order No.",
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
        title: "Subtotal",
        render: (_, r) => `$${r.subTotal.toFixed(2)}`,
      },
      {
        title: "Total Dis.",
        render: (_, r) => `$${r.totalDiscount.toFixed(2)}`,
      },
      {
        title: "Total Service Charge",
        render: (_, r) => `$${invoiceServiceCharge(r).toFixed(2)}`,
      },
      {
        title: "Total Tax",
        render: (_, r) => `$${invoiceTax(r).toFixed(2)}`,
      },
      {
        title: "Tip",
        render: (_, r) => `$${invoiceTip(r).toFixed(2)}`,
      },
      {
        title: "Total",
        render: (_, r) => `$${r.total.toFixed(2)}`,
      },
      {
        title: "Payment Type",
        render: (_, r) => invoicePaymentModes(r).join(", "),
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
      size="small"
    />
  );
};

export const ReportsSales = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const tz = useRestaurantIdStore((s) => s.tz);

  const [reportType, setReportType] = useState("orders");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: null,
    end: null,
  });

  const bookingsExport = useBookingsExport();
  const invoicesExport = useInvoicesExport();

  const onBookingsExportClick = async () => {
    const { collection } = await bookingsExport.mutateAsync({
      endDate: dateRange.end,
      export: true,
      page: 1,
      perPage: -1,
      restaurantId: restaurantId,
      startDate: dateRange.start,
    });

    const header = [
      "Sr. No",
      "Order ID",
      "Invoice ID",
      "Order Type",
      "Start Time",
      "End Time",
      "Table/Order No.",
      "Pax",
      "Subtotal",
      "Total Dis.",
      "Total Service Charge",
      "Total Tax",
      "Tip",
      "Total",
      "Payment Type",
      "Customer Name",
      "Server Name",
    ];

    exportAsCSV(
      header,
      collection.map((r, idx) => {
        return [
          idx + 1,
          r.number,
          r.invoices.map((i) => i.number).join(", "),
          BOOKING_TYPES[r.bookingType],
          utcToRestaurantTimezone(r.clockedInAt, tz),
          r.clockedOutAt ? utcToRestaurantTimezone(r.clockedOutAt, tz) : "-",
          r.bookingType === "dine_in"
            ? r.bookingTables.map((i) => i.name).join(", ")
            : r.bookingType === "takeout"
            ? r.token
            : "",
          r.pax,
          r.invoices.reduce((p, i) => p + i.subTotal, 0).toFixed(2),
          r.invoices.reduce((p, i) => p + i.totalDiscount, 0).toFixed(2),
          r.invoices.reduce((p, i) => p + invoiceServiceCharge(i), 0),
          r.invoices.reduce((p, i) => p + invoiceTax(i), 0).toFixed(2),
          r.invoices.reduce((p, i) => p + invoiceTip(i), 0).toFixed(2),
          r.invoices.reduce((p, i) => p + i.total, 0).toFixed(2),
          r.invoices.flatMap(invoicePaymentModes).join(", "),
          r.customer?.name ?? "-",
          r.userFullName,
        ];
      }),
      "sales-export",
    );
  };

  const onInvoicesExportClick = async () => {
    const { collection } = await invoicesExport.mutateAsync({
      endDate: dateRange.end,
      export: true,
      page: 1,
      perPage: -1,
      restaurantId: restaurantId,
      startDate: dateRange.start,
    });

    const header = [
      "Sr. No",
      "Order ID",
      "Invoice ID",
      "Order Type",
      "Start Time",
      "End Time",
      "Table/Order No.",
      "Pax",
      "Subtotal",
      "Total Dis.",
      "Total Service Charge",
      "Total Tax",
      "Tip",
      "Total",
      "Payment Type",
      "Customer Name",
      "Server Name",
    ];

    exportAsCSV(
      header,
      collection.map((r, idx) => {
        return [
          idx + 1,
          r.booking.number,
          r.number,
          BOOKING_TYPES[r.booking.bookingType],
          utcToRestaurantTimezone(r.booking.clockedInAt, tz),
          r.booking.clockedOutAt
            ? utcToRestaurantTimezone(r.booking.clockedOutAt, tz)
            : "-",
          r.booking.bookingType === "dine_in"
            ? r.booking.bookingTables.map((i) => i.name).join(", ")
            : r.booking.bookingType === "takeout"
            ? r.booking.token
            : "",
          r.booking.pax,
          r.subTotal.toFixed(2),
          r.totalDiscount.toFixed(2),
          invoiceServiceCharge(r).toFixed(2),
          invoiceTax(r).toFixed(2),
          invoiceTip(r).toFixed(2),
          r.total.toFixed(2),
          invoicePaymentModes(r).join(", "),
          r.booking.customer?.name ?? "-",
          r.booking.userFullName,
        ];
      }),
      "sales-export",
    );
  };

  const onDateChange = (_: unknown, dates: [string, string]) => {
    setDateRange(dateRangePickerToString(dates[0], dates[1], tz));
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
            format={DATE_FORMAT}
            onChange={onDateChange}
            presets={TIME_RANGE_PRESETS}
          />

          <Button
            icon={<DownloadOutlined />}
            loading={bookingsExport.isPending || invoicesExport.isPending}
            onClick={
              reportType === "orders"
                ? onBookingsExportClick
                : onInvoicesExportClick
            }
          >
            Export
          </Button>
        </div>
      </div>

      <Summary dateRange={dateRange} />

      {reportType === "orders" && <OrdersWise dateRange={dateRange} />}
      {reportType === "invoices" && <InvoicesWise dateRange={dateRange} />}
    </Navbar>
  );
};
