import { Button, Col, Form, Input, Row } from "antd";
import { FormDrawer } from "../../../components/FormDrawer";
import { TEST_API_URL } from "../../../utils/Constant";
import { createAuthHeaders } from "../../../helpers";
import { useEffect, useState } from "react";

type schema = {
  name: string;
  description: string;
};

const Edit = ({
  menuId,
  open,
  showEditMenu,
  refetch,
}: {
  menuId: string;
  open: boolean;
  showEditMenu: (id: string, open: boolean) => void;
  refetch: () => void;
}) => {
  const [form] = Form.useForm();
  const isNew = menuId === "";
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    showEditMenu("", false);
  };

  const onFinish = async (values: schema) => {
    try {
      setLoading(true);
      
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const url = isNew
        ? `${TEST_API_URL}/api/v1/features/create`
        : `${TEST_API_URL}/api/v1/features/edit/${menuId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save feature");

      refetch();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatureById = async () => {
    if (!menuId) return;

    try {
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const res = await fetch(`${TEST_API_URL}/api/v1/features/${menuId}`, {
        headers,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      form.setFieldsValue({
        name: data?.response?.name,
        description: data?.response?.description,
      });
    } catch (err) {
      console.error("Error fetching feature:", err);
    }
  };

  useEffect(() => {
    if (!isNew && open) {
      fetchFeatureById();
    }
  }, [menuId, open]);

  return (
    <FormDrawer
      footer={
        <Button
          form="feature-form"
          htmlType="submit"
          loading={loading}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New Feature" : "Edit Feature"}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="feature-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Feature Name"
              name="name"
              rules={[{ required: true, message: "Feature name is required" }]}
            >
              <Input placeholder="Enter feature name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Feature Description"
              name="description"
              rules={[{ required: true, message: "Feature description is required" }]}
            >
              <Input placeholder="Enter feature description" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};

export default Edit;
