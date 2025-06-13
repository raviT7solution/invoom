import { Navbar } from "../../components/Navbar";
import { Button, Typography, Card, Row, Col, Radio } from "antd";
import Edit from "./Edit";
import { useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const features = [
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

const plans = [
  {
    name: 'Free Forever',
    monthly: '$0/mo.',
    annual: '$0/yr.',
    features: [true, true, true, false, true, true, true, true, true, false, false, false, false, false],
  },
  {
    name: 'Pro',
    monthly: '$8/mo.',
    annual: '$80/yr.',
    features: [true, true, true, true, true, true, true, true, true, true, false, false, false, false],
  },
  {
    name: 'Premium',
    monthly: '$20/mo.',
    annual: '$200/yr.',
    features: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
  },
];

const getIcon = (val: boolean | string) => {
  if (typeof val === 'boolean') {
    return val ? (
      <CheckCircleOutlined style={{ color: 'green', fontSize: 18 }} />
    ) : (
      <CloseCircleOutlined style={{ color: 'red', fontSize: 18 }} />
    );
  } else {
    return <Text>{val}</Text>;
  }
};

const Plan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [clientType, setClientType] = useState<'practice' | 'business'>('practice');

  const showEditMenu = (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Plan" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
      />

      <div className="mb-4 flex">
        <Typography.Title level={4}>All Plan</Typography.Title>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button onClick={() => showEditMenu("", true)} type="primary">
            Add Plan
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white">
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Radio.Group
            onChange={(e) => setClientType(e.target.value)}
            value={clientType}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="practice" style={{ fontSize: '16px' }}>
              Practice Type
            </Radio.Button>
            <Radio.Button value="business" style={{ fontSize: '16px' }}>
              Business Type
            </Radio.Button>
          </Radio.Group>
        </div>

        <Card bordered={false} style={{ borderRadius: 10 }}>
          {/* Header Row */}
          <Row gutter={16} className="header-row">
            <Col span={6}>
              <div className="plan-title">Compare our plans</div>
            </Col>
            {plans.map((plan, i) => (
              <Col span={6} key={i} className="plan-col">
                <div>
                  <Text strong className="plan-name">{plan.name}</Text>
                </div>
                <div className="plan-monthly">{plan.monthly}</div>
                <div className="plan-annual">{plan.annual}</div>
              </Col>
            ))}
          </Row>

          {/* Feature Rows */}
          {features.map((feature, index) => (
            <Row
              key={index}
              gutter={16}
              style={{
                padding: '12px 0',
                borderTop: '1px solid #f0f0f0',
                alignItems: 'center',
              }}
            >
              <Col span={6}>
                <Text>{feature}</Text>
              </Col>
              {plans.map((plan, idx) => (
                <Col span={6} key={idx} style={{ textAlign: 'center' }}>
                  {getIcon(plan.features[index])}
                </Col>
              ))}
            </Row>
          ))}
        </Card>
      </div>
    </Navbar>
  );
};

export default Plan;
