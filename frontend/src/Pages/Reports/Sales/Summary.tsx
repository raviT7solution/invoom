import { Statistic, Tooltip } from "antd";

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
    <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-11 gap-2">
      <Tooltip title="Sum of invoice item price, plus taxes, plus service charge, plus service charge taxes, minus voids">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Total gross sales"
            value={summary?.totalGrossSales}
          />
        </div>
      </Tooltip>

      <Tooltip title="Sum of invoice taxes, plus service charge taxes, minus void's taxes">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Total taxes"
            value={summary?.totalTaxes}
          />
        </div>
      </Tooltip>

      <Tooltip title="Sum of invoice item discounted amount, plus service charge, minus voids">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Total net sales"
            value={summary?.totalNetSales}
          />
        </div>
      </Tooltip>

      <Tooltip title="Sum of payments tip">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Total tips"
            value={summary?.totalTips}
          />
        </div>
      </Tooltip>

      <Tooltip title="Sum of service charge without taxes">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Total service charges"
            value={summary?.totalServiceCharges}
          />
        </div>
      </Tooltip>

      <div className="border border-gray-200 p-3 rounded-md">
        <Statistic
          loading={isFetching}
          title="Total orders"
          value={summary?.bookingCount}
        />
      </div>

      <Tooltip title="Net sales per order">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Revenue per order"
            value={summary?.avgBookingRevenue}
          />
        </div>
      </Tooltip>

      <Tooltip title="Net sales per invoice">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Revenue per invoice"
            value={summary?.avgInvoiceRevenue}
          />
        </div>
      </Tooltip>

      <Tooltip title="Net sales per person">
        <div className="border border-gray-200 p-3 rounded-md">
          <Statistic
            loading={isFetching}
            precision={2}
            prefix="$"
            title="Revenue per person"
            value={summary?.avgPaxRevenue}
          />
        </div>
      </Tooltip>

      <div className="border border-gray-200 p-3 rounded-md">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Total voids"
          value={summary?.totalVoids}
        />
      </div>

      <div className="border border-gray-200 p-3 rounded-md">
        <Statistic
          loading={isFetching}
          precision={2}
          prefix="$"
          title="Total discounts"
          value={summary?.totalDiscounts}
        />
      </div>
    </div>
  );
};
