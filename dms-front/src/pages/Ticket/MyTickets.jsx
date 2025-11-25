import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Select, 
  Input, 
  Card, 
  Space,
  Tag,
  message
} from 'antd';
import { 
  SearchOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MyTickets = () => {
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [ticketStatus, setTicketStatus] = useState('all');
  const [ticketType, setTicketType] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Mock data for tickets
  const [tickets] = useState([
    { 
      id: 1, 
      title: 'MySQL数据库权限申请', 
      type: '权限申请', 
      status: 'pending', 
      approvalStatus: 'toApprove', 
      submitter: '张三', 
      approver: '李四', 
      createdAt: '2023-05-15 10:30:00',
      priority: 'high'
    },
    { 
      id: 2, 
      title: '数据导出工单', 
      type: '数据导出', 
      status: 'processing', 
      approvalStatus: 'approved', 
      submitter: '王五', 
      approver: '赵六', 
      createdAt: '2023-05-14 14:20:00',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: '数据库结构变更', 
      type: '结构变更', 
      status: 'completed', 
      approvalStatus: 'completed', 
      submitter: '孙七', 
      approver: '周八', 
      createdAt: '2023-05-13 09:15:00',
      priority: 'low'
    },
    { 
      id: 4, 
      title: '新建MySQL实例', 
      type: '资源申请', 
      status: 'pending', 
      approvalStatus: 'toProcess', 
      submitter: '吴九', 
      approver: '郑十', 
      createdAt: '2023-05-12 16:45:00',
      priority: 'high'
    },
  ]);

  const columns = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '工单标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '工单类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => (
        <Tag color={priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '工单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'pending' ? 'orange' : status === 'processing' ? 'blue' : 'green'}>
          {status === 'pending' ? '待处理' : status === 'processing' ? '处理中' : '已完成'}
        </Tag>
      ),
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
      render: (approvalStatus) => (
        <Tag color={
          approvalStatus === 'toApprove' ? 'orange' : 
          approvalStatus === 'approved' ? 'blue' : 
          approvalStatus === 'toProcess' ? 'purple' : 
          approvalStatus === 'completed' ? 'green' : 'cyan'
        }>
          {approvalStatus === 'toApprove' ? '待我审批' : 
           approvalStatus === 'approved' ? '已审批' : 
           approvalStatus === 'toProcess' ? '待我处理' : 
           approvalStatus === 'completed' ? '已完成' : '抄送给我'}
        </Tag>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" icon={<EditOutlined />}>处理</Button>
        </Space>
      ),
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    // 审批状态筛选
    if (approvalStatus !== 'all') {
      if (approvalStatus === 'toApprove' && ticket.approvalStatus !== 'toApprove') return false;
      if (approvalStatus === 'toProcess' && ticket.approvalStatus !== 'toProcess') return false;
      if (approvalStatus === 'submitted' && ticket.submitter !== '当前用户') return false;
      if (approvalStatus === 'approved' && ticket.approver !== '当前用户') return false;
      if (approvalStatus === 'executed' && ticket.status !== 'completed') return false;
      if (approvalStatus === 'cc' && ticket.approvalStatus !== 'cc') return false;
    }
    
    // 工单状态筛选
    if (ticketStatus !== 'all') {
      if (ticketStatus === 'finished' && ticket.status !== 'completed') return false;
      if (ticketStatus === 'unfinished' && ticket.status === 'completed') return false;
    }
    
    // 工单类型筛选
    if (ticketType !== 'all' && ticketType !== 'allTypes') {
      if (ticketType === 'permission' && ticket.type !== '权限申请') return false;
      if (ticketType === 'dataExport' && ticket.type !== '数据导出') return false;
      if (ticketType === 'schemaChange' && ticket.type !== '结构变更') return false;
      if (ticketType === 'resource' && ticket.type !== '资源申请') return false;
    }
    
    // 搜索框筛选
    if (searchText) {
      const searchTextLower = searchText.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchTextLower) ||
        ticket.submitter.toLowerCase().includes(searchTextLower) ||
        ticket.approver.toLowerCase().includes(searchTextLower)
      );
    }
    
    return true;
  });

  const handleSearch = () => {
    message.info('搜索功能已触发');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>我的工单</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>查看和管理与您相关的工单</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        {/* 搜索条件 */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          marginBottom: '24px',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ marginRight: '8px' }}>审批状态:</label>
            <Select 
              value={approvalStatus} 
              onChange={setApprovalStatus}
              style={{ width: '150px' }}
            >
              <Option value="all">全部</Option>
              <Option value="toApprove">待我审批</Option>
              <Option value="toProcess">待我处理</Option>
              <Option value="submitted">我提交的</Option>
              <Option value="approved">我审批的</Option>
              <Option value="executed">我执行的</Option>
              <Option value="cc">抄送我的</Option>
            </Select>
          </div>
          
          <div>
            <label style={{ marginRight: '8px' }}>工单状态:</label>
            <Select 
              value={ticketStatus} 
              onChange={setTicketStatus}
              style={{ width: '120px' }}
            >
              <Option value="all">全部</Option>
              <Option value="finished">已结束</Option>
              <Option value="unfinished">未结束</Option>
            </Select>
          </div>
          
          <div>
            <label style={{ marginRight: '8px' }}>工单类型:</label>
            <Select 
              value={ticketType} 
              onChange={setTicketType}
              style={{ width: '150px' }}
            >
              <Option value="all">全部</Option>
              <Option value="allTypes">全部类型</Option>
              <Option value="permission">权限申请</Option>
              <Option value="dataExport">数据导出</Option>
              <Option value="schemaChange">结构变更</Option>
              <Option value="resource">资源申请</Option>
            </Select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              placeholder="搜索工单标题、提交人、审批人" 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              suffix={<SearchOutlined />}
              onPressEnter={handleSearch}
            />
          </div>
          
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </div>
        
        {/* 工单列表 */}
        <Table 
          columns={columns} 
          dataSource={filteredTickets} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default MyTickets;