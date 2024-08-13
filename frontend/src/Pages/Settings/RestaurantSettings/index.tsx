import {
  DollarOutlined,
  InfoCircleFilled,
  PercentageOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Tabs, Tooltip } from "antd";

import { OperationPin } from "./OperationPin";
import { PaymentConfiguration } from "./PaymentConfigurations";
import { PrinterConfigurations } from "./PrinterConfigurations";
import { ServiceCharges } from "./ServiceCharge";
import { Taxes } from "./Taxes";

import { Navbar } from "../../../components/Navbar";

export const RestaurantSettings = () => {
  return (
    <Navbar
      breadcrumbItems={[
        { title: "Settings" },
        { title: "Restaurant Settings" },
      ]}
    >
      <Tabs
        items={[
          {
            label: (
              <span className="flex gap-2">
                Taxes
                <PercentageOutlined />
              </span>
            ),
            key: "1",
            children: <Taxes />,
          },
          {
            label: (
              <span className="flex gap-2">
                Operation Pin
                <Tooltip title="This pin will be used to delete items from orders.">
                  <InfoCircleFilled />
                </Tooltip>
              </span>
            ),
            key: "2",
            children: <OperationPin />,
          },
          {
            label: (
              <span className="flex gap-2">
                Printer Configurations
                <PrinterOutlined />
              </span>
            ),
            key: "3",
            children: <PrinterConfigurations />,
          },
          {
            label: (
              <span className="flex gap-2">
                Payment Gateway Configurations
                <DollarOutlined />
              </span>
            ),
            key: "4",
            children: <PaymentConfiguration />,
          },
          {
            label: (
              <span className="flex gap-2">
                Service Charge
                <PlusCircleOutlined />
              </span>
            ),
            key: "5",
            children: <ServiceCharges />,
          },
        ]}
      />
    </Navbar>
  );
};
