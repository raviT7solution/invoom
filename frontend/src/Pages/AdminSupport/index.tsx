import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Form,
  message,
  Popconfirm,
  Badge
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  SendOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  MessageOutlined
} from "@ant-design/icons";
import { Navbar } from "../../components/Navbar";
import { FormDrawer } from "../../components/FormDrawer";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Mock data for support tickets
const mockTickets = [
  {
    id: 'TK-001',
    ticketId: 'TK-001',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    subject: 'Integration Issues',
    category: 'technical',
    status: 'open',
    priority: 'high',
    createdOn: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    message: 'I am having trouble connecting my Xero account. The authentication keeps failing even though I am using the correct credentials. Can you please help me resolve this issue?',
    replies: []
  },
  {
    id: 'TK-002',
    ticketId: 'TK-002',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@company.com',
    subject: 'Billing & Subscriptions',
    category: 'billing',
    status: 'in_progress',
    priority: 'medium',
    createdOn: '2024-01-14T14:20:00Z',
    lastUpdated: '2024-01-14T16:45:00Z',
    message: 'I was charged twice for my subscription this month. Please check my billing history and refund the duplicate charge.',
    replies: [
      {
        id: 1,
        author: 'Admin',
        message: 'We are looking into your billing issue. Our finance team is reviewing your account.',
        timestamp: '2024-01-14T16:45:00Z'
      }
    ]
  },
  {
    id: 'TK-003',
    ticketId: 'TK-003',
    userName: 'Mike Johnson',
    userEmail: 'mike.j@startup.io',
    subject: 'Feature Request',
    category: 'feature',
    status: 'closed',
    priority: 'low',
    createdOn: '2024-01-13T09:15:00Z',
    lastUpdated: '2024-01-13T17:30:00Z',
    message: 'Can you add support for multi-language OCR processing? We need to process documents in French and German.',
    replies: [
      {
        id: 1,
        author: 'Admin',
        message: 'Thank you for your suggestion. We have added this to our product roadmap for consideration in future releases.',
        timestamp: '2024-01-13T17:30:00Z'
      }
    ]
  },
  {
    id: 'TK-004',
    ticketId: 'TK-004',
    userName: 'Sarah Wilson',
    userEmail: 'sarah.wilson@corp.com',
    subject: 'Account Management',
    category: 'account',
    status: 'open',
    priority: 'medium',
    createdOn: '2024-01-12T11:45:00Z',
    lastUpdated: '2024-01-12T11:45:00Z',
    message: 'I need to update my company information and add new team members to our account. How can I do this?',
    replies: []
  },
  {
    id: 'TK-005',
    ticketId: 'TK-005',
    userName: 'David Brown',
    userEmail: 'david.brown@tech.com',
    subject: 'Bug Report',
    category: 'bug',
    status: 'in_progress',
    priority: 'high',
    createdOn: '2024-01-11T16:20:00Z',
    lastUpdated: '2024-01-12T10:15:00Z',
    message: 'The dashboard is not loading properly after the latest update. I get a blank screen when I try to access the overview page.',
    replies: [
      {
        id: 1,
        author: 'Admin',
        message: 'We have identified the issue and our development team is working on a fix. We will update you once it is resolved.',
        timestamp: '2024-01-12T10:15:00Z'
      }
    ]
  }
];

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Closed', value: 'closed' }
];

const priorityOptions = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'red';
    case 'in_progress': return 'orange';
    case 'closed': return 'green';
    default: return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'blue';
    default: return 'default';
  }
};

