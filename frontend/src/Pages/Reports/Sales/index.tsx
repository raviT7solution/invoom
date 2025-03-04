import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Select,
  Table,
  TableColumnsType,
  TableProps,
  Typography,
} from "antd";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Summary } from "./Summary";

import {
  useBookings,
  useBookingsExport,
  useInvoices,
  useInvoicesExport,
} from "../../../api";
import { BookingsQuery, PaymentModeEnum } from "../../../api/base";
import { Navbar } from "../../../components/Navbar";
import { TIME_RANGE_PRESETS } from "../../../helpers";
import {
  DATE_FORMAT,
  dateRangePickerToString,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { exportAsCSV } from "../../../helpers/exports";
import { BOOKING_TYPES, PAYMENT_MODES } from "../../../helpers/mapping";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type InvoicesType = BookingsQuery["bookings"]["collection"][number]["invoices"];

type DateRangeType = {
  start: string | null;
  end: string | null;
};

type FiltersType = {
  bookingTypes: string[];
  paymentModes: PaymentModeEnum[];
  query: string;
};

type SetFiltersType = Dispatch<SetStateAction<FiltersType>>;

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
  return invoice.serviceChargeSummary.reduce((p, i) => p + i.value, 0);
};

const invoiceTax = (invoice: InvoicesType[number]) => {
  return invoice.taxSummary.reduce((p, i) => p + i.value, 0);
};

const invoiceTip = (invoice: InvoicesType[number]) => {
  return invoice.payments.reduce((p, i) => p + i.tip, 0);
};

const invoicePaymentModes = (invoice: InvoicesType[number]) => {
  return invoice.payments.map((i) => PAYMENT_MODES[i.paymentMode]);
};

const OrdersWise = ({
  dateRange,
  filters,
  setFilters,
}: {
  dateRange: DateRangeType;
  filters: FiltersType;
  setFilters: SetFiltersType;
}) => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useBookings({
    bookingTypes: filters.bookingTypes,
    endDate: dateRange.end,
    page: pagination.page,
    paymentModes: filters.paymentModes,
    perPage: pagination.perPage,
    query: filters.query,
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
        key: "bookingType",
        render: (_, r) => BOOKING_TYPES[r.bookingType],
        filters: Object.entries(BOOKING_TYPES).map(([value, text]) => ({
          text,
          value,
        })),
        filteredValue: filters.bookingTypes,
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
          if (r.bookingType === "dine_in") return r.tableNames?.join(", ");

          if (r.bookingType === "takeout" || r.bookingType === "delivery")
            return r.token;
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
          `$${r.invoices
            .reduce((p, i) => p + invoiceServiceCharge(i), 0)
            .toFixed(2)}`,
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
        key: "paymentType",
        render: (_, r) => r.invoices.flatMap(invoicePaymentModes).join(", "),
        filters: Object.entries(PAYMENT_MODES).map(([value, text]) => ({
          text,
          value,
        })),
        filteredValue: filters.paymentModes,
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
    [filters, metadata, tz],
  );

  const onTableChange: TableProps<(typeof collection)[number]>["onChange"] = (
    pagination,
    filters,
  ) => {
    setPagination({ page: pagination.current!, perPage: pagination.pageSize! });

    setFilters((i) => ({
      ...i,
      bookingTypes: (filters.bookingType ?? []) as string[],
      paymentModes: (filters.paymentType ?? []) as PaymentModeEnum[],
    }));
  };

  return (
    <Table
      columns={columns}
      dataSource={collection}
      loading={isFetching}
      onChange={onTableChange}
      pagination={{
        current: metadata.currentPage,
        total: metadata.totalCount,
      }}
      rowKey="id"
      size="small"
    />
  );
};

const InvoicesWise = ({
  dateRange,
  filters,
  setFilters,
}: {
  dateRange: DateRangeType;
  filters: FiltersType;
  setFilters: SetFiltersType;
}) => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useInvoices({
    bookingTypes: filters.bookingTypes,
    endDate: dateRange.end,
    page: pagination.page,
    paymentModes: filters.paymentModes,
    perPage: pagination.perPage,
    query: filters.query,
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
        key: "bookingType",
        render: (_, r) => BOOKING_TYPES[r.booking.bookingType],
        filters: Object.entries(BOOKING_TYPES).map(([value, text]) => ({
          text,
          value,
        })),
        filteredValue: filters.bookingTypes,
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
            return r.booking.tableNames?.join(", ");

          if (
            r.booking.bookingType === "takeout" ||
            r.booking.bookingType === "delivery"
          )
            return r.booking.token;
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
        key: "paymentType",
        render: (_, r) => invoicePaymentModes(r).join(", "),
        filters: Object.entries(PAYMENT_MODES).map(([value, text]) => ({
          text,
          value,
        })),
        filteredValue: filters.paymentModes,
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
    [filters, metadata, tz],
  );

  const onTableChange: TableProps<(typeof collection)[number]>["onChange"] = (
    pagination,
    filters,
  ) => {
    setPagination({ page: pagination.current!, perPage: pagination.pageSize! });

    setFilters((i) => ({
      ...i,
      bookingTypes: (filters.bookingType ?? []) as string[],
      paymentModes: (filters.paymentType ?? []) as PaymentModeEnum[],
    }));
  };

  return (
    <Table
      columns={columns}
      dataSource={collection}
      loading={isFetching}
      onChange={onTableChange}
      pagination={{
        current: metadata.currentPage,
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
  const [filters, setFilters] = useState<FiltersType>({
    bookingTypes: [],
    paymentModes: [],
    query: "",
  });

  const [dateRange, setDateRange] = useState<DateRangeType>({
    start: null,
    end: null,
  });

  const bookingsExport = useBookingsExport();
  const invoicesExport = useInvoicesExport();

  const onBookingsExportClick = async () => {
    const { collection } = await bookingsExport.mutateAsync({
      bookingTypes: filters.bookingTypes,
      endDate: dateRange.end,
      export: true,
      page: 1,
      paymentModes: filters.paymentModes,
      perPage: -1,
      query: filters.query,
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
            ? r.tableNames?.join(", ")
            : r.bookingType === "takeout" || r.bookingType === "delivery"
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
      bookingTypes: filters.bookingTypes,
      endDate: dateRange.end,
      export: true,
      page: 1,
      paymentModes: filters.paymentModes,
      perPage: -1,
      query: filters.query,
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
            ? r.booking.tableNames?.join(", ")
            : r.booking.bookingType === "takeout" ||
              r.booking.bookingType === "delivery"
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
          <Input.Search
            allowClear
            className="max-w-xs"
            enterButton
            onSearch={(query) => setFilters((i) => ({ ...i, query }))}
            placeholder="Search by Order ID, Invoice ID"
          />

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

      {reportType === "orders" && (
        <OrdersWise
          dateRange={dateRange}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {reportType === "invoices" && (
        <InvoicesWise
          dateRange={dateRange}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </Navbar>
  );
};
