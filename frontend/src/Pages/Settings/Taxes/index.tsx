import { Card, Empty, Space } from "antd";

import { useSettingsTaxes } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Taxes = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: taxes } = useSettingsTaxes(restaurantId);

  return (
    <Navbar breadcrumbItems={[{ title: "Settings" }, { title: "Tax" }]}>
      <div>
        {taxes.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {taxes.map((tax) => (
              <Card className="h-44 shadow-md" key={tax.id}>
                <Card.Meta
                  className="h-20"
                  description={`
                  ${tax.gst !== 0 ? `\n GST: ${tax.gst}%` : ""}
                  ${tax.hst !== 0 ? `\n HST: ${tax.hst}%` : ""}
                  ${tax.pst !== 0 ? `\n PST: ${tax.pst}%` : ""}
                  ${tax.rst !== 0 ? `\n RST: ${tax.rst}%` : ""}
                  ${tax.qst !== 0 ? `\n QST: ${tax.qst}%` : ""}
                  `}
                  title={tax.displayName}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
