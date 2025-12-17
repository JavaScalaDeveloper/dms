import React, { useState } from 'react';
import { 
  Tabs, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Card,
  Space,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DatabaseOutlined,
  TableOutlined
} from '@ant-design/icons';
import SearchForm from '../../components/SearchForm';

const ElasticsearchManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data for instances
  const [instances, setInstances] = useState([
    { id: 1, name: '生产ES实例1', host: '192.168.4.10', port: 9200, username: 'admin', status: 'running' },
    { id: 2, name: '测试ES实例2', host: '192.168.4.11', port: 9200, username: 'test', status: 'stopped' }
  ]);

  // Mock data for indices (替代数据库)
  const [indices, setIndices] = useState([
    { id: 1, name: 'user_logs', instance: '生产ES实例1', size: '50GB', docs: 1000000 },
    { id: 2, name: 'app_metrics', instance: '生产ES实例1', size: '30GB', docs: 500000 }
  ]);

  // Mock data for mappings (替代表)
  const [mappings, setMappings] = useState([
    { id: 1, name: 'user_mapping', index: 'user_logs', fields: 15, size: '1KB' },
    { id: 2, name: 'metric_mapping', index: 'app_metrics', fields: 8, size: '0.5KB' }
  ]);

  // 查询条件
  const [searchParams, setSearchParams] = useState({});

  // 过滤数据的方法
  const filterData = (data, params) => {
    return data.filter(item => {
      return Object.keys(params).every(key => {
        if (!params[key]) return true;
        return String(item[key]).toLowerCase().includes(String(params[key]).toLowerCase());
      });
    });
  };

  // 获取过滤后的实例数据
  const getFilteredInstances = () => {
    return filterData(instances, searchParams);
  };

  // 获取过滤后的索引数据
  const getFilteredIndices = () => {
    return filterData(indices, searchParams);
  };

  // 获取过滤后的映射数据
  const getFilteredMappings = () => {
    return filterData(mappings, searchParams);
  };

  const instanceColumns = [
    {
      title: '实例名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '主机地址',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'running' ? 'green' : 'red' }}>
          {status === 'running' ? '运行中' : '已停止'}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('instance', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个实例吗？"
            onConfirm={() => handleDelete('instance', record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const indexColumns = [
    {
      title: '索引名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属实例',
      dataIndex: 'instance',
      key: 'instance',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '文档数',
      dataIndex: 'docs',
      key: 'docs',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('index', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个索引吗？"
            onConfirm={() => handleDelete('index', record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mappingColumns = [
    {
      title: '映射名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属索引',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '字段数',
      dataIndex: 'fields',
      key: 'fields',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('mapping', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个映射吗？"
            onConfirm={() => handleDelete('mapping', record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (type, record) => {
    setEditingRecord({ ...record, type });
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (type, id) => {
    switch (type) {
      case 'instance':
        setInstances(instances.filter(item => item.id !== id));
        message.success('实例删除成功');
        break;
      case 'index':
        setIndices(indices.filter(item => item.id !== id));
        message.success('索引删除成功');
        break;
      case 'mapping':
        setMappings(mappings.filter(item => item.id !== id));
        message.success('映射删除成功');
        break;
      default:
        break;
    }
  };

  // 处理查询
  const handleSearch = (params = {}) => {
    setSearchParams(params);
  };

  // 重置查询
  const handleResetSearch = () => {
    setSearchParams({});
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        // 编辑操作
        switch (editingRecord.type) {
          case 'instance':
            setInstances(instances.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          case 'index':
            setIndices(indices.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          case 'mapping':
            setMappings(mappings.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          default:
            break;
        }
        message.success('更新成功');
      } else {
        // 新增操作
        const newRecord = { ...values, id: Date.now() };
        switch (activeTab) {
          case 'instances':
            setInstances([...instances, newRecord]);
            break;
          case 'indices':
            setIndices([...indices, newRecord]);
            break;
          case 'mappings':
            setMappings([...mappings, newRecord]);
            break;
          default:
            break;
        }
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 定义各tab的查询字段
  const getInstanceSearchFields = () => [
    { name: 'name', label: '实例名称', placeholder: '请输入实例名称' },
    { name: 'host', label: '主机地址', placeholder: '请输入主机地址' },
    { 
      name: 'status', 
      label: '状态', 
      type: 'select', 
      options: [
        { value: 'running', label: '运行中' },
        { value: 'stopped', label: '已停止' }
      ]
    }
  ];

  const getIndexSearchFields = () => [
    { name: 'name', label: '索引名称', placeholder: '请输入索引名称' },
    { name: 'instance', label: '所属实例', placeholder: '请输入所属实例' }
  ];

  const getMappingSearchFields = () => [
    { name: 'name', label: '映射名称', placeholder: '请输入映射名称' },
    { name: 'index', label: '所属索引', placeholder: '请输入所属索引' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Elasticsearch管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>管理Elasticsearch实例、索引和映射</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={
              <span>
                <DatabaseOutlined />
                实例管理
              </span>
            }
            key="instances"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getInstanceSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增实例
                </Button>
              </div>
              
              <Table 
                columns={instanceColumns} 
                dataSource={getFilteredInstances()} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </Tabs.TabPane>
          
          <Tabs.TabPane
            tab={
              <span>
                <DatabaseOutlined />
                索引管理
              </span>
            }
            key="indices"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getIndexSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增索引
                </Button>
              </div>
              
              <Table 
                columns={indexColumns} 
                dataSource={getFilteredIndices()} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </Tabs.TabPane>
          
          <Tabs.TabPane
            tab={
              <span>
                <TableOutlined />
                映射管理
              </span>
            }
            key="mappings"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getMappingSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增映射
                </Button>
              </div>
              
              <Table 
                columns={mappingColumns} 
                dataSource={getFilteredMappings()} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingRecord ? "编辑" : "新增"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {activeTab === 'instances' && (
            <>
              <Form.Item
                name="name"
                label="实例名称"
                rules={[{ required: true, message: '请输入实例名称' }]}
              >
                <Input placeholder="请输入实例名称" />
              </Form.Item>
              
              <Form.Item
                name="host"
                label="主机地址"
                rules={[{ required: true, message: '请输入主机地址' }]}
              >
                <Input placeholder="请输入主机地址" />
              </Form.Item>
              
              <Form.Item
                name="port"
                label="端口"
                rules={[{ required: true, message: '请输入端口号' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入端口号" />
              </Form.Item>
              
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              
              <Form.Item
                name="status"
                label="状态"
              >
                <Input placeholder="请输入状态" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'indices' && (
            <>
              <Form.Item
                name="name"
                label="索引名称"
                rules={[{ required: true, message: '请输入索引名称' }]}
              >
                <Input placeholder="请输入索引名称" />
              </Form.Item>
              
              <Form.Item
                name="instance"
                label="所属实例"
                rules={[{ required: true, message: '请输入所属实例' }]}
              >
                <Input placeholder="请输入所属实例" />
              </Form.Item>
              
              <Form.Item
                name="size"
                label="大小"
              >
                <Input placeholder="请输入大小" />
              </Form.Item>
              
              <Form.Item
                name="docs"
                label="文档数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入文档数" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'mappings' && (
            <>
              <Form.Item
                name="name"
                label="映射名称"
                rules={[{ required: true, message: '请输入映射名称' }]}
              >
                <Input placeholder="请输入映射名称" />
              </Form.Item>
              
              <Form.Item
                name="index"
                label="所属索引"
                rules={[{ required: true, message: '请输入所属索引' }]}
              >
                <Input placeholder="请输入所属索引" />
              </Form.Item>
              
              <Form.Item
                name="fields"
                label="字段数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入字段数" />
              </Form.Item>
              
              <Form.Item
                name="size"
                label="大小"
              >
                <Input placeholder="请输入大小" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ElasticsearchManagement;