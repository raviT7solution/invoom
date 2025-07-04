import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Table,
  Card,
  Checkbox,
  message,
} from "antd";
import { FormDrawer } from "../../components/FormDrawer";
import { TEST_API_URL } from "../../utils/Constant";
import { createAuthHeaders } from "../../helpers";

const { Option } = Select;

const usageLimitFields = [
  { name: "limitClients", label: "Limit Clients", placeholder: "Enter Limit Clients" },
  { name: "limitUsers", label: "Limit Users", placeholder: "Enter Limit Users" },
  { name: "limitDocument", label: "Limit Document", placeholder: "Enter Limit Document" },
  { name: "limitBankStatement", label: "Limit Bank Statement", placeholder: "Enter Limit Bank Statement" },
  { name: "limitLineItem", label: "Limit Line Item", placeholder: "Enter Limit Line Item" },
  { name: "limitSupplierStatement", label: "Limit Supplier Statement", placeholder: "Enter Limit Supplier Statement" },
];

const initialData = [
  { key: "1", country: "US", currency: "USD", monthly: "", annual: "", region: "North America" },
  { key: "2", country: "UK", currency: "GBP", monthly: "", annual: "", region: "Europe" },
  { key: "3", country: "IE", currency: "EUR", monthly: "", annual: "", region: "Europe" },
  { key: "4", country: "AE", currency: "AED", monthly: "", annual: "", region: "Middle East" },
  { key: "5", country: "AU", currency: "AUD", monthly: "", annual: "", region: "Oceania" },
  { key: "6", country: "IN", currency: "INR", monthly: "", annual: "", region: "Asia" },
  { key: "7", country: "CA", currency: "CAD", monthly: "", annual: "", region: "North America" },
  { key: "8", country: "ZA", currency: "ZAR", monthly: "", annual: "", region: "Africa" },
  { key: "9", country: "EU", currency: "EUR", monthly: "", annual: "", region: "Europe" },
  { key: "10", country: "Other", currency: "EUR", monthly: "", annual: "", region: "Other" },
];

const currencyOptions = ["USD", "GBP", "EUR", "AED", "AUD", "INR", "CAD", "ZAR"];

const Edit = ({ menuId, open, showEditMenu, refreshPlans }: any) => {
  const [form] = Form.useForm();
  const isNew = menuId === "";
  const [data, setData] = useState(initialData);
  const [featuresList, setFeaturesList] = useState<any[]>([]);
  const [checkedFeatures, setCheckedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    form.resetFields();
    setCheckedFeatures([]); 
    setData(initialData);
    showEditMenu("", false);
  };

  const fetchFeatures = async () => {
    try {
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const res = await fetch(`${TEST_API_URL}/api/v1/features`, {
        headers,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      setFeaturesList(json?.response || []);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchPlanById = async () => {
    try {
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const res = await fetch(`${TEST_API_URL}/api/v1/plans/${menuId}`, {
        headers,
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const plan = data;
      const limitTypeMap: Record<string, string> = {
  clients: "limitClients",
  users: "limitUsers",
  document: "limitDocument",
  bankstatement: "limitBankStatement",
  lineitem: "limitLineItem",
  supplierstatement: "limitSupplierStatement",
};
      const limitsMap: Record<string, number> = {};
      (plan.limits || []).forEach((limit: any) => {
        const key = limitTypeMap[limit.limitType.toLowerCase()];
  if (key) {
    limitsMap[key] = limit.limitValue;
  }
      });

      setCheckedFeatures((plan.features || []).map((f: any) => f.name));

      const updatedPricing = initialData.map((entry) => {
        const match = plan.countryPricing.find((item: any) => item.country === entry.country);
        return match
          ? {
              ...entry,
              monthly: match.monthlyPrice.toString(),
              annual: match.annualPrice.toString(),
              currency: match.currency,
            }
          : entry;
      });
      setData(updatedPricing);

      form.setFieldsValue({
        planName: plan.planName,
        clientType: plan.planType === "Individual" ? "practice" : "business",
        defaultcurrency: plan.defaultCurrency,
        defaultmonthly: plan.defaultMonthlyPrice.toString(),
        defaultannual: plan.defaultAnnualPrice.toString(),
        ...limitsMap,
      });
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  useEffect(() => {
    fetchFeatures();
    if (!isNew && open) {
      fetchPlanById();
    }
    if (isNew && open) {
      form.resetFields();
      setCheckedFeatures([]);
      setData(initialData);
    }
  }, [menuId, open]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      const headers = createAuthHeaders();
      
      if (!headers) {
        console.error("No valid authentication token available");
        message.error("Authentication token not available");
        return;
      }

      const limits = usageLimitFields.map((field) => ({
        limitType: field.name.replace("limit", "").toLowerCase(),
        limitValue: Number(values[field.name]),
      }));

      const countryPricing = data
        .filter((d) => d.monthly && d.annual)
        .map((d) => ({
          region: d.region,
          country: d.country,
          currency: d.currency,
          monthlyPrice: parseFloat(d.monthly),
          annualPrice: parseFloat(d.annual),
        }));

      const features = featuresList
  .filter((feature) => checkedFeatures.includes(feature.name))
  .map((feature) => ({
    featureId: feature.featureId || null,
    name: feature.name,
    description: feature.description || "",
  }));


      const payload = {
        planName: values.planName,
        planType: values.clientType === "practice" ? "Individual" : "Business",
        defaultCurrency: values.defaultcurrency,
        defaultMonthlyPrice: parseFloat(values.defaultmonthly),
        defaultAnnualPrice: parseFloat(values.defaultannual),
        createdBy: "admin@example.com",
        limits,
        countryPricing,
        features,
      };

      const url = isNew
        ? `${TEST_API_URL}/api/v1/plans/create`
        : `${TEST_API_URL}/api/v1/plans/edit/${menuId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API error");

      message.success(isNew ? "Plan created successfully" : "Plan updated successfully");
      refreshPlans();
      onClose();
    } catch (error) {
      console.error("Submit Error:", error);
      message.error("An error occurred while saving the plan");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (value: string, key: string) => {
    setData((prev) => prev.map((item) => (item.key === key ? { ...item, currency: value } : item)));
  };

  const columns = [
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (_: any, record: any) => (
        <Select value={record.currency} onChange={(val) => handleCurrencyChange(val, record.key)} style={{ width: "100%" }}>
          {currencyOptions.map((cur) => (
            <Option key={cur} value={cur}>
              {cur}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Monthly",
      dataIndex: "monthly",
      key: "monthly",
      render: (_: any, record: any) => (
        <Input
          value={record.monthly}
          onChange={(e) => setData((prev) => prev.map((item) => item.key === record.key ? { ...item, monthly: e.target.value } : item))}
        />
      ),
    },
    {
      title: "Annual",
      dataIndex: "annual",
      key: "annual",
      render: (_: any, record: any) => (
        <Input
          value={record.annual}
          onChange={(e) => setData((prev) => prev.map((item) => item.key === record.key ? { ...item, annual: e.target.value } : item))}
        />
      ),
    },
  ];

  return (
    <FormDrawer
      title={isNew ? "New Plan" : "Edit Plan"}
      open={open}
      onClose={onClose}
      width={1000}
      footer={
        <Button form="client-form" htmlType="submit" type="primary" loading={loading}>
          Submit
        </Button>
      }
      isFetching={false}
    >
      <Form
        form={form}
        layout="vertical"
        name="client-form"
        onFinish={onFinish}
        preserve={false}
        initialValues={{ clientType: "practice" }}
      >
        <Row gutter={16} className="mb-10">
          <Col span={12}>
            <Form.Item label="Client type" name="clientType" rules={[{ required: true, message: "Required" }]}>
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value="practice">Practice</Radio.Button>
                <Radio.Button value="business">Business</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Plan name" name="planName" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="Plan name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8} className="sectionRow mb-10">
          <div className="sectionTitle">
            <h5>Default Pricing</h5>
          </div>
          <Col span={6}>
            <Form.Item label="Default Currency" name="defaultcurrency" rules={[{ required: true, message: "Required" }]}>
              <Select
                showSearch
                placeholder="Default Currency"
                options={currencyOptions.map((c) => ({ value: c, label: c }))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Default Monthly Price" name="defaultmonthly" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="Default Monthly" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Default Annual Price" name="defaultannual" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="Default Annual" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8} className="sectionRow mb-10">
          <div className="sectionTitle">
            <h5>Country Wise Pricing</h5>
          </div>
          <Col span={24}>
            <Table className="planCountryTable" dataSource={data} columns={columns} pagination={false} bordered />
          </Col>
        </Row>

        <Row gutter={8} className="sectionRow mb-10">
          <div className="sectionTitle">
            <h5>Usage Limits</h5>
          </div>
          {usageLimitFields.map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item label={field.label} name={field.name} rules={[{ required: true, message: "Required" }]}>
                <Input placeholder={field.placeholder} />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="sectionRow mb-10">
          <div className="sectionTitle">
            <h5>Select Features</h5>
          </div>
          {featuresList.map((feature) => (
            <Col span={8} key={feature.featureId || feature.name}>
              <Card variant="borderless" hoverable>
                <Checkbox
                  checked={checkedFeatures.includes(feature.name)}
                  onChange={(e) => {
                    setCheckedFeatures((prev) =>
                      e.target.checked ? [...prev, feature.name] : prev.filter((f) => f !== feature.name)
                    );
                  }}
                >
                  {feature.name}
                </Checkbox>
              </Card>
            </Col>
          ))}
        </Row>

        
      </Form>
    </FormDrawer>
  );
};

export default Edit;