const TicketViewModal = ({ 
  ticket, 
  open, 
  onClose, 
  onStatusUpdate, 
  onReply 
}: { 
  ticket: any; 
  open: boolean; 
  onClose: () => void; 
  onStatusUpdate: (ticketId: string, status: string) => void;
  onReply: (ticketId: string, reply: string) => void;
}) => {
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);

  const handleReply = async () => {
    try {
      setSending(true);
      const values = await form.validateFields();
      onReply(ticket.ticketId, values.reply);
      form.resetFields();
      message.success('Reply sent successfully');
    } catch (error) {
      console.error('Reply failed:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(ticket.ticketId, newStatus);
    message.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
  };

  if (!ticket) return null;

  return (
    <FormDrawer
      title={`Support Ticket - ${ticket.ticketId}`}
      open={open}
      onClose={onClose}
      width={800}
      isFetching={false}
      footer={null}
    >
      <div className="space-y-6">
        {/* Ticket Header */}
        <Card className="bg-gray-50">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-invoom-primary" />
                  <Text strong>{ticket.userName}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <MailOutlined className="text-invoom-primary" />
                  <Text>{ticket.userEmail}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-invoom-primary" />
                  <Text>{new Date(ticket.createdOn).toLocaleString()}</Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="space-y-2">
                <div>
                  <Text strong>Status: </Text>
                  <Select
                    value={ticket.status}
                    onChange={handleStatusChange}
                    className="w-32"
                    size="small"
                  >
                    <Select.Option value="open">Open</Select.Option>
                    <Select.Option value="in_progress">In Progress</Select.Option>
                    <Select.Option value="closed">Closed</Select.Option>
                  </Select>
                </div>
                <div>
                  <Text strong>Priority: </Text>
                  <Tag color={getPriorityColor(ticket.priority)}>
                    {ticket.priority.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <Text strong>Category: </Text>
                  <Tag>{ticket.category}</Tag>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Original Message */}
        <Card title={<span><MessageOutlined className="mr-2" />Original Message</span>}>
          <Title level={5} className="text-invoom-dark mb-3">{ticket.subject}</Title>
          <Paragraph className="text-gray-600 leading-relaxed">
            {ticket.message}
          </Paragraph>
        </Card>

        {/* Reply History */}
        {ticket.replies && ticket.replies.length > 0 && (
          <Card title="Reply History">
            <div className="space-y-4">
              {ticket.replies.map((reply: any) => (
                <div key={reply.id} className="border-l-4 border-invoom-secondary pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <Text strong className="text-invoom-primary">{reply.author}</Text>
                    <Text className="text-gray-500 text-sm">
                      {new Date(reply.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <Paragraph className="text-gray-600 mb-0">{reply.message}</Paragraph>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Admin Reply Form */}
        <Card title="Send Reply">
          <Form form={form} layout="vertical">
            <Form.Item
              name="reply"
              rules={[{ required: true, message: 'Please enter your reply' }]}
            >
              <TextArea
                rows={4}
                placeholder="Type your reply to the user..."
                maxLength={1000}
                showCount
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReply}
                loading={sending}
                className="font-semibold"
              >
                Send Reply
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </FormDrawer>
  );
};

export const AdminSupport = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    dateRange: null as any
  });

  // Filter tickets based on current filters
  const applyFilters = () => {
    let filtered = [...tickets];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.ticketId.toLowerCase().includes(searchTerm) ||
        ticket.userEmail.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.userName.toLowerCase().includes(searchTerm)
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdOn);
        return ticketDate >= startDate && ticketDate <= endDate;
      });
    }

    setFilteredTickets(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, tickets]);

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.ticketId !== ticketId));
    message.success('Ticket deleted successfully');
  };

  const handleStatusUpdate = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket =>
      ticket.ticketId === ticketId
        ? { ...ticket, status: newStatus, lastUpdated: new Date().toISOString() }
        : ticket
    ));
    setSelectedTicket((prev: any) => prev ? { ...prev, status: newStatus } : null);
  };

  const handleReply = (ticketId: string, replyMessage: string) => {
    const newReply = {
      id: Date.now(),
      author: 'Admin',
      message: replyMessage,
      timestamp: new Date().toISOString()
    };

    setTickets(tickets.map(ticket =>
      ticket.ticketId === ticketId
        ? {
            ...ticket,
            replies: [...(ticket.replies || []), newReply],
            lastUpdated: new Date().toISOString()
          }
        : ticket
    ));

    setSelectedTicket((prev: any) => prev ? {
      ...prev,
      replies: [...(prev.replies || []), newReply]
    } : null);
  };

  const refreshTickets = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Tickets refreshed');
    }, 1000);
  };

  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
      width: 100,
      render: (text: string) => (
        <Text strong className="text-invoom-primary">{text}</Text>
      )
    },
    {
      title: 'User',
      key: 'user',
      width: 200,
      render: (record: any) => (
        <div>
          <div className="font-semibold text-invoom-dark">{record.userName}</div>
          <div className="text-sm text-gray-500">{record.userEmail}</div>
        </div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium">{text}</div>
          <Tag className="mt-1">{record.category}</Tag>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (record: any) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewTicket(record)}
          />
          <Popconfirm
            title="Delete ticket"
            description="Are you sure you want to delete this ticket?"
            onConfirm={() => handleDeleteTicket(record.ticketId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Navbar breadcrumbItems={[{ title: "Admin Support" }]}>
      <div className="bg-white p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="text-invoom-dark mb-2">Support Management</Title>
            <Text className="text-gray-600">Manage and respond to user support requests</Text>
          </div>
          <div className="flex items-center gap-3">
            <Badge count={tickets.filter(t => t.status === 'open').length} color="red">
              <Button icon={<MessageOutlined />}>Open Tickets</Button>
            </Badge>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshTickets}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <Input
                placeholder="Search tickets..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                allowClear
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(value) => setFilters({...filters, status: value})}
                options={statusOptions}
                className="w-full"
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Priority"
                value={filters.priority}
                onChange={(value) => setFilters({...filters, priority: value})}
                options={priorityOptions}
                className="w-full"
              />
            </Col>
            <Col xs={24} sm={6}>
              <RangePicker
                placeholder={['Start Date', 'End Date']}
                onChange={(dates) => setFilters({...filters, dateRange: dates})}
                className="w-full"
              />
            </Col>
            <Col xs={24} sm={4}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilters({
                  status: 'all',
                  priority: 'all',
                  search: '',
                  dateRange: null
                })}
                className="w-full"
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tickets Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredTickets}
            rowKey="ticketId"
            pagination={{
              total: filteredTickets.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} tickets`
            }}
            scroll={{ x: 800 }}
            loading={loading}
          />
        </Card>

        {/* Ticket View Modal */}
        <TicketViewModal
          ticket={selectedTicket}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTicket(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          onReply={handleReply}
        />
      </div>
    </Navbar>
  );
}; 