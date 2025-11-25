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
  message
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Option } = Select;

const Permissions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for permissions
  const [permissions] = useState([
    { 
      id: 1, 
      database: '生产MySQL实例1', 
      databaseType: 'MySQL', 
      permissionType: '读写权限', 
      status: 'approved', 
      applicant: '张三', 
      approver: '李四', 
      createdAt: '2023-05-15 10:30:00',
      expireDate: '2024-05-15'
    },
    { 
      id: 2, 
      database: '测试TiDB实例2', 
      databaseType: 'TiDB', 
      permissionType: '只读权限', 
      status: 'pending', 
      applicant: '王五', 
      approver: '赵六', 
      createdAt: '2023-05-14 14:20:00',
      expireDate: '2024-05-14'
    },
    { 
      id: 3, 
      database: '分析ClickHouse实例1', 
      databaseType: 'ClickHouse', 
      permissionType: 'DDL权限', 
      status: 'rejected', 
      applicant: '孙七', 
      approver: '周八', 
      createdAt: '2023-05-13 09:15:00',
      expireDate: '2024-05-13'
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
      title: '权限类型',
      dataIndex: 'permissionType',
      key: 'permissionType',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'approved' ? '已批准' : status === 'pending' ? '待审批' : '已拒绝'}
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
      dataIndex: 'expireDate',
      key: 'expireDate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'pending' && (
            <Button type="link" icon={<EditOutlined />}>审批</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleApplyPermission = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('权限申请已提交');
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
        <h2 style={{ margin: 0 }}>权限管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>申请和管理数据库权限</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleApplyPermission}>
            申请权限
          </Button>
        </div>
        
        {/* 权限列表 */}
        <Table 
          columns={columns} 
          dataSource={permissions} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 申请权限模态框 */}
      <Modal
        title="申请数据库权限"
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
            name="permissionType"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select placeholder="请选择权限类型">
              <Option value="read">只读权限</Option>
              <Option value="readWrite">读写权限</Option>
              <Option value="ddl">DDL权限</Option>
              <Option value="admin">管理员权限</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="申请原因"
            rules={[{ required: true, message: '请输入申请原因' }]}
          >
            <Input.TextArea placeholder="请输入申请原因" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="expireDate"
            label="过期时间"
            rules={[{ required: true, message: '请选择过期时间' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Permissions;