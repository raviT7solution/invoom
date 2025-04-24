import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Popconfirm,
  Select,
  Space,
  Statistic,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import { Edit } from "./Edit";

import {
  useTimeSheetDelete,
  useTimeSheets,
  useTimeSheetSummary,
  useUsers,
} from "../../../api";
import { Navbar } from "../../../components/Navbar";
import {
  DATE_FORMAT,
  dateRangePickerToString,
  humanizeDuration,
  utcToRestaurantTimezone,
} from "../../../helpers/dateTime";
import { useTableState } from "../../../helpers/hooks";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type FiltersType = {
  end: string | null;
  start: string | null;
  userIds: string[];
};

export const ReportsLabour = () => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { filters, pagination, setFilters, setPagination } = useTableState<
    FiltersType,
    { page: number; perPage: number }
  >({ end: null, start: null, userIds: [] }, { page: 1, perPage: 10 });

  const { data: users } = useUsers(restaurantId);
  const {
    data: { collection, metadata },
    isFetching,
  } = useTimeSheets({
    endDate: filters.end,
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
    startDate: filters.start,
    userIds: filters.userIds,
  });
  const timeSheetSummary = useTimeSheetSummary({
    endTime: filters.end,
    restaurantId: restaurantId,
    startTime: filters.start,
    userIds: filters.userIds,
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
          <Space size="middle">
            <EditOutlined onClick={() => showEdit(r.id, true)} />

            <Popconfirm
              onConfirm={() => deleteTimeSheet({ id: r.id })}
              title="Are you sure you'd like to delete this?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteTimeSheet, metadata, tz],
  );

  const onDateChange = (_: unknown, dates: [string, string]) => {
    setFilters(dateRangePickerToString(dates[0], dates[1], tz));
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
            onChange={(ids) => setFilters({ userIds: ids })}
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

      <div className="flex my-2">
        <Card bordered size="small">
          <Statistic
            loading={timeSheetSummary.isFetching}
            precision={2}
            title="Total Hours"
            value={timeSheetSummary.data?.totalHours}
          />
        </Card>
      </div>

      <Table
        columns={columns}
        dataSource={collection}
        loading={isFetching}
        onChange={(i) =>
          setPagination({ page: i.current!, perPage: i.pageSize! })
        }
        pagination={{ total: metadata.totalCount }}
        rowKey="id"
      />
    </Navbar>
  );
};
