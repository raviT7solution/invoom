import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useEffect } from "react";

import {
  useInventoryCategories,
  useItemCodeGenerate,
  useProduct,
  useProductCreate,
  useProductUpdate,
  useSettingsTaxes,
} from "../../../api";
import { FormDrawer } from "../../../components/FormDrawer";
import { useRestaurantIdStore } from "../../../stores/useRestaurantIdStore";

type schema = {
  description: string;
  inventoryCategoryId: string;
  itemCode: string;
  name: string;
  price: number;
  reorderPoint: number;
  stockLimit: number;
  taxId: string;
  uom: string;
  visible: boolean;
  weight: number;
};

const initialValues = {
  price: 0,
  reorderPoint: 0,
  stockLimit: 0,
  visible: true,
  weight: 0,
};

const UOM = [
  {
    label: "Tonne",
    value: "tonne",
  },
  {
    label: "Kilograms",
    value: "kilograms",
  },
  {
    label: "Grams",
    value: "grams",
  },
  {
    label: "Decagram",
    value: "decagram",
  },
  {
    label: "Decigram",
    value: "decigram",
  },
  {
    label: "Centigram",
    value: "centigram",
  },
  {
    label: "Milligram",
    value: "milligram",
  },
  {
    label: "Kilolitre",
    value: "kilolitre",
  },
  {
    label: "Hectolitre",
    value: "hectolitre",
  },
  {
    label: "Decalitre",
    value: "decalitre",
  },
  {
    label: "Litre",
    value: "litre",
  },
  {
    label: "Decilitre",
    value: "decilitre",
  },
  {
    label: "Centilitre",
    value: "centilitre",
  },
  {
    label: "Millilitre",
    value: "millilitre",
  },
  {
    label: "Pound",
    value: "pound",
  },
  {
    label: "Ounce",
    value: "ounce",
  },
  {
    label: "Grain",
    value: "grain",
  },
  {
    label: "Item",
    value: "item",
  },
];

export const Edit = ({
  open,
  productId,
  showEditProduct,
}: {
  open: boolean;
  productId: string;
  showEditProduct: (id: string, open: boolean) => void;
}) => {
  const isNew = productId === "";

  const [form] = Form.useForm<schema>();

  const restaurantId = useRestaurantIdStore((s) => s.restaurantId);

  const { data: categories } = useInventoryCategories(restaurantId);
  const { data: taxes } = useSettingsTaxes(restaurantId);
  const { data: product, isFetching } = useProduct(productId);

  const { mutateAsync: itemCodeGenerate } = useItemCodeGenerate();
  const { mutateAsync: productCreate, isPending: isCreating } =
    useProductCreate();
  const { mutateAsync: productUpdate, isPending: isUpdating } =
    useProductUpdate();

  const onGenerateBarcode = async () => {
    const itemCode = (
      await itemCodeGenerate({
        input: { restaurantId: restaurantId },
      })
    ).itemCodeGenerate;

    form.setFieldsValue({ itemCode });
  };

  const onClose = () => showEditProduct("", false);

  const onSave = async (values: schema) => {
    isNew
      ? await productCreate({
          input: { restaurantId: restaurantId, attributes: values },
        })
      : await productUpdate({
          input: { attributes: values, id: productId },
        });

    onClose();
  };

  useEffect(() => form.resetFields(), [isNew, productId, form]);

  return (
    <FormDrawer
      footer={
        <Button
          form="product-form"
          htmlType="submit"
          loading={isCreating || isUpdating}
          type="primary"
        >
          Submit
        </Button>
      }
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title={isNew ? "New Product" : "Edit Product"}
      width={720}
    >
      <Form
        form={form}
        initialValues={isNew ? initialValues : product}
        layout="vertical"
        name="product-form"
        onFinish={onSave}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Product Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Itemcode / Barcode"
              name="itemCode"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                addonAfter={
                  <Button
                    disabled={!isNew}
                    icon={<ReloadOutlined />}
                    onClick={onGenerateBarcode}
                    size="small"
                    type="text"
                  />
                }
                disabled={!isNew}
                placeholder="ItemCode"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Category"
              name="inventoryCategoryId"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                options={categories.map((i) => ({
                  label: i.name,
                  value: i.id,
                }))}
                placeholder="Select"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tax"
              name="taxId"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                options={taxes.map((i) => ({
                  label: i.displayName,
                  value: i.id,
                }))}
                placeholder="Select"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="UOM"
              name="uom"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select options={UOM} placeholder="Select" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber placeholder="Price" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Quantity / Weight"
              name="weight"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                placeholder="Quantity / Weight"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Reorder Point"
              name="reorderPoint"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                placeholder="Reorder Point"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Stock Limit"
              name="stockLimit"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                placeholder="Stock Limit"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.TextArea placeholder="Description" rows={5} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="visible" valuePropName="checked">
              <Checkbox>Visible</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FormDrawer>
  );
};
