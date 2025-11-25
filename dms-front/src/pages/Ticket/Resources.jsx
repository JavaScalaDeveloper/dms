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
  SettingOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const Resources = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [form] = Form.useForm();

  // Mock data for resource requests
  const [resourceRequests] = useState([
    { 
      id: 1, 
      title: '新建MySQL生产实例', 
      resourceType: '新建', 
      databaseType: 'MySQL', 
      status: 'approved', 
      applicant: '张三', 
      approver: '李四', 
      createdAt: '2023-05-15 10:30:00',
      spec: '8核16GB内存500GB存储'
    },
    { 
      id: 2, 
      title: '下线测试TiDB实例', 
      resourceType: '下线', 
      databaseType: 'TiDB', 
      status: 'pending', 
      applicant: '王五', 
      approver: '赵六', 
      createdAt: '2023-05-14 14:20:00',
      spec: '4核8GB内存200GB存储'
    },
    { 
      id: 3, 
      title: 'MySQL实例参数变更', 
      resourceType: '参数变更', 
      databaseType: 'MySQL', 
      status: 'processing', 
      applicant: '孙七', 
      approver: '周八', 
      createdAt: '2023-05-13 09:15:00',
      spec: 'innodb_buffer_pool_size: 8GB'
    },
  ]);

  const columns = [
    {
      title: '工单标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      width: 100,
    },
    {
      title: '数据库类型',
      dataIndex: 'databaseType',
      key: 'databaseType',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      width: 200,
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
          status === 'processing' ? 'blue' : 'red'
        }>
          {status === 'approved' ? '已批准' : 
           status === 'pending' ? '待审批' : 
           status === 'processing' ? '处理中' : '已拒绝'}
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

  const handleCreateRequest = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      message.success('资源申请已提交');
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
        <h2 style={{ margin: 0 }}>资源管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>申请和管理数据库资源</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="资源申请" key="new">
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequest}>
                  新建资源申请
                </Button>
              </div>
              
              {/* 资源申请列表 */}
              <Table 
                columns={columns} 
                dataSource={resourceRequests} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </TabPane>
          
          <TabPane tab="资源配置" key="config">
            <div style={{ padding: '24px' }}>
              <h3>资源配置规范</h3>
              <div style={{ marginTop: '16px' }}>
                <p><strong>MySQL实例推荐配置：</strong></p>
                <ul>
                  <li>小型实例：2核4GB内存，100GB存储</li>
                  <li>中型实例：4核8GB内存，500GB存储</li>
                  <li>大型实例：8核16GB内存，1TB存储</li>
                  <li>超大型实例：16核32GB内存，2TB存储</li>
                </ul>
                
                <p style={{ marginTop: '16px' }}><strong>TiDB实例推荐配置：</strong></p>
                <ul>
                  <li>测试环境：2核4GB内存，200GB存储</li>
                  <li>生产环境：8核16GB内存，1TB存储</li>
                </ul>
                
                <p style={{ marginTop: '16px' }}><strong>ClickHouse实例推荐配置：</strong></p>
                <ul>
                  <li>分析环境：8核32GB内存，2TB存储</li>
                </ul>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 新建资源申请模态框 */}
      <Modal
        title="新建资源申请"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="申请标题"
            rules={[{ required: true, message: '请输入申请标题' }]}
          >
            <Input placeholder="请输入申请标题" />
          </Form.Item>
          
          <Form.Item
            name="resourceType"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select placeholder="请选择资源类型">
              <Option value="new">新建</Option>
              <Option value="offline">下线</Option>
              <Option value="param-change">参数变更</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="databaseType"
            label="数据库类型"
            rules={[{ required: true, message: '请选择数据库类型' }]}
          >
            <Select placeholder="请选择数据库类型">
              <Option value="mysql">MySQL</Option>
              <Option value="tidb">TiDB</Option>
              <Option value="clickhouse">ClickHouse</Option>
              <Option value="elasticsearch">Elasticsearch</Option>
              <Option value="starrocks">StarRocks</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="spec"
            label="资源配置"
            rules={[{ required: true, message: '请输入资源配置' }]}
          >
            <Input.TextArea placeholder="请输入资源配置，如：8核16GB内存500GB存储" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="申请原因"
            rules={[{ required: true, message: '请输入申请原因' }]}
          >
            <Input.TextArea placeholder="请输入申请原因" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Resources;