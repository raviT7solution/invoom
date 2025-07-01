import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { useClient, useClientCreate, useClientUpdate } from "../../api";
import { FormDrawer } from "../../components/FormDrawer";

type schema = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  mobileNumber: string;
  address: string;
  country: string;
  signupType: "practice" | "business";
  practiceName?: string;
  businessName?: string;
};


const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobileNumber: "",
  address: "",
  country: "",
  signupType: "practice",
  practiceName: "",
  businessName: "",
};

export const Edit = ({
  clientId,
  open,
  showEditClient,
}: {
  clientId: string;
  open: boolean;
  showEditClient: (id: string, open: boolean) => void;
}) => {
    const isNew = clientId === "";
    const [signupType, setSignupType] = useState("practice");

    const { data: client, isFetching } = useClient(clientId);
    const { mutateAsync: clientCreate, isPending: isCreating } = useClientCreate();
    const { mutateAsync: clientUpdate, isPending: isUpdating } = useClientUpdate();

    const onFinish = async (values: schema) => {
      const payload = {
        ...values,
        signupType: values.signupType === "practice" ? "Practice" : "Business",
        clientName: values.signupType === "practice" ? values.practiceName : values.businessName,
        clientId,
      };

      console.log("Payload:", payload);

      isNew
        ? await clientCreate(payload) // 👈 send directly
        : await clientUpdate(payload); // assuming update still needs this shape

      onClose();
    };


  const onClose = () => showEditClient("", false);

  return (
    <FormDrawer
      footer={
        <Button
          form="client-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New client" : "Edit client"}
      width={1000}
    >

      <Form
        initialValues={isNew ? initialValues : client}
        layout="vertical"
        name="client-form"
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
              name="mobileNumber"
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
              {/* <Select
                optionFilterProp="label"
                placeholder="Select"
                showSearch
              /> */}
              <Input placeholder="Country" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Client type"
              name="signupType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
              onChange={(value) => setSignupType(value)}
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
        {signupType === "practice" && (
          <Col span={6}>
            <Form.Item label="Practice Name" name="practiceName">
              <Input placeholder="Practice Name" />
            </Form.Item>
          </Col>
        )}

        {signupType === "business" && (
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
