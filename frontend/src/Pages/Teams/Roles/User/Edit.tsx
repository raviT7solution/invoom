import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
} from "antd";
import { useMemo } from "react";

import {
  useCities,
  useCountries,
  useProvinces,
  useRoles,
  useUser,
  useUserCreate,
  useUserUpdate,
} from "../../../../api";
import {
  DATE_FORMAT,
  datePickerGetValueFromEvent,
  datePickerGetValueProps,
} from "../../../../components/DatePicker";
import { FormDrawer } from "../../../../components/FormDrawer";
import { selectLabelFilterSort } from "../../../../helpers";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  address?: string;
  city?: string;
  country?: string;
  countryCode: string;
  email: string;
  employmentType: string;
  firstName: string;
  gender: string;
  lastName: string;
  maxHour: number;
  password: string;
  phoneNumber: string;
  pin: string;
  preferredName: string;
  province?: string;
  roleIds: string[];
  startDate: string;
  wage: number;
  zipCode?: string;
};

const initialValues = {
  maxHour: 0,
};

const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

const employmentTypes = [
  {
    label: "Salary Per Month",
    value: "salary",
  },
  {
    label: "Hourly",
    value: "hourly",
  },
];

export const UserEdit = ({
  id,
  open,
  showEdit,
}: {
  id: string;
  open: boolean;
  showEdit: (destroyed: boolean, id: string, open: boolean) => void;
}) => {
  const isNew = id === "";

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: roles } = useRoles({ restaurantId: restaurantId });
  const { data: user, isFetching: isUserFetching } = useUser(id);

  const { mutateAsync: userCreate, isPending: isCreating } = useUserCreate();
  const { mutateAsync: userUpdate, isPending: isUpdating } = useUserUpdate();

  const [form] = Form.useForm<schema>();
  const wage = Form.useWatch("wage", form) || 0;
  const employmentType = Form.useWatch("employmentType", form);
  const maxHour = Form.useWatch("maxHour", form) || 0;
  const country = Form.useWatch("country", form) || "";
  const province = Form.useWatch("province", form) || "";

  const { data: countries, isFetching: isCountryFetching } = useCountries();
  const { data: provinces, isFetching: isProvinceFetching } =
    useProvinces(country);
  const { data: cities, isFetching: isCityFetching } = useCities(
    country,
    province,
  );

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onFinish = async (values: schema) => {
    const attributes = { ...values };

    isNew
      ? await userCreate({
          input: { restaurantId: restaurantId, attributes: attributes },
        })
      : await userUpdate({ input: { attributes: attributes, id: id } });

    onClose();
  };

  const countyCodesOptions = useMemo(
    () =>
      [...new Set(countries.map((country) => country.code))].map((i) => ({
        label: `+${i}`,
        value: `+${i}`,
      })),
    [countries],
  );

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={
        <Button
          form="user-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isUserFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New User" : "Edit User"}
      width={720}
    >
      <Form
        form={form}
        initialValues={isNew ? initialValues : user}
        layout="vertical"
        name="user-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Last Name" />
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
              label="Preferred Name"
              name="preferredName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Preferred Name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={genders} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Phone"
              name="phoneNumber"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                addonBefore={
                  <Form.Item label="Country Code" name="countryCode" noStyle>
                    <Select
                      filterOption
                      filterSort={selectLabelFilterSort}
                      optionFilterProp="label"
                      options={countyCodesOptions}
                      placeholder="Select"
                      showSearch
                      style={{ width: 80 }}
                    />
                  </Form.Item>
                }
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Address details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="Country" name="country">
              <Select
                disabled={isCountryFetching}
                filterOption
                onChange={() =>
                  form.setFieldsValue({ province: undefined, city: undefined })
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
            <Form.Item label="Province" name="province">
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
            <Form.Item label="City" name="city">
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
            <Form.Item label="Address Line" name="address">
              <Input placeholder="Address Line" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Postal Code" name="zipCode">
              <Input placeholder="Postal Code" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Employment details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              getValueFromEvent={datePickerGetValueFromEvent}
              getValueProps={datePickerGetValueProps}
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Employment Type"
              name="employmentType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={employmentTypes} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Weekly Hour Restriction"
              name="maxHour"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                disabled={employmentType !== "hourly"}
                placeholder="Weekly Hour Restriction"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Wage"
              name="wage"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber placeholder="Wage" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col className="!flex items-center" span={8}>
            {employmentType && (
              <Tag className="w-full !text-center">
                {employmentType === "hourly"
                  ? `Weekly Wage: ${wage * maxHour}/week`
                  : employmentType === "salary"
                  ? `Daily Wage: ${wage / 30}/day`
                  : ""}
              </Tag>
            )}
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Security details
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: isNew, message: "Required" }]}
            >
              <Input placeholder="Password" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Pin"
              name="pin"
              rules={[{ required: isNew, message: "Required" }]}
            >
              <Input placeholder="Pin" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>
          Roles
        </Divider>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="Role"
              name="roleIds"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                mode="multiple"
                options={roles.map((r) => ({ label: r.name, value: r.id }))}
                placeholder="Select"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};
