import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Radio,
  message,
} from "antd";

import { TEST_API_URL } from "../../utils/Constant";
import { createAuthHeaders } from "../../helpers";
import axios from "axios";
import { Navbar } from "../../components/Navbar";
import Edit from "./Edit";
import { PlanTableView } from "./PlanTableView";



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
  const [type, setType] = useState("");
    const showEditMenu = async (id: string, open: boolean,type:string) => {
    setSelectedMenuId(id);
    setIsModalOpen(open);
    setType(type);
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
    const scrollContainer = document.querySelector(
      ".nested-scroll-overflow-y-scroll",
    );
    const header = document.querySelector(".headPlanModule");

    if (!scrollContainer || !header) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 10) {
        header.classList.add("sticky-shadow");
      } else {
        header.classList.remove("sticky-shadow");
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchFeatureData();
  }, []);

  useEffect(() => {
    if (featuresList.length > 0) fetchPlans();
  }, [featuresList]);

  const filteredPlans = plans.filter((p) => p.clientTypes.includes(clientType));

  // Map filteredPlans to the shape expected by PlanTableView
  const tablePlans = filteredPlans.map((p) => ({
    planId: p.id,
    planName: p.name,
    clientType: p.clientTypes[0],
    currency: selectedCurrency,
    monthly: p.monthly,
    annual: p.annual,
  }));

  return (
    <div className="planModule">
      <Navbar breadcrumbItems={[{ title: "Plan" }]}>
        <Edit
          menuId={selectedMenuId}
          open={isModalOpen}
          showEditMenu={showEditMenu}
          refreshPlans={fetchPlans}
          defaultData={defaultPlanData}
          type={type}
        />

        <Card>
          <div style={{ textAlign: "left"}}>
            <div className="flex flex-1 items-center justify-between gap-2">
              <Radio.Group
                onChange={(e) => setClientType(e.target.value)}
                value={clientType}
                optionType="button"
                buttonStyle="solid"
                className="custom-radio-button"
              >
                <Radio.Button value="practice" style={{ fontSize: "16px" }}>
                  Practice Type
                </Radio.Button>
                <Radio.Button value="business" style={{ fontSize: "16px" }}>
                  Business Type
                </Radio.Button>
              </Radio.Group>
              <Button onClick={() => showEditMenu("", true,"add")} type="primary">
                Add Plan
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <PlanTableView
              plans={tablePlans}
                onEdit={(planId) => showEditMenu(planId, true,"edit")}
              onDelete={handleDeletePlan}
              onView={(planId) => showEditMenu(planId, true,"view")}
            />
          </div>
        </Card>
      </Navbar>
    </div>
  );
};

export default Plan;
