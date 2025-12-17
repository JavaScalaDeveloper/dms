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

const GbaseManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data for instances
  const [instances, setInstances] = useState([
    { id: 1, name: '生产Gbase实例1', host: '192.168.7.10', port: 5258, username: 'admin', status: 'running' },
    { id: 2, name: '测试Gbase实例2', host: '192.168.7.11', port: 5258, username: 'test', status: 'stopped' }
  ]);

  // Mock data for graphs
  const [graphs, setGraphs] = useState([
    { id: 1, name: 'social_graph', instance: '生产Gbase实例1', nodes: 100000, edges: 500000 },
    { id: 2, name: 'knowledge_graph', instance: '生产Gbase实例1', nodes: 200000, edges: 1000000 }
  ]);

  // Mock data for nodes
  const [nodes, setNodes] = useState([
    { id: 1, name: 'user_node', graph: 'social_graph', properties: 15, size: '2MB' },
    { id: 2, name: 'product_node', graph: 'social_graph', properties: 8, size: '1MB' }
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

  // 获取过滤后的图数据
  const getFilteredGraphs = () => {
    return filterData(graphs, searchParams);
  };

  // 获取过滤后的节点数据
  const getFilteredNodes = () => {
    return filterData(nodes, searchParams);
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

  const graphColumns = [
    {
      title: '图名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属实例',
      dataIndex: 'instance',
      key: 'instance',
    },
    {
      title: '节点数',
      dataIndex: 'nodes',
      key: 'nodes',
    },
    {
      title: '边数',
      dataIndex: 'edges',
      key: 'edges',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('graph', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个图吗？"
            onConfirm={() => handleDelete('graph', record.id)}
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

  const nodeColumns = [
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属图',
      dataIndex: 'graph',
      key: 'graph',
    },
    {
      title: '属性数',
      dataIndex: 'properties',
      key: 'properties',
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
            onClick={() => handleEdit('node', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个节点吗？"
            onConfirm={() => handleDelete('node', record.id)}
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
      case 'graph':
        setGraphs(graphs.filter(item => item.id !== id));
        message.success('图删除成功');
        break;
      case 'node':
        setNodes(nodes.filter(item => item.id !== id));
        message.success('节点删除成功');
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
          case 'graph':
            setGraphs(graphs.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          case 'node':
            setNodes(nodes.map(item => 
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
          case 'graphs':
            setGraphs([...graphs, newRecord]);
            break;
          case 'nodes':
            setNodes([...nodes, newRecord]);
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

  const getGraphSearchFields = () => [
    { name: 'name', label: '图名称', placeholder: '请输入图名称' },
    { name: 'instance', label: '所属实例', placeholder: '请输入所属实例' }
  ];

  const getNodeSearchFields = () => [
    { name: 'name', label: '节点名称', placeholder: '请输入节点名称' },
    { name: 'graph', label: '所属图', placeholder: '请输入所属图' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Gbase管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>管理Gbase实例、图和节点</p>
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
                图管理
              </span>
            }
            key="graphs"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getGraphSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增图
                </Button>
              </div>
              
              <Table 
                columns={graphColumns} 
                dataSource={getFilteredGraphs()} 
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
                节点管理
              </span>
            }
            key="nodes"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getNodeSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增节点
                </Button>
              </div>
              
              <Table 
                columns={nodeColumns} 
                dataSource={getFilteredNodes()} 
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
          
          {activeTab === 'graphs' && (
            <>
              <Form.Item
                name="name"
                label="图名称"
                rules={[{ required: true, message: '请输入图名称' }]}
              >
                <Input placeholder="请输入图名称" />
              </Form.Item>
              
              <Form.Item
                name="instance"
                label="所属实例"
                rules={[{ required: true, message: '请输入所属实例' }]}
              >
                <Input placeholder="请输入所属实例" />
              </Form.Item>
              
              <Form.Item
                name="nodes"
                label="节点数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入节点数" />
              </Form.Item>
              
              <Form.Item
                name="edges"
                label="边数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入边数" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'nodes' && (
            <>
              <Form.Item
                name="name"
                label="节点名称"
                rules={[{ required: true, message: '请输入节点名称' }]}
              >
                <Input placeholder="请输入节点名称" />
              </Form.Item>
              
              <Form.Item
                name="graph"
                label="所属图"
                rules={[{ required: true, message: '请输入所属图' }]}
              >
                <Input placeholder="请输入所属图" />
              </Form.Item>
              
              <Form.Item
                name="properties"
                label="属性数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入属性数" />
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

export default GbaseManagement;