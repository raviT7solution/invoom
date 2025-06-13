import { Button, Col, Form, Input, Radio, Row , Select , Table , Card, Checkbox  } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { FormDrawer } from "../../components/FormDrawer";
import { useState } from "react";
import React from "react";

type schema = {
  description: string;
  name: string;
  visible: boolean;
};
  interface PriceData {
    key: string;
    country: string;
    currency: string;
    monthly: string;
    annual: string;
  }
  const { Option } = Select;
  const initialData: PriceData[] = [
    { key: '1', country: 'USA', currency: 'USD', monthly: '', annual: '' },
    { key: '2', country: 'UK', currency: 'GBP', monthly: '', annual: '' },
    { key: '3', country: 'Ireland', currency: 'EUR', monthly: '', annual: '' },
    { key: '4', country: 'UAE', currency: 'AED', monthly: '', annual: '' },
    { key: '5', country: 'Australia', currency: 'AUD', monthly: '', annual: '' },
    { key: '6', country: 'India', currency: 'INR', monthly: '', annual: '' },
    { key: '7', country: 'Canada', currency: 'CAD', monthly: '', annual: '' },
    { key: '8', country: 'South Africa', currency: 'ZAR', monthly: '', annual: '' },
    { key: '9', country: 'European Union', currency: 'EUR', monthly: '', annual: '' },
    { key: '9', country: 'Other', currency: 'EUR', monthly: '', annual: '' },
  ];
  const currencyOptions = ['USD', 'GBP', 'EUR', 'AED', 'AUD', 'INR', 'CAD', 'ZAR'];


  const featureList = [
    "Multiple Submission Methods",
    "Capture Costs & Sales Invoices + Receipts",
    "Bank Statement Extraction",
    "Line Item Extraction",
    "Supplier Statement Extraction",
    "Teams & Locations",
    "Approvals",
    "Expenses & Mileage",
    "Auto-Categorisation",
    "Boost",
    "Auto Publish",
    "Supplier Statements",
    "Supplier Management",
    "Paid Stamp",
  ];
const initialValues = { description: "", visible: true };

const Edit = ({
  menuId,
  open,
  showEditMenu,
}: {
  menuId: string;
  open: boolean;
  showEditMenu: (id: string, open: boolean) => void;
}) => {
  const isNew = menuId === "";
  const [selectedOption, setSelectedOption] = useState("practice");

  const onFinish = async (values: schema) => {
    onClose();
  };

  const onClose = () => showEditMenu("", false);


  const [data, setData] = React.useState<PriceData[]>(initialData);  //for table 

  const handleCurrencyChange = (value: string, key: string) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, currency: value } : item
    );
    setData(updatedData);
  };

  const columns = [
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      render: (_: any, record: PriceData) => (
        <Select
          value={record.currency}
          style={{ width: '100%' }}
          onChange={(value) => handleCurrencyChange(value, record.key)}
        >
          {currencyOptions.map((cur) => (
            <Option key={cur} value={cur}>
              {cur}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Monthly',
      dataIndex: 'monthly',
      key: 'monthly',
      render: (_: any, record: PriceData) => (
        <Input
          value={record.monthly}
          onChange={(e) =>
            setData((prev) =>
              prev.map((item) =>
                item.key === record.key ? { ...item, monthly: e.target.value } : item
              )
            )
          }
        />
      ),
    },
    {
      title: 'Annual',
      dataIndex: 'annual',
      key: 'annual',
      render: (_: any, record: PriceData) => (
        <Input
          value={record.annual}
          onChange={(e) =>
            setData((prev) =>
              prev.map((item) =>
                item.key === record.key ? { ...item, annual: e.target.value } : item
              )
            )
          }
        />
      ),
    },
  ];

  const handleInputChange = (
    key: string,
    field: 'monthly' | 'annual',
    value: string
  ) => {
    const newData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(newData);
  };

  

  return (
        <FormDrawer
      footer={
        <Button form="client-form" htmlType="submit" type="primary">
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New Plan" : "Edit Plan"}
      width={1000}
    >
      <Form
        layout="vertical"
        name="client-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={16} className="mb-10">
            <Col span={12}>
                <Form.Item
                    label="Client type"
                    name="clientType" 
                    rules={[{ required: true, message: "Please select an option" }]}
                >
                <Radio.Group
                    onChange={(e) => setSelectedOption(e.target.value)}
                    value={selectedOption}
                    optionType="button"
                    buttonStyle="solid"
                >
                    <Radio.Button value="practice">Practice</Radio.Button>
                    <Radio.Button value="business">Business</Radio.Button>
                </Radio.Group>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                label="Plan name"
                name="planName"
                rules={[{ required: true, message: "Required" }]}
                >
                <Input placeholder="Plan name" />
                </Form.Item>
            </Col>
        </Row>

        
        <Row gutter={8} className="sectionRow mb-10">
            <div className="sectionTitle" >
                <h5>Default Pricing</h5>
            </div>
            <Col span={6}>
    <Form.Item
      label="Default Currency"
      name="defaultcurrency"
      rules={[{ required: true, message: 'Required' }]}
    >
        <Select
    showSearch
    placeholder="Default Currency"
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    options={[
        { value: 'USD', label: 'USD' },
        { value: 'INR', label: 'INR' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' },
        { value: 'AUD', label: 'AUD' },
      ]}
  />
      
    </Form.Item>
  </Col>
          <Col span={6}>
            <Form.Item
              label="Default Monthly Price"
              name="defaultmonthly"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Default Monthly" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Default Annual Price"
              name="defaultannual"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Default Annual" />
            </Form.Item>
          </Col>

         
        </Row>
        <Row gutter={8} className="sectionRow mb-10">
    <div className="sectionTitle">
      <h5>Country Wise Pricing</h5>
    </div>
  <Col span={24}>
    <Table
    className="country-table"
      dataSource={data}
      columns={columns}
      pagination={false}
      bordered
    />
    
  </Col>
        </Row>
        <Row gutter={8} className="sectionRow mb-10">
    <div className="sectionTitle">
      <h5>Usage Limits</h5>
    </div>
    <Col span={8}>
  <Form.Item
    label="Limit Clients"
    name="limitClients"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Clients" />
  </Form.Item>
</Col>

<Col span={8}>
  <Form.Item
    label="Limit Users"
    name="limitUsers"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Users" />
  </Form.Item>
</Col>

<Col span={8}>
  <Form.Item
    label="Limit Document"
    name="limitDocument"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Document" />
  </Form.Item>
</Col>
<Col span={8}>
  <Form.Item
    label="Limit Bank Statement"
    name="limitBankStatement"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Bank Statement" />
  </Form.Item>
</Col>
<Col span={8}>
  <Form.Item
    label="Limit Line Item"
    name="limitLineItem"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Line Item" />
  </Form.Item>
</Col>

<Col span={8}>
  <Form.Item
    label="Limit Supplier Statement"
    name="limitSupplierStatement"
    rules={[{ required: true, message: "Required" }]}
  >
    <Input placeholder="Enter Limit Supplier Statement" />
  </Form.Item>
</Col>

        </Row>
        <Row gutter={[16, 16]}  className="sectionRow mb-10">
    <div className="sectionTitle">
      <h5>Select Feature</h5>
    </div>
    {featureList.map((feature, index) => (
    <Col span={8} key={index}>
      <Card bordered hoverable>
        <Checkbox>{feature}</Checkbox>
      </Card>
    </Col>
  ))}
        </Row>

      </Form>
    </FormDrawer>
  );
};

export default Edit;
