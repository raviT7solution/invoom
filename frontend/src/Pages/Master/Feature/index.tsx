import { Navbar } from "../../../components/Navbar";
import { Button, Typography, Row, Col, Table } from "antd";
import Edit from "./Edit";
import { useEffect, useState } from "react";
import { TEST_API_URL } from "../../../utils/Constant";
import { getAuthToken, createAuthHeaders } from "../../../helpers";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type FeatureType = {
  featureId: number;
  name: string;
  description: string;
};

const Feature = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [data, setData] = useState<FeatureType[]>([]);
  const [loading, setLoading] = useState(false);

  const showEditMenu = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const response = await fetch(`${TEST_API_URL}/api/v1/features`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setData(json?.response || []);
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this feature?");
      if (!confirmDelete) return;

      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const res = await fetch(`${TEST_API_URL}/v1/features/delete/${id}`, {
        method: "DELETE",
        headers
      });

      if (!res.ok) throw new Error("Failed to delete feature");

      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const columns = [
    {
      title: "Sr. No",
      key: "serial",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => showEditMenu(record.featureId.toString(), true)}>
          <EditOutlined />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.featureId.toString())}>
          <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navbar breadcrumbItems={[{ title: "Feature" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
        refetch={fetchData}
      />

      <div className="mb-4 flex">
        <Typography.Title level={4}>All Features</Typography.Title>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button onClick={() => showEditMenu("", true)} type="primary">
            Add Feature
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white">
        <Row gutter={8} className="mb-10">
          <Col span={24}>
            <Table
              className="country-table"
              pagination={false}
              bordered
              loading={loading}
              columns={columns}
              dataSource={data}
              rowKey="featureId"
            />
          </Col>
        </Row>
      </div>
    </Navbar>
  );
};

export default Feature;
