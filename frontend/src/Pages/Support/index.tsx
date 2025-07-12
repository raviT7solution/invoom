import { useState } from "react";
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  Select, 
  Collapse, 
  Typography, 
  Row, 
  Col, 
  Upload, 
  message
} from "antd";
import { 
  SearchOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  ClockCircleOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
  CustomerServiceOutlined
} from "@ant-design/icons";
import { Navbar } from "../../components/Navbar";

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const faqData = [
  {
    key: '1',
    question: 'How do I connect a new integration?',
    answer: 'To connect a new integration, navigate to Settings > Integrations, select the service you want to connect (e.g., Xero, QuickBooks), and click the "Connect" button. Follow the authentication steps to authorize the connection.'
  },
  {
    key: '2',
    question: 'How do I create a new subscription plan?',
    answer: 'Go to the Plan section from the sidebar, click "Add Plan" button, fill in the plan details including name, pricing, features, and client type. Click "Save" to create the plan.'
  },
  {
    key: '3',
    question: 'How do I manage client subscriptions?',
    answer: 'Visit the Subscription section to view all active and cancelled subscriptions. You can edit subscription details, change plans, or cancel subscriptions from this section.'
  },
  {
    key: '4',
    question: 'What OCR engines are supported?',
    answer: 'We support multiple OCR engines including Tesseract OCR, Google Cloud Vision, Amazon Textract, ABBYY FineReader, Microsoft Azure OCR, and our custom in-house OCR solution.'
  },
  {
    key: '5',
    question: 'How do I configure SMS/WhatsApp messaging?',
    answer: 'Navigate to Settings > Integrations > Messages tab. Select either SMS or WhatsApp, choose your preferred provider (MSG91, Twilio, Interakt), and configure the connection with your API credentials.'
  },
  {
    key: '6',
    question: 'How do I export or download reports?',
    answer: 'Most data tables in the application have export functionality. Look for the export icon or button near the table headers to download data in various formats (CSV, Excel, PDF).'
  },
  {
    key: '7',
    question: 'How do I reset my password?',
    answer: 'Click on your profile avatar in the top-right corner, select "Change password" from the dropdown menu, and follow the instructions to update your password.'
  },
  {
    key: '8',
    question: 'What are the system requirements?',
    answer: 'InvOom is a web-based application that works on any modern browser (Chrome, Firefox, Safari, Edge). No additional software installation is required. For optimal performance, we recommend using the latest browser versions.'
  }
];

const subjectOptions = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Technical Support', value: 'technical' },
  { label: 'Billing & Subscriptions', value: 'billing' },
  { label: 'Integration Issues', value: 'integration' },
  { label: 'Feature Request', value: 'feature' },
  { label: 'Bug Report', value: 'bug' },
  { label: 'Account Management', value: 'account' },
  { label: 'Other', value: 'other' }
];

export const Support = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (_values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Your support request has been submitted successfully! We will get back to you within 24 hours.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit support request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload', // This would be your actual upload endpoint
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file: any) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
      }
      return isLt10M;
    },
  };

  return (
    <Navbar breadcrumbItems={[{ title: "Support" }]}>
      <div className="bg-white p-6 rounded-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <Title level={2} className="text-invoom-dark mb-2">
            <CustomerServiceOutlined className="mr-3 text-invoom-secondary" />
            Support Center
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            Get help and support for your InvOom experience
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column - FAQ and Contact Info */}
          <Col xs={24} lg={14}>
            {/* FAQ Section */}
            <Card className="mb-6 border border-gray-200">
              <div className="mb-6">
                <Title level={3} className="text-invoom-primary mb-4">
                  <QuestionCircleOutlined className="mr-2" />
                  Frequently Asked Questions
                </Title>
                
                {/* Search FAQs */}
                <Input
                  placeholder="Search FAQs..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                  size="large"
                />

                {/* FAQ List */}
                <Collapse
                  items={filteredFAQs.map(faq => ({
                    key: faq.key,
                    label: <span className="font-semibold text-invoom-dark">{faq.question}</span>,
                    children: <Paragraph className="text-gray-600 leading-relaxed">{faq.answer}</Paragraph>
                  }))}
                  className="bg-gray-50"
                  expandIconPosition="end"
                />

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <QuestionCircleOutlined className="text-4xl mb-2" />
                    <div>No FAQs found matching your search.</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="border border-gray-200">
              <Title level={3} className="text-invoom-primary mb-4">
                <PhoneOutlined className="mr-2" />
                Contact Information
              </Title>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MailOutlined className="text-2xl text-invoom-secondary mb-2" />
                    <div className="font-semibold text-invoom-dark">Email Support</div>
                    <Text className="text-gray-600">support@invoom.com</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <PhoneOutlined className="text-2xl text-invoom-secondary mb-2" />
                    <div className="font-semibold text-invoom-dark">Phone Support</div>
                    <Text className="text-gray-600">+91-99999-00000</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <ClockCircleOutlined className="text-2xl text-invoom-secondary mb-2" />
                    <div className="font-semibold text-invoom-dark">Working Hours</div>
                    <Text className="text-gray-600">Mon-Fri, 9 AM to 6 PM IST</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Contact Form and Chat */}
          <Col xs={24} lg={10}>
            {/* Contact Support Form */}
            <Card className="mb-6 border border-gray-200">
              <Title level={3} className="text-invoom-primary mb-4">
                <MessageOutlined className="mr-2" />
                Contact Support
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input placeholder="Enter your full name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input placeholder="Enter your email" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Subject"
                  name="subject"
                  rules={[{ required: true, message: 'Please select a subject' }]}
                >
                  <Select
                    placeholder="Select inquiry type"
                    options={subjectOptions}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Message"
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Describe your issue or question in detail..."
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>

                <Form.Item label="Attachments (Optional)">
                  <Upload.Dragger {...uploadProps} className="bg-gray-50">
                    <p className="ant-upload-drag-icon">
                      <PaperClipOutlined className="text-invoom-primary" />
                    </p>
                    <p className="ant-upload-text">Click or drag files to upload</p>
                    <p className="ant-upload-hint">
                      Support for images, documents (Max 10MB per file)
                    </p>
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    size="large"
                    className="w-full h-12 font-semibold"
                  >
                    Submit Support Request
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Live Chat Placeholder */}
            <Card className="border border-gray-200 bg-gradient-to-br from-invoom-primary to-blue-800 text-white">
              <div className="text-center">
                <MessageOutlined className="text-4xl text-invoom-secondary mb-3" />
                <Title level={4} className="text-white mb-2">Live Chat Support</Title>
                <Paragraph className="text-blue-100 mb-4">
                  Get instant help from our support team
                </Paragraph>
                <Button
                  size="large"
                  className="bg-invoom-secondary border-invoom-secondary text-invoom-dark font-semibold hover:bg-yellow-400"
                  disabled
                >
                  Coming Soon
                </Button>
                <div className="mt-3 text-xs text-blue-200">
                  Live chat will be available in the next update
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Navbar>
  );
}; 