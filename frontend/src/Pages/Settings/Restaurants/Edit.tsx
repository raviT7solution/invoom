import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  notification,
} from "antd";

import {
  useCities,
  useCountries,
  useProvinces,
  useRestaurant,
  useRestaurantCreate,
  useRestaurantUpdate,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import {
  PhoneNumber,
  phoneNumberGetValueFromEvent,
  phoneNumberValidator,
} from "../../../components/PhoneNumber";
import {
  tzTimePickerGetValueFromEvent,
  tzTimePickerGetValueProps,
  TIME_FORMAT,
} from "../../../helpers/dateTime";

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
  taxpayerId: string;
  timezone: string;
  website: string;
};

const restaurantTypes = [
  {
    title: "Full service restaurant",
    description:
      "Turn more tables, upsell with ease, and streamline service with a powerful system built for FSRs.",
  },
  {
    title: "Family style",
    description:
      "Turn more tables and delight guests with a POS built for family style restaurants.",
  },
  {
    title: "Fine dining",
    description:
      "Deliver elevated experiences and exceptional service with a seamless POS platform.",
  },
  {
    title: "Quick service restaurant",
    description:
      "Reach more customers and keep them coming back with a POS built to run at QSR speed.",
  },
  {
    title: "Fast casual",
    description:
      "Deliver quality and convenience at speed with the POS built for fast casual needs.",
  },
  {
    title: "Coffee shop",
    description:
      "Keep lines moving and drive repeat business with an intuitive POS made for coffee shops.",
  },
  {
    title: "Cafe",
    description:
      "Conquer the rush, maximize margins, and boost loyalty with a powerful cafe POS.",
  },
  {
    title: "Food truck",
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
    title: "Bar & club",
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
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (destroyed: boolean, id: string, open: boolean) => void;
}) => {
  const isNew = id === "";

  const [form] = Form.useForm<schema>();
  const country = Form.useWatch("country", form) || "";
  const province = Form.useWatch("province", form) || "";
  const tz = Form.useWatch("timezone", form);

  const restaurant = useRestaurant(id);

  const { data: countries, isFetching: isCountryFetching } = useCountries();
  const { data: provinces, isFetching: isProvinceFetching } =
    useProvinces(country);
  const { data: cities, isFetching: isCityFetching } = useCities(
    country,
    province,
  );

  const restaurantCreate = useRestaurantCreate();
  const restaurantUpdate = useRestaurantUpdate();

  const timezones = countries.find((item) => item.alpha2 === country)
    ?.timezones;

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onFinish = async (values: schema) => {
    if (isNew) {
      await restaurantCreate.mutateAsync({ input: { attributes: values } });

      notification.success({
        message: "Your request has been submitted",
        description: "Our Team will get in touch with you!",
      });
    } else {
      await restaurantUpdate.mutateAsync({
        input: { id: id, attributes: values },
      });
    }

    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={
        <Button
          form="restaurant-form"
          htmlType="submit"
          loading={restaurantCreate.isPending || restaurantUpdate.isPending}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={restaurant.isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "Add restaurant" : "Edit restaurant"}
      width={900}
    >
      <Form
        form={form}
        initialValues={restaurant.data}
        layout="vertical"
        name="restaurant-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Form.Item
          label="Restaurant type"
          name="restaurantType"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            optionRender={(i) => (
              <>
                <b>{i.data.label}</b>
                <br />
                {i.data.description}
              </>
            )}
            options={restaurantTypes.map((i) => ({
              description: i.description,
              label: i.title,
              value: i.title,
            }))}
            placeholder="Select"
            showSearch
          />
        </Form.Item>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Restaurant name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Restaurant name" />
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
              getValueFromEvent={phoneNumberGetValueFromEvent}
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Required" },
                { validator: phoneNumberValidator },
              ]}
            >
              <PhoneNumber />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Operational since"
              name="operationalSince"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={since} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Taxpayer identification number" name="taxpayerId">
              <Input placeholder="eg. 123456789" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Website" name="website">
              <Input placeholder="example.com" />
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
              label="Postal code"
              name="postalCode"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Postal code" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Hours
        </Divider>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              getValueFromEvent={(_, v) => tzTimePickerGetValueFromEvent(v, tz)}
              getValueProps={(v) => tzTimePickerGetValueProps(v, tz)}
              label="Business start time"
              name="businessStartTime"
            >
              <TimePicker
                disabled={!tz}
                format={TIME_FORMAT}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              getValueFromEvent={(_, v) => tzTimePickerGetValueFromEvent(v, tz)}
              getValueProps={(v) => tzTimePickerGetValueProps(v, tz)}
              label="Business end time"
              name="businessEndTime"
            >
              <TimePicker
                disabled={!tz}
                format={TIME_FORMAT}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              getValueFromEvent={(_, v) => tzTimePickerGetValueFromEvent(v, tz)}
              getValueProps={(v) => tzTimePickerGetValueProps(v, tz)}
              label="Break start time"
              name="breakStartTime"
            >
              <TimePicker
                disabled={!tz}
                format={TIME_FORMAT}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              getValueFromEvent={(_, v) => tzTimePickerGetValueFromEvent(v, tz)}
              getValueProps={(v) => tzTimePickerGetValueProps(v, tz)}
              label="Break end time"
              name="breakEndTime"
            >
              <TimePicker
                disabled={!tz}
                format={TIME_FORMAT}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};
