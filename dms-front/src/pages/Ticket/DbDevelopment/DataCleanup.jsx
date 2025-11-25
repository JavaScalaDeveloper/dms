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
  DatePicker,
  Divider
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const DataCleanup = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for data cleanups
  const [dataCleanups] = useState([
    { 
      id: 1, 
      title: '清理过期用户数据', 
      database: '生产MySQL实例1', 
      status: 'completed', 
      operator: '张三', 
      reviewer: '李四',
      createdAt: '2023-05-15 10:30:00',
      cleanupRows: '15,200',
      cleanupType: '定期清理'
    },
    { 
      id: 2, 
      title: '清理临时日志数据', 
      database: '分析ClickHouse实例1', 
      status: 'processing', 
      operator: '王五', 
      reviewer: '赵六',
      createdAt: '2023-05-14 14:20:00',
      cleanupRows: '0',
      cleanupType: '条件清理'
    },
    { 
      id: 3, 
      title: '清理测试数据', 
      database: '测试TiDB实例2', 
      status: 'pending', 
      operator: '孙七', 
      reviewer: '周八',
      createdAt: '2023-05-13 09:15:00',
      cleanupRows: '0',
      cleanupType: '手动清理'
    },
  ]);

  const columns = [
    {
      title: '清理任务',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '清理类型',
      dataIndex: 'cleanupType',
      key: 'cleanupType',
      width: 100,
    },
    {
      title: '清理行数',
      dataIndex: 'cleanupRows',
      key: 'cleanupRows',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={
          status === 'completed' ? 'green' : 
          status === 'processing' ? 'blue' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status === 'completed' ? '已完成' : 
           status === 'processing' ? '处理中' : 
           status === 'pending' ? '待处理' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
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
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'pending' && (
            <Button type="link" icon={<DeleteOutlined />}>执行清理</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateCleanup = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('数据清理任务已创建');
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
        <h2 style={{ margin: 0 }}>数据清理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>清理数据库中的无效或过期数据</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCleanup}>
            新建清理任务
          </Button>
        </div>
        
        {/* 数据清理列表 */}
        <Table 
          columns={columns} 
          dataSource={dataCleanups} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新建清理任务模态框 */}
      <Modal
        title="新建数据清理任务"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="清理任务名称"
            rules={[{ required: true, message: '请输入清理任务名称' }]}
          >
            <Input placeholder="请输入清理任务名称" />
          </Form.Item>
          
          <Form.Item
            name="database"
            label="数据库"
            rules={[{ required: true, message: '请选择数据库' }]}
          >
            <Select placeholder="请选择数据库">
              <Option value="prod-mysql-1">生产MySQL实例1</Option>
              <Option value="test-tidb-2">测试TiDB实例2</Option>
              <Option value="analytical-ch-1">分析ClickHouse实例1</Option>
              <Option value="log-es-1">日志ES实例1</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="cleanupType"
            label="清理类型"
            rules={[{ required: true, message: '请选择清理类型' }]}
          >
            <Select placeholder="请选择清理类型">
              <Option value="regular">定期清理</Option>
              <Option value="conditional">条件清理</Option>
              <Option value="manual">手动清理</Option>
              <Option value="scheduled">定时清理</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tables"
            label="清理表"
            rules={[{ required: true, message: '请选择需要清理的表' }]}
          >
            <Select mode="multiple" placeholder="请选择需要清理的表">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
              <Option value="logs">logs</Option>
              <Option value="temp_data">temp_data</Option>
            </Select>
          </Form.Item>
          
          <Divider>清理条件</Divider>
          
          <Form.Item
            name="condition"
            label="清理条件"
          >
            <Input.TextArea placeholder="请输入清理条件，如：WHERE created_at < '2022-01-01'" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="retentionDays"
            label="数据保留天数"
          >
            <Input type="number" placeholder="请输入数据保留天数" addonAfter="天" />
          </Form.Item>
          
          <Form.Item
            name="scheduleTime"
            label="定时执行时间"
          >
            <DatePicker showTime placeholder="请选择定时执行时间" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="清理描述"
          >
            <Input.TextArea placeholder="请输入清理描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataCleanup;