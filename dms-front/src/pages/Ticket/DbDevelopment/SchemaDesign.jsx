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
  Tabs
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FileSearchOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const SchemaDesign = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();

  // Mock data for schema designs
  const [schemaDesigns] = useState([
    { 
      id: 1, 
      title: '用户表结构设计', 
      database: '生产MySQL实例1', 
      status: 'approved', 
      designer: '张三', 
      reviewer: '李四', 
      createdAt: '2023-05-15 10:30:00',
      version: 'v1.0'
    },
    { 
      id: 2, 
      title: '订单表结构设计', 
      database: '测试TiDB实例2', 
      status: 'pending', 
      designer: '王五', 
      reviewer: '赵六', 
      createdAt: '2023-05-14 14:20:00',
      version: 'v1.2'
    },
    { 
      id: 3, 
      title: '日志表结构设计', 
      database: '分析ClickHouse实例1', 
      status: 'reviewing', 
      designer: '孙七', 
      reviewer: '周八', 
      createdAt: '2023-05-13 09:15:00',
      version: 'v2.1'
    },
  ]);

  const columns = [
    {
      title: '设计标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={
          status === 'approved' ? 'green' : 
          status === 'pending' ? 'orange' : 
          status === 'reviewing' ? 'blue' : 'red'
        }>
          {status === 'approved' ? '已批准' : 
           status === 'pending' ? '待提交' : 
           status === 'reviewing' ? '审核中' : '已拒绝'}
        </Tag>
      ),
    },
    {
      title: '设计人',
      dataIndex: 'designer',
      key: 'designer',
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
          <Button type="link" icon={<FileSearchOutlined />}>审核</Button>
        </Space>
      ),
    },
  ];

  const handleCreateDesign = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('结构设计已创建');
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
        <h2 style={{ margin: 0 }}>结构设计</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>设计和管理数据库表结构</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="结构设计列表" key="list">
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateDesign}>
                  新建结构设计
                </Button>
              </div>
              
              {/* 结构设计列表 */}
              <Table 
                columns={columns} 
                dataSource={schemaDesigns} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </TabPane>
          
          <TabPane tab="设计规范" key="spec">
            <div style={{ padding: '24px' }}>
              <h3>数据库结构设计规范</h3>
              <div style={{ marginTop: '16px' }}>
                <p>1. 表名应使用小写字母，多个单词以下划线分隔</p>
                <p>2. 字段名应具有明确的业务含义</p>
                <p>3. 每个表必须包含创建时间和更新时间字段</p>
                <p>4. 主键应使用自增ID或UUID</p>
                <p>5. 索引设计应考虑查询性能</p>
                <p>6. 字段类型应根据数据特点选择合适类型</p>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 新建结构设计模态框 */}
      <Modal
        title="新建结构设计"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="设计标题"
            rules={[{ required: true, message: '请输入设计标题' }]}
          >
            <Input placeholder="请输入设计标题" />
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
            name="description"
            label="设计描述"
            rules={[{ required: true, message: '请输入设计描述' }]}
          >
            <Input.TextArea placeholder="请输入设计描述" rows={4} />
          </Form.Item>
          
          <Form.Item
            name="tables"
            label="涉及表"
          >
            <Select mode="tags" placeholder="请输入涉及的表名">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchemaDesign;