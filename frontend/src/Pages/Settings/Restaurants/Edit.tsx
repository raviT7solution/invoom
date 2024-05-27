import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Select,
  Steps,
  TimePicker,
  notification,
} from "antd";
import { useEffect } from "react";

import {
  useCities,
  useCountries,
  useProvinces,
  useRestaurantCreate,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { classNames } from "../../../helpers";
import { useSteps } from "../../../helpers/hooks";

type schema = {
  address: string;
  breakEndTime: string;
  breakStartTime: string;
  businessEndTime: string;
  businessStartTime: string;
  city: string;
  country: string;
  email: string;
  name: string;
  operationalSince: string;
  phoneNumber: string;
  postalCode: string;
  province: string;
  restaurantType: string;
  timezone: string;
};

const restaurantTypes = [
  {
    title: "Full Service Restaurant",
    description:
      "Turn more tables, upsell with ease, and streamline service with a powerful system built for FSRs.",
  },
  {
    title: "Family style",
    description:
      "Turn more tables and delight guests with a POS built for family style restaurants.",
  },
  {
    title: "Fine Dining",
    description:
      "Deliver elevated experiences and exceptional service with a seamless POS platform.",
  },
  {
    title: "Quick Service Restaurant",
    description:
      "Reach more customers and keep them coming back with a POS built to run at QSR speed.",
  },
  {
    title: "Fast Casual",
    description:
      "Deliver quality and convenience at speed with the POS built for fast casual needs.",
  },
  {
    title: "Coffee Shop",
    description:
      "Keep lines moving and drive repeat business with an intuitive POS made for coffee shops.",
  },
  {
    title: "Cafe",
    description:
      "Conquer the rush, maximize margins, and boost loyalty with a powerful cafe POS.",
  },
  {
    title: "Food Truck",
    description:
      "Turn long lines into large profits with a fast and reliable POS for food trucks",
  },
  {
    title: "Brewery",
    description:
      "Increase beer sales and reduce spillage with an intuitive POS breweries love.",
  },
  {
    title: "Winery",
    description:
      "Manage your dining room and your wine shop with the all-in-one solution wineries prefer.",
  },
  {
    title: "Bar & Club",
    description:
      "Serve drinks faster and sell more top-shelf upgrades with the POS built for bars.",
  },
  {
    title: "Catering",
    description:
      "Execute large orders on tight deadlines with an intuitive platform built with catering in mind.",
  },
  {
    title: "Bakery",
    description:
      "Sell more treats in less time and streamline operations with the POS bakeries love.",
  },
];

const since = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i,
).map((p) => ({
  label: p,
  value: p.toString(),
}));

export const Edit = ({
  open,
  showEditRestaurant,
}: {
  open: boolean;
  showEditRestaurant: (open: boolean) => void;
}) => {
  const [form] = Form.useForm<schema>();
  const country = Form.useWatch("country", form) || "";
  const province = Form.useWatch("province", form) || "";
  const restaurantType = Form.useWatch("restaurantType", form) || "";

  const { mutateAsync: restaurantCreate, isPending: isCreating } =
    useRestaurantCreate();
  const { data: countries, isFetching: isCountryFetching } = useCountries();
  const { data: provinces, isFetching: isProvinceFetching } =
    useProvinces(country);
  const { data: cities, isFetching: isCityFetching } = useCities(
    country,
    province,
  );

  const { current, next, reset, showNext, showSubmit } = useSteps(2);

  const timezones = countries.find((item) => item.alpha2 === country)
    ?.timezones;

  const handleNext = () => {
    if (restaurantType) {
      next();

      return;
    }

    notification.error({
      message: "Select Restaurant Type",
    });
  };

  const onClose = () => showEditRestaurant(false);

  const onFinish = async (values: schema) => {
    await restaurantCreate({ input: { attributes: values } });

    notification.success({
      message: "Your request has been submitted",
      description: "Our Team will get in touch with you!",
    });

    onClose();
  };

  useEffect(() => {
    form.resetFields();
    reset();
  }, [open, reset, form]);

  return (
    <FormDrawer
      footer={
        <>
          {showSubmit && (
            <Button
              form="restaurant-form"
              htmlType="submit"
              loading={isCreating}
              type="primary"
            >
              Submit
            </Button>
          )}

          {showNext && (
            <Button onClick={handleNext} type="primary">
              Next
            </Button>
          )}
        </>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title="Add Restaurant"
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        name="restaurant-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item hidden name="restaurantType">
          <Input />
        </Form.Item>

        <div className="w-full px-24 pb-4">
          <Steps
            current={current}
            items={[
              {
                title: "Restaurant Type",
              },
              {
                title: "Basic Information",
              },
            ]}
          />
        </div>

        <div className={classNames(current === 0 ? "" : "hidden")}>
          <List
            dataSource={restaurantTypes}
            grid={{ column: 2, gutter: 16 }}
            renderItem={(item, index) => (
              <List.Item>
                <div
                  className={classNames(
                    "border p-4 rounded-lg",
                    item.title === restaurantType ? "border-green-400" : "",
                  )}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                        />
                        <Checkbox
                          checked={item.title === restaurantType}
                          onChange={() => {
                            form.setFieldsValue({
                              restaurantType: item.title,
                            });
                          }}
                        />
                      </div>
                    }
                    description={item.description}
                    title={item.title}
                  />
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className={classNames(current === 1 ? "" : "hidden")}>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                label="Restaurant Name"
                name="name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Restaurant Name" />
              </Form.Item>
            </Col>

            <Col span={8}>
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

            <Col span={8}>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Operational Since"
                name="operationalSince"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select options={since} placeholder="Select" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            Address details
          </Divider>

          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  disabled={isCountryFetching}
                  filterOption
                  onChange={() =>
                    form.setFieldsValue({
                      city: undefined,
                      province: undefined,
                      timezone: undefined,
                    })
                  }
                  optionFilterProp="label"
                  options={countries.map((i) => ({
                    label: i.name,
                    value: i.alpha2,
                  }))}
                  placeholder="Select"
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Province"
                name="province"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  disabled={isProvinceFetching}
                  filterOption
                  onChange={() => form.setFieldsValue({ city: undefined })}
                  optionFilterProp="label"
                  options={provinces.map((i) => ({
                    label: i.name,
                    value: i.code,
                  }))}
                  placeholder="Select"
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  disabled={isCityFetching}
                  filterOption
                  optionFilterProp="label"
                  options={cities.map((i) => ({
                    label: i.name,
                    value: i.name,
                  }))}
                  placeholder="Select"
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Timezone"
                name="timezone"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  disabled={isCountryFetching}
                  filterOption
                  optionFilterProp="label"
                  options={timezones?.map((i) => ({
                    label: `${i.identifier} (UTC ${i.humanizeOffset})`,
                    value: i.identifier,
                  }))}
                  placeholder="Select"
                  showSearch
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Postal Code" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            Hours
          </Divider>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Business Start Time" name="businessStartTime">
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Business End Time" name="businessEndTime">
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Break Start Time" name="breakStartTime">
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Break End Time" name="breakEndTime">
                <TimePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </FormDrawer>
  );
};
