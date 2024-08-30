import { Card, Statistic } from "antd";

import { useSalesSummary } from "../../../api";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Summary = ({
  dateRange,
}: {
  dateRange: {
    start: string | null;
    end: string | null;
  };
}) => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: summary, isFetching } = useSalesSummary({
    restaurantId: restaurantId,
    startTime: dateRange.start,
    endTime: dateRange.end,
  });

  return (
    <div className="flex gap-2 my-2">
      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Total Revenue"
          value={summary?.totalRevenue}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Total Tax"
          value={summary?.totalTax}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Avg order revenue"
          value={summary?.avgBookingRevenue}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Avg recipet revenue"
          value={summary?.avgInvoiceRevenue}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          title="Total Orders"
          value={summary?.bookingCount}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          title="Total Invoice"
          value={summary?.invoiceCount}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          title="Total Customers"
          value={summary?.paxCount}
        />
      </Card>

      <Card bordered className="w-full" size="small">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Total Tip"
          value={summary?.totalTip}
        />
      </Card>
    </div>
  );
};
