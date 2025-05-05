import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  HistoryOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { useMemo, useState } from "react";

import { ActionModal } from "./ActionModal";
import { Edit } from "./Edit";

import { useProductDelete, useProducts } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const InventoryProducts = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [modal, setModal] = useState({ destroyed: false, id: "", open: false });
  const [actionModal, setActionModal] = useState({
    open: false,
    productId: "",
    stockType: "",
  });

  const {
    data: { collection, metadata },
    isFetching,
  } = useProducts({
    page: pagination.page,
    perPage: pagination.perPage,
    restaurantId: restaurantId,
  });

  const { mutateAsync: deleteProduct } = useProductDelete();

  const showEdit = (destroyed: boolean, id: string, open: boolean) => {
    setModal({ destroyed, id, open });
  };

  const showActionModal = (
    productId: string,
    open: boolean,
    stockType: string,
  ) => {
    setActionModal({ productId, open, stockType });
  };

  const columns: TableColumnsType<(typeof collection)[number]> = useMemo(
    () => [
      {
        title: "Sr. no",
        render: (_, _r, index) =>
          (metadata.currentPage - 1) * metadata.limitValue + index + 1,
      },
      {
        title: "Product name",
        dataIndex: "name",
      },
      {
        title: "Category name",
        dataIndex: ["inventoryCategory", "name"],
      },
      {
        title: "UOM",
        dataIndex: "uom",
      },
      {
        title: "Reorder point",
        dataIndex: "reorderPoint",
      },
      {
        title: "Available quantity",
        dataIndex: "availableQuantity",
        align: "center",
      },
      {
        title: "Visible",
        render: (_, r) =>
          r.visible ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          ),
      },
      {
        title: "Action",
        render: (_, r) => (
          <Space size="middle">
            <Tooltip title="Receive">
              <DownloadOutlined
                onClick={() =>
                  setActionModal({
                    open: true,
                    productId: r.id,
                    stockType: "receive",
                  })
                }
              />
            </Tooltip>

            <Tooltip title="Day end">
              <HistoryOutlined
                onClick={() =>
                  setActionModal({
                    open: true,
                    productId: r.id,
                    stockType: "day_end",
                  })
                }
              />
            </Tooltip>

            <Tooltip title="Edit">
              <EditOutlined onClick={() => showEdit(false, r.id, true)} />
            </Tooltip>

            <Popconfirm
              onConfirm={() => deleteProduct({ id: r.id })}
              title="Are you sure you'd like to delete this?"
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteProduct, metadata.currentPage, metadata.limitValue],
  );

  return (
    <Navbar breadcrumbItems={[{ title: "Inventory" }, { title: "Products" }]}>
      <div className="mb-4 flex justify-end gap-4">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEdit(false, "", true)}
          type="primary"
        >
          Add product
        </Button>
      </div>

      {!modal.destroyed && (
        <Edit id={modal.id} open={modal.open} showEdit={showEdit} />
      )}

      <ActionModal
        open={actionModal.open}
        productId={actionModal.productId}
        showActionModal={showActionModal}
        stockType={actionModal.stockType}
      />

      <Table
        columns={columns}
        dataSource={collection}
        loading={isFetching}
        pagination={{
          current: metadata.currentPage,
          onChange: (page, pageSize) =>
            setPagination({ page, perPage: pageSize }),
          total: metadata.totalCount,
        }}
        rowKey="id"
      />
    </Navbar>
  );
};
