import { AuditOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Card, DatePicker, Statistic } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { useDashboardSummary } from "../../api";
import { Navbar } from "../../components/Navbar";
import { ResponsiveChart } from "../../components/ResponsiveChart";
import { DATE_FORMAT, TIME_FORMAT } from "../../helpers/dateTime";
import { useRestaurantIdStore } from "../../stores/useRestaurantIdStore";

const COLORS = {
  line: "#2563eb",
};

const COLORS_FILL_OPACITY = 0.4;

export const Dashboard = () => {
  const { restaurantId, tz } = useRestaurantIdStore();

  const [date, setDate] = useState(dayjs().tz(tz).format(DATE_FORMAT));

  const { data } = useDashboardSummary({
    endTime: dayjs.tz(date, DATE_FORMAT, tz).endOf("day").toISOString(),
    restaurantId: restaurantId,
    startTime: dayjs.tz(date, DATE_FORMAT, tz).startOf("day").toISOString(),
  });

  const hourlyRevenue = useMemo(() => {
    const arr: [string, number][] =
      data?.hourlyRevenue.map((v, i) => [
        dayjs().hour(i).minute(0).format(TIME_FORMAT),
        v,
      ]) ?? [];

    return arr;
  }, [data?.hourlyRevenue]);

  return (
    <Navbar breadcrumbItems={[{ title: "Dashboard" }]}>
      <div className="grid grid-cols-6 gap-2">
        <div className="flex flex-col col-span-6 lg:col-span-2">
          <div className="mb-2">
            <DatePicker
              allowClear={false}
              className="w-full"
              format={DATE_FORMAT}
              onChange={(_, i) => {
                if (typeof i === "string") setDate(i);
              }}
              value={dayjs.tz(date, DATE_FORMAT, tz)}
            />
          </div>

          <div className="grow grid grid-cols-2 gap-2">
            <Card
              className="!border-gray-200"
              size="small"
              styles={{ title: { textAlign: "center" } }}
              title="Revenue"
            >
              <Statistic
                prefix="$"
                title="Total"
                value={data?.totalRevenue.toFixed(2)}
              />
              <Statistic
                prefix="$"
                title="Avg order value"
                value={data?.avgBookingRevenue.toFixed(2)}
              />
              <Statistic
                prefix="$"
                title="Avg receipt value"
                value={data?.avgInvoiceRevenue.toFixed(2)}
              />
            </Card>

            <Card
              className="!border-gray-200"
              size="small"
              styles={{ title: { textAlign: "center" } }}
              title="Sale"
            >
              <Statistic
                prefix={<UserOutlined className="text-sm" />}
                title="Customers"
                value={data?.paxCount}
              />
              <Statistic
                prefix={<FormOutlined className="text-sm" />}
                title="Orders"
                value={data?.bookingCount}
              />
              <Statistic
                prefix={<AuditOutlined className="text-sm" />}
                title="Receipts"
                value={data?.invoiceCount}
              />
            </Card>
          </div>
        </div>

        <div className="border rounded-md col-span-6 lg:col-span-4">
          <ResponsiveChart
            className="max-h-80"
            options={{
              chart: { type: "area" },
              credits: { enabled: false },
              plotOptions: { area: { marker: { enabled: false } } },
              series: [
                {
                  color: COLORS.line,
                  data: hourlyRevenue,
                  fillOpacity: COLORS_FILL_OPACITY,
                  lineWidth: 1,
                  name: "Revenue",
                  type: "area",
                },
              ],
              title: {
                style: { fontSize: "0.875rem" },
                text: "Revenue by Time",
              },
              tooltip: { pointFormat: "<b>{series.name}: {point.y:.2f}</b>" },
              xAxis: { categories: hourlyRevenue.map((i) => i[0]) },
              yAxis: { title: { text: "" } },
            }}
          />
        </div>

        <div className="border rounded-md col-span-6 flex flex-col items-center p-1 lg:col-span-3">
          <ResponsiveChart
            className="max-h-72"
            options={{
              chart: { type: "pie" },
              credits: { enabled: false },
              plotOptions: {
                pie: {
                  dataLabels: {
                    format: "{point.name} {point.percentage:.1f}%",
                  },
                },
              },
              series: [
                {
                  data: [
                    { name: "Dine In", y: data?.dineInRevenue },
                    { name: "Takeout", y: data?.takeoutRevenue },
                    { name: "Delivery", y: data?.deliveryRevenue },
                  ],
                  name: "Percentage",
                  type: "pie",
                },
              ],
              title: {
                style: { fontSize: "0.875rem" },
                text: "Sale Distribution",
              },
              tooltip: {
                pointFormat:
                  "<b>{point.percentage:.1f}%<br />$ {point.y:.2f}</b>",
              },
            }}
          />
        </div>

        <div className="border rounded-md col-span-6 flex flex-col items-center p-1 lg:col-span-3">
          <ResponsiveChart
            className="max-h-72"
            options={{
              chart: { type: "pie" },
              credits: { enabled: false },
              plotOptions: {
                pie: {
                  dataLabels: {
                    format: "{point.name} {point.percentage:.1f}%",
                  },
                },
              },
              series: [
                {
                  data: [
                    { name: "Card", y: data?.cardRevenue },
                    { name: "Cash", y: data?.cashRevenue },
                    { name: "Cheque", y: data?.chequeRevenue },
                    { name: "Door Dash", y: data?.doorDashRevenue },
                    { name: "Gift Card", y: data?.giftCardRevenue },
                    { name: "Other", y: data?.otherRevenue },
                    { name: "Skip the dishes", y: data?.skipTheDishesRevenue },
                    { name: "Uber Eats", y: data?.uberEatsRevenue },
                    { name: "Void", y: data?.voidRevenue },
                  ],
                  name: "Percentage",
                  type: "pie",
                },
              ],
              title: {
                style: { fontSize: "0.875rem" },
                text: "Payment Distribution",
              },
              tooltip: {
                pointFormat:
                  "<b>{point.percentage:.1f}%<br />$ {point.y:.2f}</b>",
              },
            }}
          />
        </div>
      </div>
    </Navbar>
  );
};
