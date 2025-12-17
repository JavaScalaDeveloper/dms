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

const MongodbManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data for instances
  const [instances, setInstances] = useState([
    { id: 1, name: '生产MongoDB实例1', host: '192.168.6.10', port: 27017, username: 'admin', status: 'running' },
    { id: 2, name: '测试MongoDB实例2', host: '192.168.6.11', port: 27017, username: 'test', status: 'stopped' }
  ]);

  // Mock data for databases
  const [databases, setDatabases] = useState([
    { id: 1, name: 'production_db', instance: '生产MongoDB实例1', size: '15GB', collections: 20 },
    { id: 2, name: 'test_db', instance: '测试MongoDB实例2', size: '3GB', collections: 8 }
  ]);

  // Mock data for collections
  const [collections, setCollections] = useState([
    { id: 1, name: 'users', database: 'production_db', documents: 10000, size: '5MB' },
    { id: 2, name: 'orders', database: 'production_db', documents: 50000, size: '15MB' }
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

  // 获取过滤后的数据库数据
  const getFilteredDatabases = () => {
    return filterData(databases, searchParams);
  };

  // 获取过滤后的集合数据
  const getFilteredCollections = () => {
    return filterData(collections, searchParams);
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

  const databaseColumns = [
    {
      title: '数据库名称',
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
      title: '集合数',
      dataIndex: 'collections',
      key: 'collections',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('database', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个数据库吗？"
            onConfirm={() => handleDelete('database', record.id)}
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

  const collectionColumns = [
    {
      title: '集合名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '文档数',
      dataIndex: 'documents',
      key: 'documents',
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
            onClick={() => handleEdit('collection', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个集合吗？"
            onConfirm={() => handleDelete('collection', record.id)}
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
      case 'database':
        setDatabases(databases.filter(item => item.id !== id));
        message.success('数据库删除成功');
        break;
      case 'collection':
        setCollections(collections.filter(item => item.id !== id));
        message.success('集合删除成功');
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
          case 'database':
            setDatabases(databases.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          case 'collection':
            setCollections(collections.map(item => 
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
          case 'databases':
            setDatabases([...databases, newRecord]);
            break;
          case 'collections':
            setCollections([...collections, newRecord]);
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

  const getDatabaseSearchFields = () => [
    { name: 'name', label: '数据库名称', placeholder: '请输入数据库名称' },
    { name: 'instance', label: '所属实例', placeholder: '请输入所属实例' }
  ];

  const getCollectionSearchFields = () => [
    { name: 'name', label: '集合名称', placeholder: '请输入集合名称' },
    { name: 'database', label: '所属数据库', placeholder: '请输入所属数据库' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>MongoDB管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>管理MongoDB实例、数据库和集合</p>
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
                数据库管理
              </span>
            }
            key="databases"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getDatabaseSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增数据库
                </Button>
              </div>
              
              <Table 
                columns={databaseColumns} 
                dataSource={getFilteredDatabases()} 
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
                集合管理
              </span>
            }
            key="collections"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getCollectionSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增集合
                </Button>
              </div>
              
              <Table 
                columns={collectionColumns} 
                dataSource={getFilteredCollections()} 
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
          
          {activeTab === 'databases' && (
            <>
              <Form.Item
                name="name"
                label="数据库名称"
                rules={[{ required: true, message: '请输入数据库名称' }]}
              >
                <Input placeholder="请输入数据库名称" />
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
                name="collections"
                label="集合数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入集合数" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'collections' && (
            <>
              <Form.Item
                name="name"
                label="集合名称"
                rules={[{ required: true, message: '请输入集合名称' }]}
              >
                <Input placeholder="请输入集合名称" />
              </Form.Item>
              
              <Form.Item
                name="database"
                label="所属数据库"
                rules={[{ required: true, message: '请输入所属数据库' }]}
              >
                <Input placeholder="请输入所属数据库" />
              </Form.Item>
              
              <Form.Item
                name="documents"
                label="文档数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入文档数" />
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

export default MongodbManagement;