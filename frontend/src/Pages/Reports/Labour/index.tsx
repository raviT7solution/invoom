import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Popconfirm,
  Select,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import { Edit } from "./Edit";

import { useTimeSheetDelete, useTimeSheets, useUsers } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import {
  DATE_FORMAT,
  dateRangePickerToString,
  humanizeDuration,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const ReportsLabour = () => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const [userIds, setUserIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: users } = useUsers(restaurantId);
  const {
    data: { collection, metadata },
    isFetching,
  } = useTimeSheets({
    endDate: dateRange.end,
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
    startDate: dateRange.start,
    userIds: userIds,
  });

  const { mutateAsync: deleteTimeSheet } = useTimeSheetDelete();

  const showEdit = (id: string, open: boolean) => {
    setId(id);
    setIsOpen(open);
  };

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. No",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        title: "First Name",
        dataIndex: ["user", "firstName"],
      },
      {
        title: "Last Name",
        dataIndex: ["user", "lastName"],
      },
      {
        title: "Start Time",
        render: (_, r) => utcToRestaurantTimezone(r.startTime, tz),
      },
      {
        title: "End Time",
        render: (_, r) =>
          r.endTime ? utcToRestaurantTimezone(r.endTime, tz) : "",
      },
      {
        title: "Shift Duration",
        render: (_, r) => humanizeDuration(r.startTime, r.endTime),
      },
      {
        title: "Actions",
        render: (_, r) => (
          <div className="w-full flex gap-4">
            <EditOutlined onClick={() => showEdit(r.id, true)} />

            <Popconfirm
              onConfirm={() => deleteTimeSheet({ id: r.id })}
              title="Are you sure you'd like to delete this?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </div>
        ),
      },
    ],
    [deleteTimeSheet, metadata, tz],
  );

  const onDateChange = (_: unknown, dates: [string, string]) => {
    setDateRange(dateRangePickerToString(dates[0], dates[1], tz));
  };

  return (
    <Navbar
      breadcrumbItems={[{ title: "Reports" }, { title: "Labour Report" }]}
    >
      <Edit id={id} open={isOpen} showEdit={showEdit} />

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

          <DatePicker.RangePicker
            format={DATE_FORMAT}
            onChange={onDateChange}
          />

          <Button onClick={() => showEdit("", true)} type="primary">
            Add Timesheet
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
        }}
        rowKey="id"
      />
    </Navbar>
  );
};
