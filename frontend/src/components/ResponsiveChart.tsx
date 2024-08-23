import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { classNames } from "../helpers";

export const ResponsiveChart = ({
  className,
  options,
}: {
  className?: string;
  options: Highcharts.Options;
}) => {
  return (
    <HighchartsReact
      containerProps={{
        className: classNames("w-full h-full", className ?? ""),
      }}
      highcharts={Highcharts}
      options={options}
    />
  );
};
