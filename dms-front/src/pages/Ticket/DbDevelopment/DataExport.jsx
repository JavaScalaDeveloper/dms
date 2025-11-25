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
  Upload,
  Divider
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Option } = Select;

const DataExport = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for data exports
  const [dataExports] = useState([
    { 
      id: 1, 
      title: '用户数据导出', 
      database: '生产MySQL实例1', 
      status: 'completed', 
      operator: '张三', 
      createdAt: '2023-05-15 10:30:00',
      fileSize: '2.5MB',
      exportType: '全量导出'
    },
    { 
      id: 2, 
      title: '订单数据导出', 
      database: '测试TiDB实例2', 
      status: 'processing', 
      operator: '王五', 
      createdAt: '2023-05-14 14:20:00',
      fileSize: '5.2MB',
      exportType: '条件导出'
    },
    { 
      id: 3, 
      title: '日志数据导出', 
      database: '分析ClickHouse实例1', 
      status: 'pending', 
      operator: '孙七', 
      createdAt: '2023-05-13 09:15:00',
      fileSize: '10.1MB',
      exportType: '定时导出'
    },
  ]);

  const columns = [
    {
      title: '导出任务',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '导出类型',
      dataIndex: 'exportType',
      key: 'exportType',
      width: 100,
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
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
          {record.status === 'completed' && (
            <Button type="link" icon={<DownloadOutlined />}>下载</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateExport = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('数据导出任务已创建');
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
        <h2 style={{ margin: 0 }}>数据导出</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>导出数据库中的数据</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateExport}>
            新建导出任务
          </Button>
        </div>
        
        {/* 数据导出列表 */}
        <Table 
          columns={columns} 
          dataSource={dataExports} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新建导出任务模态框 */}
      <Modal
        title="新建数据导出任务"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="导出任务名称"
            rules={[{ required: true, message: '请输入导出任务名称' }]}
          >
            <Input placeholder="请输入导出任务名称" />
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
            </Select>
          </Form.Item>
          
          <Form.Item
            name="exportType"
            label="导出类型"
            rules={[{ required: true, message: '请选择导出类型' }]}
          >
            <Select placeholder="请选择导出类型">
              <Option value="full">全量导出</Option>
              <Option value="conditional">条件导出</Option>
              <Option value="scheduled">定时导出</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tables"
            label="导出表"
            rules={[{ required: true, message: '请选择需要导出的表' }]}
          >
            <Select mode="multiple" placeholder="请选择需要导出的表">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
              <Option value="logs">logs</Option>
            </Select>
          </Form.Item>
          
          <Divider>导出条件</Divider>
          
          <Form.Item
            name="condition"
            label="导出条件"
          >
            <Input.TextArea placeholder="请输入导出条件，如：WHERE created_at > '2023-01-01'" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="导出描述"
          >
            <Input.TextArea placeholder="请输入导出描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataExport;