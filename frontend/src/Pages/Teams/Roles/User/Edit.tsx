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

import { FormDrawer } from "../../../../components/FormDrawer";
// import {
//   PhoneNumber,
//   phoneNumberGetValueFromEvent,
//   phoneNumberValidator,
// } from "../../../../components/PhoneNumber";
import {
  DATE_FORMAT,
  datePickerGetValueFromEvent,
  datePickerGetValueProps,
} from "../../../../helpers/dateTime";
import { useRestaurantIdStore } from "../../../../stores/useRestaurantIdStore";

type schema = {
  address?: string;
  city?: string;
  country?: string;
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
    label: "Salary per month",
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

  const [form] = Form.useForm<schema>();
  const wage = Form.useWatch("wage", form) || 0;
  const employmentType = Form.useWatch("employmentType", form);
  const maxHour = Form.useWatch("maxHour", form) || 0;
  const country = Form.useWatch("country", form) || "";
  const province = Form.useWatch("province", form) || "";

  // const cities = useCities(country, province);
  // const countries = useCountries();
  // const provinces = useProvinces(country);
  // const roles = useRoles({ restaurantId: restaurantId });
  // const user = useUser(id);

  // const userCreate = useUserCreate();
  // const userUpdate = useUserUpdate();

  const onClose = () => showEdit(false, "", false);
  const afterClose = () => showEdit(true, "", false);

  const onFinish = async (attributes: schema) => {
    // isNew
    //   ? await userCreate.mutateAsync({
    //       input: { restaurantId: restaurantId, attributes: attributes },
    //     })
    //   : await userUpdate.mutateAsync({
    //       input: { attributes: attributes, id: id },
    //     });

    onClose();
  };

  return (
    <FormDrawer
      afterClose={afterClose}
      footer={
        <Button
          form="user-form"
          htmlType="submit"
          // loading={userCreate.isPending || userUpdate.isPending}
          type="primary"
        >
          Submit
        </Button>
      }
      // isFetching={user.isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New user" : "Edit user"}
      width={720}
    >
      <Form
        form={form}
        // initialValues={isNew ? initialValues : user.data}
        layout="vertical"
        name="user-form"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Last name" />
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
              label="Preferred name"
              name="preferredName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Preferred name" />
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
              getValueFromEvent={phoneNumberGetValueFromEvent}
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Required" },
                { validator: phoneNumberValidator },
              ]}
            >
              {/* <PhoneNumber /> */}
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
                disabled={countries.isFetching}
                onChange={() =>
                  form.setFieldsValue({ province: undefined, city: undefined })
                }
                optionFilterProp="label"
                options={countries.data.map((i) => ({
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
                disabled={provinces.isFetching}
                onChange={() => form.setFieldsValue({ city: undefined })}
                optionFilterProp="label"
                options={provinces.data.map((i) => ({
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
                disabled={cities.isFetching}
                optionFilterProp="label"
                options={cities.data.map((i) => ({
                  label: i.name,
                  value: i.name,
                }))}
                placeholder="Select"
                showSearch
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Address line" name="address">
              <Input placeholder="Address line" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Postal code" name="zipCode">
              <Input placeholder="Postal code" />
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
              label="Start date"
              name="startDate"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker format={DATE_FORMAT} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Employment type"
              name="employmentType"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={employmentTypes} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Weekly hour restriction"
              name="maxHour"
              rules={[
                { required: true, message: "Required" },
                { type: "number", min: 0, message: "Must be non-negative" },
              ]}
            >
              <InputNumber
                disabled={employmentType !== "hourly"}
                placeholder="Weekly hour restriction"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Wage"
              name="wage"
              rules={[
                { required: true, message: "Required" },
                { type: "number", min: 0, message: "Must be non-negative" },
              ]}
            >
              <InputNumber placeholder="Wage" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col className="!flex items-center" span={8}>
            {employmentType && (
              <Tag className="w-full !text-center">
                {employmentType === "hourly"
                  ? `Weekly wage: ${wage * maxHour}/week`
                  : employmentType === "salary"
                  ? `Daily wage: ${(wage / 30).toFixed(2)}/day`
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
                optionFilterProp="label"
                options={roles.data.map((r) => ({
                  label: r.name,
                  value: r.id,
                }))}
                placeholder="Select"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};
