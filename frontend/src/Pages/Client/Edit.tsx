import { Button, Col, Form, Input, Radio, Row, Select } from "antd";
import { FormDrawer } from "../../components/FormDrawer";

// import { useMenu, useMenuCreate, useMenuUpdate } from "../../../api";
// import { FormDrawer } from "../../../components/FormDrawer";
// import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  description: string;
  name: string;
  visible: boolean;
};

const initialValues = { description: "", visible: true };

export const Edit = ({
  menuId,
  open,
  showEditMenu,
}: {
  menuId: string;
  open: boolean;
  showEditMenu: (id: string, open: boolean) => void;
}) => {
  const isNew = menuId === "";
  const menu =
    {
      id: "1",
      name: "Breakfast Menu",
      description: "Delicious breakfast items to start your day.",
      visible: true,
    };


  // const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  // const { data: menu, isFetching } = useMenu(menuId);
  // const { mutateAsync: menuCreate, isPending: isCreating } = useMenuCreate();
  // const { mutateAsync: menuUpdate, isPending: isUpdating } = useMenuUpdate();

  const onFinish = async (values: schema) => {
    // isNew
    //   ? await menuCreate({
    //       input: { restaurantId: restaurantId, attributes: values },
    //     })
    //   : await menuUpdate({ input: { attributes: values, id: menuId } });

    onClose();
  };

  const onClose = () => showEditMenu("", false);

  return (
    <FormDrawer
      footer={
        <Button
          form="client-form"
          htmlType="submit"
          // loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={false}
      onClose={onClose}
      open={open}
      title={isNew ? "New client" : "Edit client"}
      width={1000}
    >
      <Form
        // form={form}
        // initialValues={isNew ? initialValues : user.data}
        layout="vertical"
        name="user-form"
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
              label="Password"
              name="password"
              rules={[{ required: isNew, message: "Required" }]}
            >
              <Input placeholder="Password" />
            </Form.Item>
          </Col>




        </Row>


        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              // getValueFromEvent={phoneNumberGetValueFromEvent}
              label="Phone number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Required" },
                // { validator: phoneNumberValidator },
              ]}
            >
               <Input placeholder="Phone number" />
              {/* <PhoneNumber /> */}
            </Form.Item>
          </Col>

        <Col span={6}>
            <Form.Item label="Address line" name="address">
              <Input placeholder="Address line" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Country" name="country">
              <Select
                // disabled={countries.isFetching}
                // onChange={() =>
                //   form.setFieldsValue({ province: undefined, city: undefined })
                // }
                optionFilterProp="label"
                // options={countries.data.map((i) => ({
                //   label: i.name,
                //   value: i.alpha2,
                // }))}
                placeholder="Select"
                showSearch
              />
            </Form.Item>
          </Col>

          <Col span={6}>
          <Form.Item
          label="Client type"
          name="discountOn"
          rules={[{ required: true, message: "Required" }]}
        >
          <Radio.Group
            // onChange={() =>
              // form.setFieldsValue({ categoryIds: [], itemIds: [] })
            // }
            options={[
              { label: "Practice", value: "bill_wise" },
              { label: "Business", value: "item_wise" },
            ]}
          />
        </Form.Item>
        </Col>
        </Row>

        <Row gutter={8}>
        <Col span={6}>
            <Form.Item label="Practice Name" name="zipCode">
              <Input placeholder="Practice Name" />
            </Form.Item>
          </Col>
      </Row>
      </Form>
    </FormDrawer>
  );
};
