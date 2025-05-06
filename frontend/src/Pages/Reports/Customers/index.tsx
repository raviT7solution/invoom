import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Table, TableColumnsType, Typography } from "antd";
import { useMemo } from "react";

import { useCustomers, useCustomersExport } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { exportAsCSV } from "../../../helpers/exports";
import { useDebounceFn, useTableState } from "../../../helpers/hooks";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const ReportsCustomers = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { filters, pagination, setFilters, setPagination } = useTableState(
    { query: "" },
    { page: 1, perPage: 10 },
  );

  const {
    data: { collection, metadata },
    isFetching,
  } = useCustomers({
    page: pagination.page,
    perPage: pagination.perPage,
    query: filters.query,
    restaurantId: restaurantId,
  });

  const customersExport = useCustomersExport();

  const setDebouncedFilters = useDebounceFn(setFilters, 500);

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. no",
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
        title: "Phone number",
        render: (_, i) => i.phoneNumber,
      },
      {
        title: "Avg invoice value",
        render: (_, r) => `$${r.avgInvoiceAmount.toFixed(2)}`,
      },
      {
        title: "Total invoice",
        render: (_, r) => r.invoiceCount,
      },
      {
        title: "Total spend",
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
      "Sr. no",
      "Name",
      "Email",
      "Phone number",
      "Avg invoice value",
      "Total invoice",
      "Total spend",
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
      "customers-export",
    );
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Reports" }, { title: "Customers report" }]}
    >
      <div className="flex justify-between">
        <Typography.Title level={4}>Customers report</Typography.Title>

        <div className="flex gap-2">
          <Input.Search
            onChange={(e) => setDebouncedFilters({ query: e.target.value })}
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
        onChange={(i) =>
          setPagination({ page: i.current!, perPage: i.pageSize! })
        }
        pagination={{
          current: metadata.currentPage,
          total: metadata.totalCount,
        }}
        rowKey="id"
        size="small"
      />
    </Navbar>
  );
};
