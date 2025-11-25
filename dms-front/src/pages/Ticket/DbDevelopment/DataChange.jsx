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
  EditOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { Option } = Select;

const DataChange = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data for data changes
  const [dataChanges] = useState([
    { 
      id: 1, 
      title: '修复用户手机号错误', 
      database: '生产MySQL实例1', 
      status: 'completed', 
      operator: '张三', 
      reviewer: '李四',
      createdAt: '2023-05-15 10:30:00',
      changeType: '数据修正'
    },
    { 
      id: 2, 
      title: '批量更新商品价格', 
      database: '测试TiDB实例2', 
      status: 'reviewing', 
      operator: '王五', 
      reviewer: '赵六',
      createdAt: '2023-05-14 14:20:00',
      changeType: '批量更新'
    },
    { 
      id: 3, 
      title: '初始化测试数据', 
      database: '分析ClickHouse实例1', 
      status: 'pending', 
      operator: '孙七', 
      reviewer: '周八',
      createdAt: '2023-05-13 09:15:00',
      changeType: '数据导入'
    },
  ]);

  const columns = [
    {
      title: '变更任务',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
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
          status === 'reviewing' ? 'blue' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status === 'completed' ? '已完成' : 
           status === 'reviewing' ? '审核中' : 
           status === 'pending' ? '待审核' : '失败'}
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
            <Button type="link" icon={<EditOutlined />}>编辑</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateChange = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('数据变更任务已创建');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCSV) {
        message.error('只能上传CSV文件!');
      }
      return isCSV || Upload.LIST_IGNORE;
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>数据变更</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>对数据库中的数据进行变更操作</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateChange}>
            新建变更任务
          </Button>
        </div>
        
        {/* 数据变更列表 */}
        <Table 
          columns={columns} 
          dataSource={dataChanges} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新建变更任务模态框 */}
      <Modal
        title="新建数据变更任务"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="变更任务名称"
            rules={[{ required: true, message: '请输入变更任务名称' }]}
          >
            <Input placeholder="请输入变更任务名称" />
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
            name="changeType"
            label="变更类型"
            rules={[{ required: true, message: '请选择变更类型' }]}
          >
            <Select placeholder="请选择变更类型">
              <Option value="insert">数据插入</Option>
              <Option value="update">数据更新</Option>
              <Option value="delete">数据删除</Option>
              <Option value="batch-update">批量更新</Option>
              <Option value="data-import">数据导入</Option>
              <Option value="data-fix">数据修正</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tables"
            label="变更表"
            rules={[{ required: true, message: '请选择需要变更的表' }]}
          >
            <Select mode="multiple" placeholder="请选择需要变更的表">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
              <Option value="logs">logs</Option>
            </Select>
          </Form.Item>
          
          <Divider>变更详情</Divider>
          
          <Form.Item
            name="changeCondition"
            label="变更条件"
          >
            <Input.TextArea placeholder="请输入变更条件，如：WHERE id = 123" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="changeData"
            label="变更数据"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传CSV文件</Button>
            </Upload>
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              支持CSV格式文件，用于批量数据变更
            </p>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="变更描述"
          >
            <Input.TextArea placeholder="请输入变更描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataChange;