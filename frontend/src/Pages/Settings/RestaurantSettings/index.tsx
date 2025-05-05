import {
  DollarOutlined,
  FileDoneOutlined,
  InfoCircleFilled,
  MessageOutlined,
  PercentageOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Tabs, Tooltip } from "antd";

import { OperationPin } from "./OperationPin";
import { PaymentConfiguration } from "./PaymentConfigurations";
import { PrinterConfigurations } from "./PrinterConfigurations";
import { ReceiptConfigurations } from "./ReceiptConfigurations";
import { ServiceCharges } from "./ServiceCharge";
import { SmsConfigurations } from "./SmsConfigurations";
import { Taxes } from "./Taxes";

import { Navbar } from "../../../components/Navbar";

export const RestaurantSettings = () => {
  return (
    <Navbar
      breadcrumbItems={[
        { title: "Settings" },
        { title: "Restaurant settings" },
      ]}
    >
      <Tabs
        items={[
          {
            children: <Taxes />,
            icon: <PercentageOutlined />,
            key: "1",
            label: "Taxes",
          },
          {
            children: <OperationPin />,
            icon: <InfoCircleFilled />,
            key: "2",
            label: (
              <Tooltip title="This pin will be used to delete items from orders.">
                Operation pin
              </Tooltip>
            ),
          },
          {
            children: <PrinterConfigurations />,
            icon: <PrinterOutlined />,
            label: "Printer configurations",
            key: "3",
          },
          {
            children: <PaymentConfiguration />,
            icon: <DollarOutlined />,
            key: "4",
            label: "Payment gateway configurations",
          },
          {
            children: <ServiceCharges />,
            icon: <PlusCircleOutlined />,
            key: "5",
            label: "Service charge",
          },
          {
            children: <SmsConfigurations />,
            icon: <MessageOutlined />,
            key: "6",
            label: "SMS configurations",
          },
          {
            children: <ReceiptConfigurations />,
            icon: <FileDoneOutlined />,
            key: "7",
            label: "Receipt configurations",
          },
        ]}
      />
    </Navbar>
  );
};
