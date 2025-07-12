import { useState } from "react";
import { Button, Card, Input, Form, Row, Col, Tabs, Switch, Select, Table } from "antd";
import { Navbar } from "../../components/Navbar";
import { FormDrawer } from "../../components/FormDrawer";

const { TabPane } = Tabs;

const thirdPartyIntegrations = [
  {
    id: "xero",
    name: "Xero",
    logo: "/images/third-party-logos/xero-logo.png",
    status: "not_connected",
    description: "Accounting & Financial Management",
    category: "Accounting"
  },
  {
    id: "quickbooks",
    name: "QuickBooks", 
    logo: "/images/third-party-logos/quickbooks-logo.png",
    status: "not_connected",
    description: "Business Accounting Software",
    category: "Accounting"
  }
];

const smsProviders = [
  {
    id: "msg91",
    name: "MSG91",
    logo: "/images/sms-logos/msg91-logo.png",
    status: "not_connected"
  },
  {
    id: "twilio",
    name: "Twilio",
    logo: "/images/sms-logos/twilio-logo.png",
    status: "not_connected"
  }
];

const whatsappProviders = [
  {
    id: "interakt",
    name: "Interakt",
    logo: "/images/whatsapp-logos/interakt-logo.png",
    status: "not_connected",
    hasOffer: true
  }
];

interface SMSTemplate {
  key: number;
  templateName: string;
  message: string;
  event: string;
  route: string;
  actions?: string;
}

interface WhatsAppTemplate {
  key: number;
  event: string;
  templateName: string;
  message: string;
  isDefault: string;
  actions?: string;
}

const smsTemplates: SMSTemplate[] = [
  // Empty for now - "No data available in table"
];

const whatsappTemplates: WhatsAppTemplate[] = [
  {
    key: 1,
    event: "CUSTOMER_CREDENTIALS",
    templateName: "b2b_user_credential",
    message: "Hi everyone, We are Upgrading our ordering system. Hence please use the below link and login details for placing your order Link :- #LOGIN_URL# User ID :- #LOGIN_USERNAME# Password :- #LOGIN_PASSWORD# Thanking you Team H & S",
    isDefault: "Yes"
  },
  {
    key: 2,
    event: "NEW_INVOICE", 
    templateName: "invoice_new",
    message: "Hi #CUSTOMER_NAME#, Thank you for your purchase at #COMPANY_DISPLAY_NAME# on #DATE_AND_TIME#. Your Invoice id is #INVOICE_NUMBER# & your total amount is #TOTAL_AMOUNT#. We welcome you again. Regards, #COMPANY_DISPLAY_NAME#",
    isDefault: "Yes"
  }
];

