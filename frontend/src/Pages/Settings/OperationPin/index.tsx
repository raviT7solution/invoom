import { InfoCircleFilled } from "@ant-design/icons";
import { Tabs, Tooltip } from "antd";

import { Edit } from "./Edit";

import { Navbar } from "../../../components/Navbar";

export const OperationPin = () => {
  return (
    <Navbar
      breadcrumbItems={[{ title: "Settings" }, { title: "Operation Pin" }]}
    >
      <Tabs
        items={[
          {
            label: (
              <span className="flex gap-2">
                Operation Pin
                <Tooltip title="This pin will be used to delete items from orders.">
                  <InfoCircleFilled />
                </Tooltip>
              </span>
            ),
            key: "1",
            children: <Edit />,
          },
        ]}
      />
    </Navbar>
  );
};
