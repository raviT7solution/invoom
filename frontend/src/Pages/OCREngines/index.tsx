import { useState } from "react";
import { Button, Card, Input, Form, Row, Col } from "antd";
import { Navbar } from "../../components/Navbar";
import { FormDrawer } from "../../components/FormDrawer";

const ocrEngines = [
  {
    id: "tesseract",
    name: "Tesseract OCR",
    logo: "/images/ocr/tesseract-logo.png",
    status: "not_connected",
    description: "Open-source OCR engine by Google. Supports 100+ languages. Great for custom/local deployment.",
    category: "Open Source"
  },
  {
    id: "google-vision",
    name: "Google Cloud Vision OCR",
    logo: "/images/ocr/google-vision-logo.png",
    status: "not_connected",
    description: "Cloud-based API. Accurate text extraction and layout detection. Easy to integrate.",
    category: "Cloud Service"
  },
  {
    id: "amazon-textract",
    name: "Amazon Textract",
    logo: "/images/ocr/amazon-textract-logo.png",
    status: "not_connected",
    description: "Extracts text, tables, and form data. Ideal for structured documents like invoices.",
    category: "Cloud Service"
  },
  {
    id: "abbyy",
    name: "ABBYY FineReader",
    logo: "/images/ocr/abbyy-logo.png",
    status: "not_connected",
    description: "Enterprise-grade OCR with high accuracy and document layout intelligence.",
    category: "Enterprise"
  },
  {
    id: "azure-ocr",
    name: "Microsoft Azure OCR",
    logo: "/images/ocr/azure-ocr-logo.png",
    status: "not_connected",
    description: "Offers OCR with language detection and integration into Microsoft ecosystem.",
    category: "Cloud Service"
  },
  {
    id: "custom-ocr",
    name: "Custom OCR Tool",
    logo: "/images/ocr/custom-ocr-logo.png",
    status: "connected",
    description: "Our in-house OCR/AI engine with custom training and specialized document processing.",
    category: "In-House"
  }
];

const OCRModal = ({ 
  open, 
  onClose, 
  ocrEngine, 
  onConnect 
}: { 
  open: boolean; 
  onClose: () => void; 
  ocrEngine: any; 
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
    switch (ocrEngine?.id) {
      case 'tesseract':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Installation Path"
                name="installationPath"
                rules={[{ required: true, message: 'Please enter installation path' }]}
              >
                <Input placeholder="Enter Tesseract installation path" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Language Models"
                name="languageModels"
                rules={[{ required: true, message: 'Please specify language models' }]}
              >
                <Input placeholder="eng,ara,fra (comma-separated)" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'google-vision':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="API Key"
                name="apiKey"
                rules={[{ required: true, message: 'Please enter API Key' }]}
              >
                <Input.Password placeholder="Enter Google Cloud Vision API Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Project ID"
                name="projectId"
                rules={[{ required: true, message: 'Please enter Project ID' }]}
              >
                <Input placeholder="Enter Google Cloud Project ID" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'amazon-textract':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="AWS Access Key"
                name="accessKey"
                rules={[{ required: true, message: 'Please enter AWS Access Key' }]}
              >
                <Input placeholder="Enter AWS Access Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="AWS Secret Key"
                name="secretKey"
                rules={[{ required: true, message: 'Please enter AWS Secret Key' }]}
              >
                <Input.Password placeholder="Enter AWS Secret Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="AWS Region"
                name="region"
                rules={[{ required: true, message: 'Please enter AWS Region' }]}
              >
                <Input placeholder="us-east-1" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'abbyy':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="License Key"
                name="licenseKey"
                rules={[{ required: true, message: 'Please enter License Key' }]}
              >
                <Input.Password placeholder="Enter ABBYY License Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Server URL"
                name="serverUrl"
                rules={[{ required: true, message: 'Please enter Server URL' }]}
              >
                <Input placeholder="https://your-abbyy-server.com" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'azure-ocr':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Subscription Key"
                name="subscriptionKey"
                rules={[{ required: true, message: 'Please enter Subscription Key' }]}
              >
                <Input.Password placeholder="Enter Azure Cognitive Services Key" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Endpoint"
                name="endpoint"
                rules={[{ required: true, message: 'Please enter Endpoint' }]}
              >
                <Input placeholder="https://your-resource.cognitiveservices.azure.com/" />
              </Form.Item>
            </Col>
          </Row>
        );
      case 'custom-ocr':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="API Endpoint"
                name="apiEndpoint"
                rules={[{ required: true, message: 'Please enter API Endpoint' }]}
              >
                <Input placeholder="Enter Custom OCR API Endpoint" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Authentication Token"
                name="authToken"
                rules={[{ required: true, message: 'Please enter Authentication Token' }]}
              >
                <Input.Password placeholder="Enter Authentication Token" />
              </Form.Item>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  if (!ocrEngine) return null;

  return (
    <FormDrawer
      title={`Configure ${ocrEngine.name}`}
      open={open}
      onClose={handleClose}
      width={600}
      footer={
        <Button 
          form="ocr-form" 
          htmlType="submit" 
          type="primary" 
          loading={loading}
        >
          {ocrEngine.status === 'connected' ? 'Update' : 'Connect'}
        </Button>
      }
      isFetching={false}
    >
      <Form
        form={form}
        layout="vertical"
        name="ocr-form"
        onFinish={handleConnect}
        preserve={false}
      >
        <div className="mb-6 text-center">
          <div className="inline-block p-4 bg-gray-50 rounded-lg mb-4">
            <img 
              src={ocrEngine.logo} 
              alt={ocrEngine.name}
              className="h-16 w-auto object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const fallback = img.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'block';
                }
              }}
            />
            <div className="logo-fallback hidden bg-invoom-primary text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">{ocrEngine.name.split(' ')[0]}</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">{ocrEngine.description}</h3>
          <div className="text-sm text-gray-500 mt-2">
            <span className="bg-gray-100 px-2 py-1 rounded-full">{ocrEngine.category}</span>
          </div>
        </div>

        {getFormFields()}
      </Form>
    </FormDrawer>
  );
};

const OCREngineCard = ({ engine, onAction }: { engine: any; onAction: (id: string, action: string) => void }) => {
  const isConnected = engine.status === "connected";
  
  return (
    <Card className="h-[400px] relative border border-gray-200 hover:shadow-lg transition-shadow rounded-lg" bodyStyle={{ padding: '0', height: '100%' }}>
      <div className="p-6 h-full flex flex-col">
        {/* Status Badge - Top Right */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600 hidden'
        }`}>
          {isConnected ? 'Integrated' : 'Not Connected'}
        </div>

        {/* Engine Name */}
        <div className="mb-6 pr-16">
          <h3 className="text-lg font-semibold text-invoom-dark leading-tight line-clamp-2">{engine.name}</h3>
        </div>
        
        {/* Logo Section */}
        <div className="flex-1 flex flex-col items-center justify-start">
          {/* Logo Container - Fixed Height */}
          <div className="h-20 w-full flex items-center justify-center mb-4">
            <img 
              src={engine.logo} 
              alt={engine.name}
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
            <div className="hidden bg-invoom-primary text-white px-4 py-3 rounded-lg text-center shadow-md">
              <div className="text-sm font-bold text-white">{engine.name.split(' ')[0]}</div>
            </div>
          </div>
          
          {/* Description - Fixed Height */}
          <div className="h-16 flex items-start justify-center mb-4">
            <div className="text-sm text-gray-500 text-center leading-5 px-1 line-clamp-3">
              {engine.description}
            </div>
          </div>
          
          {/* Category */}
          <div className="text-xs text-gray-400 text-center font-medium mb-4">
            {engine.category}
          </div>
        </div>
        
        {/* Action Button - Always at Bottom */}
        <div className="mt-auto pt-4">
          {isConnected ? (
            <div className="flex gap-2">
              <Button 
                className="flex-1 h-10 text-sm font-medium"
                onClick={() => onAction(engine.id, 'manage')}
              >
                Manage
              </Button>
              <Button 
                className="flex-1 h-10 text-sm font-medium"
                onClick={() => onAction(engine.id, 'docs')}
              >
                Docs
              </Button>
            </div>
          ) : (
            <Button 
              type="primary"
              className="w-full h-10 text-sm font-semibold"
              onClick={() => onAction(engine.id, 'connect')}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export const OCREngines = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<any>(null);

  const handleEngineAction = (engineId: string, action: string) => {
    const engine = ocrEngines.find(e => e.id === engineId);
    
    if (action === 'connect' || action === 'manage') {
      setSelectedEngine(engine);
      setModalOpen(true);
    } else if (action === 'docs') {
      // Open documentation for the specific OCR engine
      console.log(`Opening documentation for: ${engineId}`);
      // In a real app, this would open documentation or help modal
    }
  };

  const handleConnect = (formValues: any) => {
    console.log('Connecting OCR engine with values:', formValues, selectedEngine);
    // In a real app, this would make an API call to configure the OCR engine
  };

  // Sort engines to put In-House first, then others
  const sortedEngines = [...ocrEngines].sort((a, b) => {
    if (a.category === "In-House") return -1;
    if (b.category === "In-House") return 1;
    return 0;
  });

  return (
    <Navbar breadcrumbItems={[{ title: "OCR & AI Engines" }]}>
      <div className="bg-white p-6 rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-invoom-dark mb-2">OCR & AI Engines</h2>
          <p className="text-gray-600">Connect and manage OCR engines for automated document processing and text extraction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedEngines.map((engine: any) => (
            <OCREngineCard
              key={engine.id}
              engine={engine}
              onAction={handleEngineAction}
            />
          ))}
        </div>
      </div>

      <OCRModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEngine(null);
        }}
        ocrEngine={selectedEngine}
        onConnect={handleConnect}
      />
    </Navbar>
  );
}; 