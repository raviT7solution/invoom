import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Button, Empty, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";

import { Edit } from "./Edit";

import { useCategories, useCategoryDelete } from "../../../api";
import { Navbar } from "../../../components/Navbar";
import { classNames } from "../../../helpers";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

export const Categories = () => {
  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: categories } = useCategories(restaurantId);
  const { mutateAsync: deleteCategory } = useCategoryDelete();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showEditCategory = (id: string, open: boolean) => {
    setSelectedCategoryId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Cuisine Hub" }, { title: "Category" }]}>
      <div className="flex gap-4 mb-4 justify-end">
        <Button
          icon={<PlusOutlined />}
          onClick={() => showEditCategory("", true)}
          type="primary"
        >
          Add Category
        </Button>
      </div>

      <Edit
        categoryId={selectedCategoryId}
        open={isModalOpen}
        showEditCategory={showEditCategory}
      />

      <div>
        {categories.length === 0 ? (
          <div className="h-full w-full flex justify-center items-center">
            <Empty />
          </div>
        ) : (
          <Space direction="horizontal" wrap>
            {categories.map((category) => (
              <Card
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditCategory(category.id, true)}
                  />,
                  <Popconfirm
                    key="delete"
                    onConfirm={() => deleteCategory({ id: category.id })}
                    title="Are you sure you'd like to delete this?"
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
                className={classNames(
                  "w-64 h-44 shadow-md",
                  category.visible ? "" : "opacity-50",
                )}
                key={category.id}
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
                    />
                  }
                  title={category.name}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </Navbar>
  );
};
