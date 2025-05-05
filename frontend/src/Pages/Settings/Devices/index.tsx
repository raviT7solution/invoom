import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Table, TableColumnsType } from "antd";
import { useMemo, useState } from "react";

import { Edit } from "./Edit";

import { useDeviceDelete, useDevices } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Devices = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [deviceId, setDeviceId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const devices = useDevices(restaurantId);

  const deleteDevice = useDeviceDelete();

  const showEdit = (id: string, open: boolean) => {
    setDeviceId(id);
    setIsOpen(open);
  };

  const columns: TableColumnsType<(typeof devices.data)[number]> = useMemo(
    () => [
      {
        title: "Sr. no",
        render: (_, _r, index) => index + 1,
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Fingerprint",
        dataIndex: "fingerprint",
      },
      {
        title: "Actions",
        render: (_, i) => (
          <Space size="middle">
            <EditOutlined onClick={() => showEdit(i.id, true)} />

            <Popconfirm
              onConfirm={() => deleteDevice.mutateAsync({ id: i.id })}
              title="Are you sure you'd like to delete this?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteDevice],
  );

  return (
    <Navbar breadcrumbItems={[{ title: "Settings" }, { title: "Devices" }]}>
      <Edit id={deviceId} open={isOpen} showEdit={showEdit} />

      <Table
        columns={columns}
        dataSource={devices.data}
        loading={devices.isFetching}
        pagination={false}
        rowKey="id"
      />
    </Navbar>
  );
};
