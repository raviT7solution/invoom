import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Radio,
  Space,
  message,
  Dropdown,
  MenuProps,
} from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { TEST_API_URL } from "../../utils/Constant";
import { createAuthHeaders } from "../../helpers";
import axios from "axios";
import { Navbar } from "../../components/Navbar";
import Edit from "./Edit";

const { Text } = Typography;

const currencySymbols: Record<string, string> = {
  Default: "$",
  USD: "$",
  INR: "\u20B9",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

const getIcon = (val: boolean) =>
  val ? (
    <CheckCircleOutlined style={{ color: "green", fontSize: 18 }} />
  ) : (
    <CloseCircleOutlined style={{ color: "red", fontSize: 18 }} />
  );

interface PlanType {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  clientTypes: string[];
  limits: { limitType: string; limitValue: string }[];
  features: boolean[];
}

const Plan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [defaultPlanData, setDefaultPlanData] = useState<any>(null);
  const [clientType, setClientType] = useState("business");
  const [selectedCurrency] = useState("USD");
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [featuresList, setFeaturesList] = useState<string[]>([]);

  const showEditMenu = async (id: string, open: boolean) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);

    if (id && open) {
      try {
        const headers = createAuthHeaders();

        if (!headers) {
          console.error("No valid authentication token available");
          message.error("Authentication token not available");
          return;
        }

        const res = await axios.get(`${TEST_API_URL}/api/v1/plans/${id}`, {
          headers,
        });
        setDefaultPlanData(res.data.response);
      } catch (err) {
        console.error("Error loading plan", err);
        message.error("Failed to load plan");
      }
    } else {
      setDefaultPlanData(null);
    }
  };

  const fetchFeatureData = async () => {
    try {
      const headers = createAuthHeaders();

      if (!headers) {
        console.error("No valid authentication token available");
        return;
      }

      const response = await fetch(`${TEST_API_URL}/api/v1/features`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const featureNames = json?.response?.map((f: any) => f.name.trim()) || [];
      setFeaturesList(featureNames);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const headers = createAuthHeaders();

      if (!headers) {
        console.error("No valid authentication token available");
        message.error("Authentication token not available");
        return;
      }

      const res = await axios.get(`${TEST_API_URL}/api/v1/plans/active`, {
        headers,
      });

      const raw = res.data.response;
      const allPlans = Array.isArray(raw) ? raw : [raw];

      const mapped = allPlans.map((plan) => {
        const featureNames = plan.features.map((f: any) => f.name.trim());
        const featureMatches = featuresList.map((featureName) =>
          featureNames.some(
            (planFeature: string) =>
              featureName.toLowerCase().includes(planFeature.toLowerCase()) ||
              planFeature.toLowerCase().includes(featureName.toLowerCase()),
          ),
        );

        return {
          id: plan.planId,
          name: plan.planName,
          monthly: plan.defaultMonthlyPrice,
          annual: plan.defaultAnnualPrice,
          clientTypes: [plan.planType === "Business" ? "business" : "practice"],
          limits: plan.limits || [],
          features: featureMatches,
        };
      });

      setPlans(mapped);
    } catch (err) {
      console.error("Error fetching plans", err);
      message.error("Failed to fetch plans");
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const headers = createAuthHeaders();

      if (!headers) {
        console.error("No valid authentication token available");
        message.error("Authentication token not available");
        return;
      }

      await axios.delete(`${TEST_API_URL}/api/v1/plans/delete/${id}`, {
        headers,
      });
      message.success("Plan deleted successfully");
      fetchPlans();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete plan");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchFeatureData();
    };
    init();
  }, []);

  useEffect(() => {
    if (featuresList.length > 0) {
      fetchPlans();
    }
  }, [featuresList]);

  const filteredPlans = plans.filter((p) => p.clientTypes.includes(clientType));

  return (
    <Navbar breadcrumbItems={[{ title: "Plan" }]}>
      <Edit
        menuId={selectedMenuId}
        open={isModalOpen}
        showEditMenu={showEditMenu}
        refreshPlans={fetchPlans}
        defaultData={defaultPlanData}
      />

      <div className="mb-4 flex">
        <Typography.Title level={4}>All Plans</Typography.Title>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button onClick={() => showEditMenu("", true)} type="primary">
            Add Plan
          </Button>
        </div>
      </div>

      <div className="bg-white py-6">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Radio.Group
            onChange={(e) => setClientType(e.target.value)}
            value={clientType}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="practice" style={{ fontSize: "16px" }}>
              Practice Type
            </Radio.Button>
            <Radio.Button value="business" style={{ fontSize: "16px" }}>
              Business Type
            </Radio.Button>
          </Radio.Group>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 5,
          }}
        >
          {/* <div style={{ width: 180 }}>
            <Form.Item
              label="Default Currency"
              name="defaultcurrency"
              style={{ margin: 0 }}
            >
              <Select
                showSearch
                value={selectedCurrency}
                onChange={(value) => setSelectedCurrency(value)}
                options={Object.keys(currencySymbols).map((cur) => ({
                  value: cur,
                  label: cur,
                }))}
              />
            </Form.Item>
          </div> */}
        </div>

        <Card
          variant="borderless"
          className="plan_main_div"
          style={{ 
            borderRadius: 10,
            overflowX: 'auto'
          }}
          bodyStyle={{ 
            overflowX: 'auto',
            minWidth: 'max-content'
          }}
        >
          <Row gutter={16} className="header-row">
            <Col span={6} className="centerDiv">
              <div className="plan-title">Compare our plans</div>
            </Col>
            {filteredPlans.map((plan, i) => {
              const items: MenuProps["items"] = [
                {
                  key: "edit",
                  label: "Edit",
                  icon: <EditOutlined />,
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ];

              const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
                if (key === "edit") {
                  showEditMenu(plan.id, true);
                }

                if (key === "delete") {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeletePlan(plan.id);
                      Swal.fire(
                        "Deleted!",
                        "Plan has been deleted.",
                        "success",
                      );
                    }
                  });
                }
              };

              return (
                <Col span={6} key={i} className="plan-col">
                  <div className="dotAction">
                    <Dropdown
                      menu={{ items, onClick: handleMenuClick }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <EllipsisOutlined
                            style={{
                              transform: "rotate(90deg)",
                              fontSize: 20,
                              cursor: "pointer",
                              color: "#000",
                              fontWeight: "bold",
                            }}
                          />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>

                  <div className="plan-name">
                    <Text strong>{plan.name}</Text>
                  </div>
                  <div className="plan-monthly">
                    {currencySymbols[selectedCurrency]}
                    {plan.monthly} <span>/Per Month</span>
                  </div>
                  <div className="plan-annual">
                    {currencySymbols[selectedCurrency]}
                    {plan.annual} <span>/Per Annual</span>
                  </div>
                  <ul className="listLimit">
                    {plan.limits.map((limit, index) => (
                      <li key={index}>
                        <CheckOutlined /> Limit {limit.limitType} :{" "}
                        {limit.limitValue}
                      </li>
                    ))}
                  </ul>
                </Col>
              );
            })}
          </Row>

          {featuresList.map((feature, index) => (
            <Row
              key={index}
              gutter={16}
              style={{
                padding: "12px 0",
                borderTop: "1px solid #f0f0f0",
                alignItems: "center",
              }}
            >
              <Col span={6}>
                <Text>{feature}</Text>
              </Col>
              {filteredPlans.map((plan, i) => (
                <Col span={6} key={i} style={{ textAlign: "center" }}>
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
