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
  Steps,
  Divider
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  SyncOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Step } = Steps;

const SchemaSync = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  // Mock data for schema syncs
  const [schemaSyncs] = useState([
    { 
      id: 1, 
      title: '生产环境表结构同步', 
      sourceDb: '开发MySQL实例', 
      targetDb: '生产MySQL实例', 
      status: 'completed', 
      operator: '张三', 
      createdAt: '2023-05-15 10:30:00',
      syncType: '增量同步'
    },
    { 
      id: 2, 
      title: '测试环境表结构同步', 
      sourceDb: '开发TiDB实例', 
      targetDb: '测试TiDB实例', 
      status: 'running', 
      operator: '王五', 
      createdAt: '2023-05-14 14:20:00',
      syncType: '全量同步'
    },
    { 
      id: 3, 
      title: '分析环境表结构同步', 
      sourceDb: '生产MySQL实例', 
      targetDb: '分析ClickHouse实例', 
      status: 'pending', 
      operator: '孙七', 
      createdAt: '2023-05-13 09:15:00',
      syncType: '增量同步'
    },
  ]);

  const columns = [
    {
      title: '同步任务',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '源数据库',
      dataIndex: 'sourceDb',
      key: 'sourceDb',
    },
    {
      title: '目标数据库',
      dataIndex: 'targetDb',
      key: 'targetDb',
    },
    {
      title: '同步类型',
      dataIndex: 'syncType',
      key: 'syncType',
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
          status === 'running' ? 'blue' : 
          status === 'pending' ? 'orange' : 'red'
        }>
          {status === 'completed' ? '已完成' : 
           status === 'running' ? '执行中' : 
           status === 'pending' ? '待执行' : '失败'}
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
            <Button type="link" icon={<PlayCircleOutlined />}>执行</Button>
          )}
          <Button type="link" icon={<SyncOutlined />}>重新同步</Button>
        </Space>
      ),
    },
  ];

  const handleCreateSync = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('结构同步任务已创建');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: '选择数据库',
      content: (
        <div>
          <Form.Item
            name="sourceDb"
            label="源数据库"
            rules={[{ required: true, message: '请选择源数据库' }]}
          >
            <Select placeholder="请选择源数据库">
              <Option value="dev-mysql">开发MySQL实例</Option>
              <Option value="dev-tidb">开发TiDB实例</Option>
              <Option value="prod-mysql">生产MySQL实例</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="targetDb"
            label="目标数据库"
            rules={[{ required: true, message: '请选择目标数据库' }]}
          >
            <Select placeholder="请选择目标数据库">
              <Option value="test-mysql">测试MySQL实例</Option>
              <Option value="test-tidb">测试TiDB实例</Option>
              <Option value="prod-mysql">生产MySQL实例</Option>
              <Option value="analytical-ch">分析ClickHouse实例</Option>
            </Select>
          </Form.Item>
        </div>
      ),
    },
    {
      title: '配置同步',
      content: (
        <div>
          <Form.Item
            name="syncType"
            label="同步类型"
            rules={[{ required: true, message: '请选择同步类型' }]}
          >
            <Select placeholder="请选择同步类型">
              <Option value="full">全量同步</Option>
              <Option value="incremental">增量同步</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tables"
            label="同步表"
            rules={[{ required: true, message: '请选择需要同步的表' }]}
          >
            <Select mode="multiple" placeholder="请选择需要同步的表">
              <Option value="users">users</Option>
              <Option value="orders">orders</Option>
              <Option value="products">products</Option>
              <Option value="logs">logs</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="同步描述"
          >
            <Input.TextArea placeholder="请输入同步描述" rows={4} />
          </Form.Item>
        </div>
      ),
    },
    {
      title: '确认信息',
      content: (
        <div>
          <p><strong>源数据库:</strong> {form.getFieldValue('sourceDb')}</p>
          <p><strong>目标数据库:</strong> {form.getFieldValue('targetDb')}</p>
          <p><strong>同步类型:</strong> {form.getFieldValue('syncType') === 'full' ? '全量同步' : '增量同步'}</p>
          <p><strong>同步表:</strong> {form.getFieldValue('tables')?.join(', ')}</p>
          <Divider />
          <p>请确认以上信息无误后提交同步任务。</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>结构同步</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>同步不同环境间的数据库表结构</p>
      </div>
      
      <Card bodyStyle={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateSync}>
            新建同步任务
          </Button>
        </div>
        
        {/* 结构同步列表 */}
        <Table 
          columns={columns} 
          dataSource={schemaSyncs} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 新建同步任务模态框 */}
      <Modal
        title="新建结构同步任务"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          currentStep > 0 && (
            <Button key="back" onClick={prev}>
              上一步
            </Button>
          ),
          currentStep < steps.length - 1 && (
            <Button key="next" type="primary" onClick={next}>
              下一步
            </Button>
          ),
          currentStep === steps.length - 1 && (
            <Button key="submit" type="primary" onClick={handleOk}>
              提交
            </Button>
          ),
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        
        <Form form={form} layout="vertical">
          {steps[currentStep].content}
        </Form>
      </Modal>
    </div>
  );
};

export default SchemaSync;