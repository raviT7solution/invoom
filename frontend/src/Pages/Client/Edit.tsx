import { Button, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { useClient, useClientCreate, useClientUpdate } from "../../api";
import { FormDrawer } from "../../components/FormDrawer";

type schema = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  country: string;
  signupType: "practice" | "business";
  practiceName?: string;
  businessName?: string;
  clientName: string;
};

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  country: "",
  signupType: "practice",
  clientName: "",
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
        clientId,
      };

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
              label="Mobile number"
              name="mobileNumber"
              rules={[
                { required: true, message: "Required" },
              ]}
            >
               <Input placeholder="Mobile number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>

          <Col span={6}>
            <Form.Item label="Country" name="country">
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

        <Col span={6}>
          <Form.Item
            label={signupType === "practice" ? "Practice Name" : "Business Name"}
            name="clientName"
          >
            <Input placeholder={signupType === "practice" ? "Practice Name" : "Business Name"} />
          </Form.Item>
        </Col>
      </Row>
      </Form>
    </FormDrawer>
  );
};
