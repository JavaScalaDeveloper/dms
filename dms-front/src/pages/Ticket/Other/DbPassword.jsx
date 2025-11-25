import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Divider
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';

const { Option } = Select;

const DbPassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for password requests
  const [passwordRequests] = useState([
    { 
      id: 1, 
      database: '生产MySQL实例1', 
      databaseType: 'MySQL', 
      status: 'approved', 
      applicant: '张三', 
      approver: '李四', 
      createdAt: '2023-05-15 10:30:00',
      expireTime: '2023-06-15 10:30:00'
    },
    { 
      id: 2, 
      database: '测试TiDB实例2', 
      databaseType: 'TiDB', 
      status: 'pending', 
      applicant: '王五', 
      approver: '赵六', 
      createdAt: '2023-05-14 14:20:00',
      expireTime: ''
    },
    { 
      id: 3, 
      database: '分析ClickHouse实例1', 
      databaseType: 'ClickHouse', 
      status: 'rejected', 
      applicant: '孙七', 
      approver: '周八', 
      createdAt: '2023-05-13 09:15:00',
      expireTime: ''
    },
  ]);

  const columns = [
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '数据库类型',
      dataIndex: 'databaseType',
      key: 'databaseType',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={
          status === 'approved' ? 'green' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status === 'approved' ? '已批准' : 
           status === 'pending' ? '待审批' : '已拒绝'}
        </Tag>
      ),
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
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
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'approved' && (
            <Button type="link" icon={<UnlockOutlined />}>查看密码</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleApplyPassword = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('密码申请已提交');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>数据库密码申请</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>申请和管理数据库访问密码</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleApplyPassword}>
            申请密码
          </Button>
        </div>
        
        {/* 密码申请列表 */}
        <Table 
          columns={columns} 
          dataSource={passwordRequests} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 申请密码模态框 */}
      <Modal
        title="申请数据库密码"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="database"
            label="数据库"
            rules={[{ required: true, message: '请选择数据库' }]}
          >
            <Select placeholder="请选择数据库">
              <Option value="prod-mysql-1">生产MySQL实例1</Option>
              <Option value="test-tidb-2">测试TiDB实例2</Option>
              <Option value="analytical-ch-1">分析ClickHouse实例1</Option>
              <Option value="analytical-es-1">分析Elasticsearch实例1</Option>
              <Option value="analytical-sr-1">分析StarRocks实例1</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="申请原因"
            rules={[{ required: true, message: '请输入申请原因' }]}
          >
            <Input.TextArea placeholder="请输入申请原因" rows={4} />
          </Form.Item>
          
          <Divider>安全提示</Divider>
          <div style={{ padding: '12px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
            <p><LockOutlined /> 密码申请需经过审批后方可获取</p>
            <p><LockOutlined /> 获取的密码仅在24小时内有效</p>
            <p><LockOutlined /> 请勿将密码泄露给无关人员</p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DbPassword;