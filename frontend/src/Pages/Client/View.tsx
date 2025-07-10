import { Descriptions } from "antd";
import { useClient } from "../../api";
import { FormDrawer } from "../../components/FormDrawer";

export const View = ({
  clientId,
  open,
  showViewClient,
}: {
  clientId: string;
  open: boolean;
  showViewClient: (id: string, open: boolean) => void;
}) => {
  const { data: client, isFetching } = useClient(clientId);

  const onClose = () => showViewClient("", false);

  return (
    <FormDrawer
      isFetching={isFetching}
      onClose={onClose}
      open={open}
      title="View client"
      width={1000}
      footer={null}
    >
      <Descriptions
        bordered
        column={3}
        size="middle"
        labelStyle={{ fontWeight: 600, width: 180 }}
      >
        <Descriptions.Item label="First Name">{client?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{client?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{client?.email}</Descriptions.Item>
        <Descriptions.Item label="Mobile Number">{client?.mobileNumber}</Descriptions.Item>
        <Descriptions.Item label="Country">{client?.country}</Descriptions.Item>
        <Descriptions.Item label="Client Type">
          {client?.signupType === "Practice" ? "Practice" : client?.signupType === "Business" ? "Business" : ""}
        </Descriptions.Item>
        <Descriptions.Item label={client?.signupType === "Practice" ? "Practice Name" : "Business Name"} span={2}>
          {client?.clientName}
        </Descriptions.Item>
      </Descriptions>
    </FormDrawer>
  );
};
