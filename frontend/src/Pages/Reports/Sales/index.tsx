import { DownloadOutlined, FileDoneOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Table,
  TableColumnsType,
  TableProps,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

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
import { useTableState } from "../../../helpers/hooks";
import { BOOKING_TYPES, PAYMENT_MODES } from "../../../helpers/mapping";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type InvoicesType = BookingsQuery["bookings"]["collection"][number]["invoices"];

type FiltersType = {
  bookingTypes: string[];
  end: string | null;
  paymentModes: PaymentModeEnum[];
  query: string;
  start: string | null;
};

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

const OrdersWise = () => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const { filters, pagination, setFilters, setPagination } = useTableState<
    FiltersType,
    { page: number; perPage: number }
  >(
    {
      bookingTypes: [],
      end: dayjs().tz(tz).endOf("day").toISOString(),
      paymentModes: [],
      query: "",
      start: dayjs().tz(tz).add(-30, "d").startOf("day").toISOString(),
    },
    { page: 1, perPage: 10 },
  );

  const {
    data: { collection, metadata },
    isFetching,
  } = useBookings({
    bookingTypes: filters.bookingTypes,
    endDate: filters.end,
    page: pagination.page,
    paymentModes: filters.paymentModes,
    perPage: pagination.perPage,
    query: filters.query,
    restaurantId: restaurantId,
    startDate: filters.start,
  });
  const bookingsExport = useBookingsExport();

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. no",
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
        title: "Order type",
        key: "bookingType",
        render: (_, r) => BOOKING_TYPES[r.bookingType],
        filters: Object.entries(BOOKING_TYPES).map(([value, text]) => ({
          text,
          value,
        })),
      },
      {
        title: "Start time",
        render: (_, r) => utcToRestaurantTimezone(r.clockedInAt, tz),
      },
      {
        title: "End time",
        render: (_, r) =>
          r.clockedOutAt ? utcToRestaurantTimezone(r.clockedOutAt, tz) : "-",
      },
      {
        title: "Table/Order no.",
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
        title: "Total service charge",
        render: (_, r) =>
          `$${r.invoices
            .reduce((p, i) => p + invoiceServiceCharge(i), 0)
            .toFixed(2)}`,
      },
      {
        title: "Total tax",
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
        title: "Payment type",
        key: "paymentType",
        render: (_, r) => r.invoices.flatMap(invoicePaymentModes).join(", "),
        filters: Object.entries(PAYMENT_MODES).map(([value, text]) => ({
          text,
          value,
        })),
      },
      {
        title: "Customer name",
        render: (_, r) => r.customer?.name ?? "-",
      },
      {
        title: "Server name",
        dataIndex: ["userFullName"],
      },
    ],
    [metadata, tz],
  );

  const onTableChange: TableProps<(typeof collection)[number]>["onChange"] = (
    pagination,
    filters,
  ) => {
    setFilters({
      bookingTypes: (filters.bookingType ?? []) as string[],
      paymentModes: (filters.paymentType ?? []) as PaymentModeEnum[],
    });

    setPagination({ page: pagination.current!, perPage: pagination.pageSize! });
  };

  const onExportClick = async () => {
    const { collection } = await bookingsExport.mutateAsync({
      bookingTypes: filters.bookingTypes,
      endDate: filters.end,
      export: true,
      page: 1,
      paymentModes: filters.paymentModes,
      perPage: -1,
      query: filters.query,
      restaurantId: restaurantId,
      startDate: filters.start,
    });

    const header = [
      "Sr. no",
      "Order ID",
      "Invoice ID",
      "Order type",
      "Start time",
      "End time",
      "Table/Order no.",
      "Pax",
      "Subtotal",
      "Total Dis.",
      "Total service charge",
      "Total tax",
      "Tip",
      "Total",
      "Payment type",
      "Customer name",
      "Server name",
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

  const onDateChange = (_: unknown, dates: [string, string]) => {
    setFilters(dateRangePickerToString(dates[0], dates[1], tz));
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Input.Search
          allowClear
          className="max-w-xs"
          enterButton
          onSearch={(query) => setFilters({ query: query })}
          placeholder="Search by order ID, invoice ID"
        />

        <DatePicker.RangePicker
          format={DATE_FORMAT}
          onChange={onDateChange}
          presets={TIME_RANGE_PRESETS}
          value={[
            filters.start ? dayjs(filters.start).tz(tz) : null,
            filters.end ? dayjs(filters.end).tz(tz) : null,
          ]}
        />

        <Button
          icon={<DownloadOutlined />}
          loading={bookingsExport.isPending}
          onClick={onExportClick}
        >
          Export
        </Button>
      </div>

      <Summary endTime={filters.end} startTime={filters.start} />

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
    </>
  );
};

const InvoicesWise = () => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const { filters, pagination, setFilters, setPagination } = useTableState<
    FiltersType,
    { page: number; perPage: number }
  >(
    {
      bookingTypes: [],
      end: dayjs().tz(tz).endOf("day").toISOString(),
      paymentModes: [],
      query: "",
      start: dayjs().tz(tz).add(-30, "d").startOf("day").toISOString(),
    },
    { page: 1, perPage: 10 },
  );

  const {
    data: { collection, metadata },
    isFetching,
  } = useInvoices({
    bookingTypes: filters.bookingTypes,
    endDate: filters.end,
    page: pagination.page,
    paymentModes: filters.paymentModes,
    perPage: pagination.perPage,
    query: filters.query,
    restaurantId: restaurantId,
    startDate: filters.start,
  });
  const invoicesExport = useInvoicesExport();

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. no",
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
        title: "Order type",
        key: "bookingType",
        render: (_, r) => BOOKING_TYPES[r.booking.bookingType],
        filters: Object.entries(BOOKING_TYPES).map(([value, text]) => ({
          text,
          value,
        })),
      },
      {
        title: "Start time",
        render: (_, r) => utcToRestaurantTimezone(r.booking.clockedInAt, tz),
      },
      {
        title: "End time",
        render: (_, r) =>
          r.booking.clockedOutAt
            ? utcToRestaurantTimezone(r.booking.clockedOutAt, tz)
            : "-",
      },
      {
        title: "Table/Order no.",
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
        title: "Total service charge",
        render: (_, r) => `$${invoiceServiceCharge(r).toFixed(2)}`,
      },
      {
        title: "Total tax",
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
        title: "Payment type",
        key: "paymentType",
        render: (_, r) => invoicePaymentModes(r).join(", "),
        filters: Object.entries(PAYMENT_MODES).map(([value, text]) => ({
          text,
          value,
        })),
      },
      {
        title: "Customer name",
        render: (_, r) => r.booking.customer?.name ?? "-",
      },
      {
        title: "Server name",
        dataIndex: ["booking", "userFullName"],
      },
    ],
    [metadata, tz],
  );

  const onTableChange: TableProps<(typeof collection)[number]>["onChange"] = (
    pagination,
    filters,
  ) => {
    setFilters({
      bookingTypes: (filters.bookingType ?? []) as string[],
      paymentModes: (filters.paymentType ?? []) as PaymentModeEnum[],
    });

    setPagination({ page: pagination.current!, perPage: pagination.pageSize! });
  };

  const onExportClick = async () => {
    const { collection } = await invoicesExport.mutateAsync({
      bookingTypes: filters.bookingTypes,
      endDate: filters.end,
      export: true,
      page: 1,
      paymentModes: filters.paymentModes,
      perPage: -1,
      query: filters.query,
      restaurantId: restaurantId,
      startDate: filters.start,
    });

    const header = [
      "Sr. no",
      "Order ID",
      "Invoice ID",
      "Order type",
      "Start time",
      "End time",
      "Table/Order no.",
      "Pax",
      "Subtotal",
      "Total Dis.",
      "Total service charge",
      "Total tax",
      "Tip",
      "Total",
      "Payment type",
      "Customer name",
      "Server name",
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
    setFilters(dateRangePickerToString(dates[0], dates[1], tz));
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Input.Search
          allowClear
          className="max-w-xs"
          enterButton
          onSearch={(query) => setFilters({ query: query })}
          placeholder="Search by Order ID, Invoice ID"
        />

        <DatePicker.RangePicker
          format={DATE_FORMAT}
          onChange={onDateChange}
          presets={TIME_RANGE_PRESETS}
          value={[
            filters.start ? dayjs(filters.start).tz(tz) : null,
            filters.end ? dayjs(filters.end).tz(tz) : null,
          ]}
        />

        <Button
          icon={<DownloadOutlined />}
          loading={invoicesExport.isPending}
          onClick={onExportClick}
        >
          Export
        </Button>
      </div>

      <Summary endTime={filters.end} startTime={filters.start} />

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
    </>
  );
};

export const ReportsSales = () => {
  return (
    <Navbar breadcrumbItems={[{ title: "Reports" }, { title: "Sales report" }]}>
      <Tabs
        items={[
          {
            children: <OrdersWise />,
            icon: <FileDoneOutlined />,
            key: "1",
            label: "Sales by orders",
          },
          {
            children: <InvoicesWise />,
            icon: <FileDoneOutlined />,
            key: "2",
            label: "Sales by invoices",
          },
        ]}
      />
    </Navbar>
  );
};