const IntegrationModal = ({ 
  open, 
  onClose, 
  integration, 
  onConnect 
}: { 
  open: boolean; 
  onClose: () => void; 
  integration: any; 
  onConnect: (values: any) => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onConnect(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const getFormFields = () => {
    switch (integration?.id) {
      case 'xero':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Client ID"
                name="clientId"
                rules={[{ required: true, message: 'Please enter Client ID' }]}
              >
                <Input placeholder="Enter Xero Client ID" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Client Secret"
                name="clientSecret"
                rules={[{ required: true, message: 'Please enter Client Secret' }]}
              >
                <Input.Password placeholder="Enter Xero Client Secret" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Redirect URI"
                name="redirectUri"
                rules={[{ required: true, message: 'Please enter Redirect URI' }]}
              >
                <Input placeholder="Enter Redirect URI" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'quickbooks':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="App Key"
                name="appKey"
                rules={[{ required: true, message: 'Please enter App Key' }]}
              >
                <Input placeholder="Enter QuickBooks App Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="App Secret"
                name="appSecret"
                rules={[{ required: true, message: 'Please enter App Secret' }]}
              >
                <Input.Password placeholder="Enter QuickBooks App Secret" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Company ID"
                name="companyId"
                rules={[{ required: true, message: 'Please enter Company ID' }]}
              >
                <Input placeholder="Enter Company ID" />
              </Form.Item>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  if (!integration) return null;

  return (
    <FormDrawer
      title={`Connect ${integration.name}`}
      open={open}
      onClose={handleClose}
      width={600}
      footer={
        <Button 
          form="integration-form" 
          htmlType="submit" 
          type="primary" 
          loading={loading}
        >
          Connect
        </Button>
      }
      isFetching={false}
    >
      <Form
        form={form}
        layout="vertical"
        name="integration-form"
        onFinish={handleConnect}
        preserve={false}
      >
        <div className="mb-6 text-center">
          <div className="inline-block p-4 bg-gray-50 rounded-lg mb-4">
            <img 
              src={integration.logo} 
              alt={integration.name}
              className="h-16 w-auto object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold">{integration.description}</h3>
          <p className="text-gray-500 text-sm">Configure your {integration.name} integration settings</p>
        </div>

        {getFormFields()}
      </Form>
    </FormDrawer>
  );
};

const ThirdPartyIntegrationCard = ({ integration, onAction }: { integration: any; onAction: (id: string, action: string) => void }) => {
  const isConnected = integration.status === "connected";
  
  return (
    <Card className="h-64 flex flex-col justify-between border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="text-lg font-semibold">{integration.name}</div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <img 
            src={integration.logo} 
            alt={integration.name}
            className="max-h-16 max-w-32 object-contain mb-2"
          />
          <div className="text-sm text-gray-500 text-center mt-1">{integration.description}</div>
        </div>
        
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button 
                className="flex-1"
                onClick={() => onAction(integration.id, 'manage')}
              >
                Manage
              </Button>
              <Button 
                danger
                className="flex-1"
                onClick={() => onAction(integration.id, 'disconnect')}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button 
              type="primary"
              className="w-full"
              onClick={() => onAction(integration.id, 'connect')}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const MessageProviderCard = ({ provider, onAction }: { provider: any; onAction: (id: string, action: string) => void }) => {
  const isConnected = provider.status === "connected";
  
  return (
    <Card className="h-48 border border-gray-200 hover:shadow-md transition-shadow relative">

      <div className="flex flex-col h-full">
        <div className="text-lg  items-center font-semibold mb-4">{provider.name}</div>
        
        <div className="flex-1 flex items-center justify-center mb-4">
          <img 
            src={provider.logo} 
            alt={provider.name}
            className="max-h-16 max-w-32 object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) {
                fallback.style.display = 'block';
              }
            }}
          />
          <div className="text-gray-600 font-medium hidden">{provider.name}</div>
        </div>
        
        <Button 
          type="primary"
          className="w-full"
          onClick={() => onAction(provider.id, 'connect')}
        >
          {isConnected ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </Card>
  );
};

export const Integration = () => {
  const [activeTab, setActiveTab] = useState("thirdparty");
  const [messageSubTab, setMessageSubTab] = useState("sms");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [allowPromotionalSMS, setAllowPromotionalSMS] = useState(false);
  const [defaultSMSProvider, setDefaultSMSProvider] = useState("MSG91");
  const [defaultWhatsAppProvider, setDefaultWhatsAppProvider] = useState("INTERAKT");

  const handleThirdPartyAction = (integrationId: string, action: string) => {
    const integration = thirdPartyIntegrations.find(i => i.id === integrationId);
    
    if (action === 'connect') {
      setSelectedIntegration(integration);
      setModalOpen(true);
    } else {
      console.log(`${action} integration: ${integrationId}`);
    }
  };

  const handleMessageProviderAction = (providerId: string, action: string) => {
    console.log(`${action} provider: ${providerId}`);
    // Add message provider action logic here
  };

  const handleConnect = (formValues: any) => {
    console.log('Connecting integration with values:', formValues, selectedIntegration);
  };

  const smsColumns = [
    { title: '#', dataIndex: 'key', key: 'key' },
    { title: 'Template Name', dataIndex: 'templateName', key: 'templateName' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Route', dataIndex: 'route', key: 'route' },
    { title: 'Actions', dataIndex: 'actions', key: 'actions' },
  ];

  const whatsappColumns = [
    { title: '#', dataIndex: 'key', key: 'key' },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { title: 'Template Name', dataIndex: 'templateName', key: 'templateName' },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 400 },
    { title: 'Is Default', dataIndex: 'isDefault', key: 'isDefault' },
    { title: 'Actions', dataIndex: 'actions', key: 'actions' },
  ];

  const renderThirdPartyTab = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Third Party Integrations</h3>
        <p className="text-gray-600 text-sm">Connect your accounting software to sync financial data</p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium mb-4">Accounting & Finance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {thirdPartyIntegrations.map((integration) => (
            <ThirdPartyIntegrationCard
              key={integration.id}
              integration={integration}
              onAction={handleThirdPartyAction}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSMSContent = () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Allow Promotional SMS</span>
          <Switch 
            checked={allowPromotionalSMS} 
            onChange={setAllowPromotionalSMS}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Select default:</span>
          <Select
            value={defaultSMSProvider}
            onChange={setDefaultSMSProvider}
            className="w-32"
            options={[
              { label: "MSG91", value: "MSG91" },
              { label: "TextLocal", value: "TextLocal" },
              { label: "Twilio", value: "Twilio" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {smsProviders.map((provider) => (
          <MessageProviderCard
            key={provider.id}
            provider={provider}
            onAction={handleMessageProviderAction}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">SMS Template Master</h4>
          <Button type="primary">Create New</Button>
        </div>
        <Table
          columns={smsColumns}
          dataSource={smsTemplates}
          pagination={false}
          locale={{ emptyText: 'No data available in table' }}
        />
        <div className="mt-2 text-sm text-gray-500">
          Showing 0 to 0 of 0 entries
        </div>
      </div>
    </div>
  );

  const renderWhatsAppContent = () => (
    <div>
      <div className="mb-6 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span>Select Default:</span>
          <Select
            value={defaultWhatsAppProvider}
            onChange={setDefaultWhatsAppProvider}
            className="w-32"
            options={[
              { label: "INTERAKT", value: "INTERAKT" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {whatsappProviders.map((provider) => (
          <MessageProviderCard
            key={provider.id}
            provider={provider}
            onAction={handleMessageProviderAction}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Whatsapp Template Master</h4>
          <Button type="primary">Create New</Button>
        </div>
        <Table
          columns={whatsappColumns}
          dataSource={whatsappTemplates}
          pagination={{
            current: 1,
            pageSize: 10,
            total: whatsappTemplates.length,
            showSizeChanger: false,
          }}
        />
        <div className="mt-2 text-sm text-gray-500">
          Showing 1 to 2 of 2 entries
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="flex gap-6">
      <div className="w-48">
        <div className="border rounded-lg overflow-hidden">
          <button
            className={`w-full p-3 text-left border-b ${messageSubTab === 'sms' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setMessageSubTab('sms')}
          >
            SMS
          </button>
          <button
            className={`w-full p-3 text-left ${messageSubTab === 'whatsapp' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setMessageSubTab('whatsapp')}
          >
            Whatsapp
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        {messageSubTab === 'sms' ? renderSMSContent() : renderWhatsAppContent()}
      </div>
    </div>
  );

  return (
    <Navbar breadcrumbItems={[{ title: "Integration" }]}>
      <div className="bg-white p-6 rounded-lg">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Third Party" key="thirdparty">
            {renderThirdPartyTab()}
          </TabPane>
          <TabPane tab="Messages" key="messages">
            {renderMessagesTab()}
          </TabPane>
        </Tabs>
      </div>

      <IntegrationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedIntegration(null);
        }}
        integration={selectedIntegration}
        onConnect={handleConnect}
      />
    </Navbar>
  );
}; 