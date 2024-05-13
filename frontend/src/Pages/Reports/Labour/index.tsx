import { DatePicker, Select, Table, TableColumnsType, Typography } from "antd";
import { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

import { useRestaurants, useTimeSheets, useUsers } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import {
  datePickerToString,
  humanizeDuration,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const ReportsLabour = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  const { data: users } = useUsers(restaurantId);
  const { data: restaurants } = useRestaurants("active");
  const {
    data: { collection, metadata },
    isFetching,
  } = useTimeSheets({
    endDate: endDate,
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
    startDate: startDate,
    userIds: userIds,
  });

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === restaurantId),
    [restaurantId, restaurants],
  );

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "ID",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        dataIndex: ["user", "firstName"],
        title: "First Name",
      },
      {
        dataIndex: ["user", "lastName"],
        title: "Last Name",
      },
      {
        title: "Start Time",
        render: (_, r) =>
          utcToRestaurantTimezone(r.startTime, restaurant?.timezone),
      },
      {
        title: "End Time",
        render: (_, r) =>
          r.endTime
            ? utcToRestaurantTimezone(r.endTime, restaurant?.timezone)
            : "",
      },
      {
        title: "Shift Duration",
        render: (_, r) => humanizeDuration(r.startTime, r.endTime),
      },
    ],
    [metadata, restaurant?.timezone],
  );

  const onDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const [start, end] = dates ?? [null, null];

    setStartDate(start ? datePickerToString(start, restaurant?.timezone) : "");
    setEndDate(end ? datePickerToString(end, restaurant?.timezone) : "");
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Reports" }, { title: "Labour Report" }]}
    >
      <div className="flex">
        <Typography.Title level={4}>Labour Report</Typography.Title>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Select
            className="w-1/4"
            mode="multiple"
            onChange={(ids) => setUserIds(ids)}
            optionFilterProp="label"
            options={users.map((r) => ({
              label: r.fullName,
              value: r.id,
            }))}
            placeholder="Select users"
          />

          <DatePicker.RangePicker onChange={onDateChange} />
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
        }}
        rowKey="id"
      />
    </Navbar>
  );
};
