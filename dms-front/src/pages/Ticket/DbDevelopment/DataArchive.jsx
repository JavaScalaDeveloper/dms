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
  DatabaseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DataArchive = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for data archives
  const [dataArchives] = useState([
    { 
      id: 1, 
      title: '历史订单数据归档', 
      database: '生产MySQL实例1', 
      status: 'completed', 
      operator: '张三', 
      createdAt: '2023-05-15 10:30:00',
      archivedRows: '1,250,000',
      archivePeriod: '2022-01-01 至 2022-12-31'
    },
    { 
      id: 2, 
      title: '用户行为日志归档', 
      database: '分析ClickHouse实例1', 
      status: 'processing', 
      operator: '王五', 
      createdAt: '2023-05-14 14:20:00',
      archivedRows: '5,800,000',
      archivePeriod: '2023-01-01 至 2023-03-31'
    },
    { 
      id: 3, 
      title: '系统日志数据归档', 
      database: '日志ES实例1', 
      status: 'pending', 
      operator: '孙七', 
      createdAt: '2023-05-13 09:15:00',
      archivedRows: '0',
      archivePeriod: '2023-04-01 至 2023-06-30'
    },
  ]);

  const columns = [
    {
      title: '归档任务',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '归档周期',
      dataIndex: 'archivePeriod',
      key: 'archivePeriod',
      width: 200,
    },
    {
      title: '归档行数',
      dataIndex: 'archivedRows',
      key: 'archivedRows',
      width: 120,
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
            <Button type="link">执行</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateArchive = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('数据归档任务已创建');
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
        <h2 style={{ margin: 0 }}>数据归档</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>将历史数据归档到专门的存储中</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateArchive}>
            新建归档任务
          </Button>
        </div>
        
        {/* 数据归档列表 */}
        <Table 
          columns={columns} 
          dataSource={dataArchives} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新建归档任务模态框 */}
      <Modal
        title="新建数据归档任务"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="归档任务名称"
            rules={[{ required: true, message: '请输入归档任务名称' }]}
          >
            <Input placeholder="请输入归档任务名称" />
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
            name="tables"
            label="归档表"
            rules={[{ required: true, message: '请选择需要归档的表' }]}
          >
            <Select mode="multiple" placeholder="请选择需要归档的表">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
              <Option value="logs">logs</Option>
            </Select>
          </Form.Item>
          
          <Divider>归档条件</Divider>
          
          <Form.Item
            name="timeRange"
            label="归档时间范围"
            rules={[{ required: true, message: '请选择归档时间范围' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="condition"
            label="归档条件"
          >
            <Input.TextArea placeholder="请输入归档条件，如：WHERE status = 'completed'" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="storage"
            label="归档存储位置"
            rules={[{ required: true, message: '请选择归档存储位置' }]}
          >
            <Select placeholder="请选择归档存储位置">
              <Option value="oss">对象存储(OSS)</Option>
              <Option value="hdfs">分布式文件系统(HDFS)</Option>
              <Option value="s3">Amazon S3</Option>
              <Option value="local">本地存储</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="归档描述"
          >
            <Input.TextArea placeholder="请输入归档描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataArchive;