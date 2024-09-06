import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Table, TableColumnsType, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { useCustomers, useCustomersExport } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { displayDate } from "../../../helpers/dateTime";
import { exportAsCSV } from "../../../helpers/exports";
import { useDebounceFn } from "../../../helpers/hooks";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const ReportsCustomers = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);
  const tz = useRestaurantIdStore((s) => s.tz);

  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useCustomers({
    page: pagination.page,
    perPage: pagination.perPage,
    query: query,
    restaurantId: restaurantId,
  });

  const customersExport = useCustomersExport();

  const setDebouncedQuery = useDebounceFn(setQuery, 500);

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. No",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Email",
        render: (_, r) => r.email ?? "-",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
      },
      {
        title: "Avg Invoice Value",
        render: (_, r) => `$${r.avgInvoiceAmount.toFixed(2)}`,
      },
      {
        title: "Total Invoice",
        render: (_, r) => r.invoiceCount,
      },
      {
        title: "Total Spend",
        render: (_, r) => `$${r.totalInvoiceAmount.toFixed(2)}`,
      },
    ],
    [metadata],
  );

  const onExportClick = async () => {
    const { collection } = await customersExport.mutateAsync({
      export: true,
      page: 1,
      perPage: -1,
      restaurantId: restaurantId,
    });

    const header = [
      "Sr. No",
      "Name",
      "Email",
      "Phone Number",
      "Avg Invoice Value",
      "Total Invoice",
      "Total Spend",
    ];

    exportAsCSV(
      header,
      collection.map((i, idx) => {
        return [
          idx + 1,
          i.name,
          i.email,
          i.phoneNumber,
          i.avgInvoiceAmount,
          i.invoiceCount,
          i.totalInvoiceAmount,
        ];
      }),
      `customers-export-${displayDate(dayjs(), tz)}`,
    );
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Reports" }, { title: "Customers Report" }]}
    >
      <div className="flex justify-between">
        <Typography.Title level={4}>Customers Report</Typography.Title>

        <div className="flex gap-2">
          <Input.Search
            onChange={(e) => setDebouncedQuery(e.target.value)}
            placeholder="Search name, email, phone number"
          />

          <Button
            icon={<DownloadOutlined />}
            loading={customersExport.isPending}
            onClick={onExportClick}
          >
            Export
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={collection}
        loading={isFetching}
        pagination={{
          current: metadata.currentPage,
          onChange: (page, pageSize) =>
            setPagination({ page, perPage: pageSize }),
          total: metadata.totalCount,
          pageSize: pagination.perPage,
        }}
        rowKey="id"
        size="small"
      />
    </Navbar>
  );
};
