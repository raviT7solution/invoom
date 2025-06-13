import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { FormDrawer } from "../../components/FormDrawer";

type schema = {
  description: string;
  name: string;
  visible: boolean;
};

const initialValues = { description: "", visible: true,clientType: "practice" };

export const Edit = ({
  menuId,
  open,
  showEditMenu,
}: {
  menuId: string;
  open: boolean;
  showEditMenu: (id: string, open: boolean) => void;
}) => {
    const isNew = menuId === "";
    const [clientType, setClientType] = useState("practice");

  const onFinish = async (values: schema) => {
    // isNew
    //   ? await menuCreate({
    //       input: { restaurantId: restaurantId, attributes: values },
    //     })
    //   : await menuUpdate({ input: { attributes: values, id: menuId } });

    onClose();
  };

  const onClose = () => showEditMenu("", false);

  return (
    <FormDrawer
      footer={
        <Button
          form="client-form"
          htmlType="submit"
          // loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New client" : "Edit client"}
      width={1000}
    >
      <Form
        // form={form}
        initialValues={initialValues }
        layout="vertical"
        name="user-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: isNew, message: "Required" }]}
            >
              <Input placeholder="Password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Required" },
              ]}
            >
               <Input placeholder="Phone number" />
            </Form.Item>
          </Col>

        <Col span={6}>
            <Form.Item label="Address line" name="address">
              <Input placeholder="Address line" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Country" name="country">
              <Select
                optionFilterProp="label"
                placeholder="Select"
                showSearch
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Client type"
              name="clientType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
              onChange={(value) => setClientType(value)}
                options={[
                  { label: "Practice", value: "practice" },
                  { label: "Business", value: "business" },
                ]}

                placeholder="Select client type"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
        {clientType === "practice" && (
          <Col span={6}>
            <Form.Item label="Practice Name" name="practiceName">
              <Input placeholder="Practice Name" />
            </Form.Item>
          </Col>
        )}

        {clientType === "business" && (
          <Col span={6}>
            <Form.Item label="Business Name" name="businessName">
              <Input placeholder="Business Name" />
            </Form.Item>
          </Col>
        )}
      </Row>
      </Form>
    </FormDrawer>
  );
};
