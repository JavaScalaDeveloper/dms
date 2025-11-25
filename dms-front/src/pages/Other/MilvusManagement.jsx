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

const MilvusManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data for instances
  const [instances, setInstances] = useState([
    { id: 1, name: '生产Milvus实例1', host: '192.168.9.10', port: 19530, username: 'admin', status: 'running' },
    { id: 2, name: '测试Milvus实例2', host: '192.168.9.11', port: 19530, username: 'test', status: 'stopped' }
  ]);

  // Mock data for collections
  const [collections, setCollections] = useState([
    { id: 1, name: 'image_collection', instance: '生产Milvus实例1', dimensions: 512, vectors: 100000 },
    { id: 2, name: 'text_collection', instance: '生产Milvus实例1', dimensions: 768, vectors: 50000 }
  ]);

  // Mock data for partitions
  const [partitions, setPartitions] = useState([
    { id: 1, name: 'image_partition_1', collection: 'image_collection', vectors: 50000, size: '100MB' },
    { id: 2, name: 'image_partition_2', collection: 'image_collection', vectors: 50000, size: '100MB' }
  ]);

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

  const collectionColumns = [
    {
      title: '集合名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属实例',
      dataIndex: 'instance',
      key: 'instance',
    },
    {
      title: '维度',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: '向量数',
      dataIndex: 'vectors',
      key: 'vectors',
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

  const partitionColumns = [
    {
      title: '分区名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属集合',
      dataIndex: 'collection',
      key: 'collection',
    },
    {
      title: '向量数',
      dataIndex: 'vectors',
      key: 'vectors',
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
            onClick={() => handleEdit('partition', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分区吗？"
            onConfirm={() => handleDelete('partition', record.id)}
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
      case 'collection':
        setCollections(collections.filter(item => item.id !== id));
        message.success('集合删除成功');
        break;
      case 'partition':
        setPartitions(partitions.filter(item => item.id !== id));
        message.success('分区删除成功');
        break;
      default:
        break;
    }
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
          case 'collection':
            setCollections(collections.map(item => 
              item.id === editingRecord.id ? { ...item, ...values } : item
            ));
            break;
          case 'partition':
            setPartitions(partitions.map(item => 
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
          case 'collections':
            setCollections([...collections, newRecord]);
            break;
          case 'partitions':
            setPartitions([...partitions, newRecord]);
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

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Milvus管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>管理Milvus实例、集合和分区</p>
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
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增实例
                </Button>
              </div>
              
              <Table 
                columns={instanceColumns} 
                dataSource={instances} 
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
                集合管理
              </span>
            }
            key="collections"
          >
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增集合
                </Button>
              </div>
              
              <Table 
                columns={collectionColumns} 
                dataSource={collections} 
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
                分区管理
              </span>
            }
            key="partitions"
          >
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增分区
                </Button>
              </div>
              
              <Table 
                columns={partitionColumns} 
                dataSource={partitions} 
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
        <Form form={form} layout="vertical">
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
                name="instance"
                label="所属实例"
                rules={[{ required: true, message: '请输入所属实例' }]}
              >
                <Input placeholder="请输入所属实例" />
              </Form.Item>
              
              <Form.Item
                name="dimensions"
                label="维度"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入维度" />
              </Form.Item>
              
              <Form.Item
                name="vectors"
                label="向量数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入向量数" />
              </Form.Item>
            </>
          )}
          
          {activeTab === 'partitions' && (
            <>
              <Form.Item
                name="name"
                label="分区名称"
                rules={[{ required: true, message: '请输入分区名称' }]}
              >
                <Input placeholder="请输入分区名称" />
              </Form.Item>
              
              <Form.Item
                name="collection"
                label="所属集合"
                rules={[{ required: true, message: '请输入所属集合' }]}
              >
                <Input placeholder="请输入所属集合" />
              </Form.Item>
              
              <Form.Item
                name="vectors"
                label="向量数"
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入向量数" />
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

export default MilvusManagement;