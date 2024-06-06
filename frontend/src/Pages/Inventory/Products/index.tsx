import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Button, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useProductDelete, useProducts } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const InventoryProducts = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: products } = useProducts(restaurantId);
  const { mutateAsync: productDelete } = useProductDelete();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditProduct = (id: string, open: boolean) => {
    setSelectedProductId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Inventory" }, { title: "Products" }]}>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditProduct("", true)}
          type="primary"
        >
          Add Product
        </Button>
      </div>

      <Edit
        open={isModalOpen}
        productId={selectedProductId}
        showEditProduct={showEditProduct}
      />

      <div>
        {products.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {products.map((product) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditProduct(product.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => productDelete({ id: product.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "w-64 h-44 shadow-md",
                  product.visible ? "" : "opacity-50",
                )}
                key={product.id}
              >
                <Card.Meta
                  className="h-20"
                  description={
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: false,
                      }}
                      type="secondary"
                    >
                      {product.description}
                    </Typography.Paragraph>
                  }
                  title={product.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
