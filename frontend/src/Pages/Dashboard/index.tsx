
import { Navbar } from "../../components/Navbar";
// import { useRestaurantIdStore } from "../../stores/useRestaurantIdStore";

const COLORS = {
  line: "#2563eb",
};

const COLORS_FILL_OPACITY = 0.4;

export const Dashboard = () => {
  // const { restaurantId, tz } = useRestaurantIdStore();

  // const [date, setDate] = useState(dayjs().tz(tz).format(DATE_FORMAT));

  // const { data, isFetching } = useDashboardSummary({
  //   endTime: dayjs.tz(date, DATE_FORMAT, tz).endOf("day").toISOString(),
  //   restaurantId: restaurantId,
  //   startTime: dayjs.tz(date, DATE_FORMAT, tz).startOf("day").toISOString(),
  // });

  // const hourlyRevenue = useMemo(() => {
  //   const arr: [string, number][] =
  //     data?.hourlyRevenue.map((v, i) => [
  //       dayjs().hour(i).minute(0).format(TIME_FORMAT),
  //       v,
  //     ]) ?? [];

  //   return arr;
  // }, [data?.hourlyRevenue]);

  return (
    <Navbar breadcrumbItems={[{ title: "Dashboard" }]}>
      {/* <div className="grid grid-cols-6 gap-2">
        <div className="col-span-6 flex flex-col lg:col-span-2">
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

          <div className="grid grow grid-cols-2 gap-2">
            <Card
              className="!border-gray-200"
              size="small"
              styles={{ title: { textAlign: "center" } }}
              title="Revenue"
            >
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Revenue per order"
                value={data?.avgBookingRevenue}
              />
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Revenue per invoice"
                value={data?.avgInvoiceRevenue}
              />
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Revenue per person"
                value={data?.avgPaxRevenue}
              />
            </Card>

            <Card
              className="!border-gray-200"
              size="small"
              styles={{ title: { textAlign: "center" } }}
              title="Sale"
            >
              <Statistic
                loading={isFetching}
                prefix={<UserOutlined className="text-sm" />}
                title="Customers"
                value={data?.paxCount}
              />
              <Statistic
                loading={isFetching}
                prefix={<FormOutlined className="text-sm" />}
                title="Orders"
                value={data?.bookingCount}
              />
              <Statistic
                loading={isFetching}
                prefix={<AuditOutlined className="text-sm" />}
                title="Receipts"
                value={data?.invoiceCount}
              />
            </Card>
          </div>
        </div>

        <div className="col-span-6 overflow-hidden rounded-md border lg:col-span-4">
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
                text: "Revenue by time",
              },
              tooltip: { pointFormat: "<b>{series.name}: {point.y:.2f}</b>" },
              xAxis: { categories: hourlyRevenue.map((i) => i[0]) },
              yAxis: { title: { text: "" } },
            }}
          />
        </div>

        <div className="col-span-full grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-6">
          <Tooltip title="Sum of invoice item price, plus taxes, plus service charge, plus service charge taxes, minus voids">
            <div className="rounded-md border border-gray-200 p-3">
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Total gross sales"
                value={data?.totalGrossSales}
              />
            </div>
          </Tooltip>

          <Tooltip title="Sum of invoice item discounted amount, plus service charge, minus voids">
            <div className="rounded-md border border-gray-200 p-3">
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Total net sales"
                value={data?.totalNetSales}
              />
            </div>
          </Tooltip>

          <div className="rounded-md border border-gray-200 p-3">
            <Statistic
              loading={isFetching}
              precision={2}
              prefix="$"
              title="Total taxes"
              value={data?.totalTaxes}
            />
          </div>

          <div className="rounded-md border border-gray-200 p-3">
            <Statistic
              loading={isFetching}
              precision={2}
              prefix="$"
              title="Total tips"
              value={data?.totalTips}
            />
          </div>

          <Tooltip title="Sum of service charge without taxes">
            <div className="rounded-md border border-gray-200 p-3">
              <Statistic
                loading={isFetching}
                precision={2}
                prefix="$"
                title="Total service charges"
                value={data?.totalServiceCharges}
              />
            </div>
          </Tooltip>

          <div className="rounded-md border border-gray-200 p-3">
            <Statistic
              loading={isFetching}
              precision={2}
              prefix="$"
              title="Total discounts"
              value={data?.totalDiscounts}
            />
          </div>
        </div>

        <div className="col-span-6 flex flex-col items-center rounded-md border p-1 lg:col-span-3">
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
                    { name: "Dine-in", y: data?.dineInRevenue },
                    { name: "Takeout", y: data?.takeoutRevenue },
                    { name: "Delivery", y: data?.deliveryRevenue },
                  ],
                  name: "Percentage",
                  type: "pie",
                },
              ],
              title: {
                style: { fontSize: "0.875rem" },
                text: "Sale distribution",
              },
              tooltip: {
                pointFormat:
                  "<b>{point.percentage:.1f}%<br />$ {point.y:.2f}</b>",
              },
            }}
          />
        </div>

        <div className="col-span-6 flex flex-col items-center rounded-md border p-1 lg:col-span-3">
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
                text: "Payment distribution",
              },
              tooltip: {
                pointFormat:
                  "<b>{point.percentage:.1f}%<br />$ {point.y:.2f}</b>",
              },
            }}
          />
        </div>
      </div> */}
    </Navbar>
  );
};
