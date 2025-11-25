import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Tabs,
  Card,
  message,
  Space,
  Popconfirm,
  Row,
  Col,
  Divider,
  Select,
  Input,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import DataSourceForm from '../components/DataSourceForm';
import DbObjectTree from '../components/DbObjectTree';
import { dataSourceApi, dbObjectApi } from '../services/api';

const { TabPane } = Tabs;

const { Title } = Typography;

const DataSourceManagement = () => {
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = DataSourceForm.useForm();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [filteredDataSources, setFilteredDataSources] = useState([]);
  const [filters, setFilters] = useState({
    type: undefined,
    subtype: undefined,
    search: undefined
  });

  const dataSourceTypes = [
    { value: 'transactional', label: '事务型', subtypes: ['mysql', 'tidb'] },
    { value: 'analytical', label: '分析型', subtypes: ['clickhouse', 'starrocks', 'elasticsearch'] },
    { value: 'log', label: '日志型', subtypes: ['sls'] }
  ];

  const getSubtypeLabel = (type, subtype) => {
    const typeObj = dataSourceTypes.find(t => t.value === type);
    if (typeObj) {
      // 对于某些特殊子类型，返回大写形式以提高可读性
      return subtype === 'elasticsearch' ? 'Elasticsearch' : subtype.toUpperCase();
    }
    return subtype;
  };

  const getTypeLabel = (type) => {
    const typeObj = dataSourceTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  useEffect(() => {
    loadDataSources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dataSources, filters]);

  const applyFilters = () => {
    let filtered = [...dataSources];
    
    // 类型筛选
    if (filters.type) {
      filtered = filtered.filter(ds => ds.type === filters.type);
    }
    
    // 子类型筛选
    if (filters.subtype) {
      filtered = filtered.filter(ds => ds.subtype === filters.subtype);
    }
    
    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ds => 
        ds.name.toLowerCase().includes(searchLower) ||
        ds.host.toLowerCase().includes(searchLower) ||
        ds.description?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredDataSources(filtered);
  };

  const loadDataSources = async () => {
    setLoading(true);
    try {
      const response = await dataSourceApi.getDataSources();
      setDataSources(response.data);
    } catch (error) {
      message.error('获取数据源列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDataSourceStats = () => {
    const stats = {
      total: dataSources.length,
      byType: {},
      bySubtype: {}
    };
    
    dataSources.forEach(ds => {
      // 按类型统计
      stats.byType[ds.type] = (stats.byType[ds.type] || 0) + 1;
      
      // 按子类型统计
      stats.bySubtype[ds.subtype] = (stats.bySubtype[ds.subtype] || 0) + 1;
    });
    
    return stats;
  };

  const dataSourceStats = getDataSourceStats();

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => getTypeLabel(text)
    },
    {
      title: '子类型',
      dataIndex: 'subtype',
      key: 'subtype',
      render: (_, record) => getSubtypeLabel(record.type, record.subtype)
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
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <span style={{ color: enabled ? 'green' : 'red' }}>
          {enabled ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {enabled ? '启用' : '禁用'}
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
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个数据源吗？"
            onConfirm={() => handleDelete(record.id)}
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
          <Button 
            type="default" 
            icon={<ApiOutlined />} 
            onClick={() => handleManageObjects(record)}
            size="small"
          >
            管理对象
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await dataSourceApi.deleteDataSource(id);
      message.success('删除成功');
      loadDataSources();
    } catch (error) {
      message.error('删除失败: ' + error.message);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRecord) {
        // 更新记录
        await dataSourceApi.updateDataSource(editingRecord.id, values);
        message.success('更新成功');
      } else {
        // 添加新记录
        await dataSourceApi.createDataSource(values);
        message.success('添加成功');
      }
      
      setIsModalVisible(false);
      loadDataSources();
    } catch (error) {
      message.error('操作失败: ' + error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleManageObjects = (record) => {
    setSelectedDataSource(record);
    setActiveTab('objects');
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();
      await dataSourceApi.testConnection(values);
      message.success('连接测试成功');
    } catch (error) {
      message.error('连接测试失败: ' + error.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>数据源管理</Title>
        <p style={{ color: '#666', marginTop: '8px' }}>管理各种类型的数据库连接和配置</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="数据源列表" key="list">
            <div style={{ padding: '24px' }}>
              {/* 统计信息 */}
              <div style={{ marginBottom: '16px' }}>
                <Card size="small" title="数据源统计">
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{dataSourceStats.total}</span>
                      <div>总计</div>
                    </div>
                    {Object.entries(dataSourceStats.byType).map(([type, count]) => (
                      <div key={type}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>{count}</span>
                        <div>{getTypeLabel(type)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <Select
                    placeholder="数据源类型"
                    style={{ width: 150 }}
                    allowClear
                    onChange={value => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    {dataSourceTypes.map(type => (
                      <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
                    ))}
                  </Select>
                  
                  <Select
                    placeholder="子类型"
                    style={{ width: 150 }}
                    allowClear
                    onChange={value => setFilters(prev => ({ ...prev, subtype: value }))}
                  >
                    {dataSourceTypes.flatMap(type => type.subtypes).map(subtype => (
                      <Select.Option key={subtype} value={subtype}>{getSubtypeLabel(type.value, subtype)}</Select.Option>
                    ))}
                  </Select>
                  
                  <Input
                    placeholder="搜索数据源名称、主机地址..."
                    style={{ width: 250 }}
                    allowClear
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增数据源
                </Button>
              </div>
              
              <Table 
                columns={columns} 
                dataSource={filteredDataSources} 
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </TabPane>
          
          <TabPane tab="对象管理" key="objects">
            <div style={{ padding: '24px' }}>
              {selectedDataSource ? (
                <Row gutter={16}>
                  <Col span={8}>
                    <Card title={`数据源: ${selectedDataSource.name}`} size="small">
                      <p><strong>类型:</strong> {selectedDataSource.type}</p>
                      <p><strong>主机:</strong> {selectedDataSource.host}:{selectedDataSource.port}</p>
                      <p><strong>用户:</strong> {selectedDataSource.username}</p>
                      
                      <Divider orientation="left">数据库对象</Divider>
                      <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                        <DbObjectTree 
                          dataSourceId={selectedDataSource.id} 
                          onNodeSelect={(node) => console.log('Selected node:', node)}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Card title="对象详情" size="small" style={{ height: '100%' }}>
                      <p>请选择左侧的数据库对象查看详细信息</p>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>请先从数据源列表中选择一个数据源进行管理</p>
                  <Button type="primary" onClick={() => setActiveTab('list')}>
                    返回数据源列表
                  </Button>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingRecord ? "编辑数据源" : "新增数据源"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="test" onClick={handleTestConnection}>
            测试连接
          </Button>,
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <DataSourceForm 
          form={form} 
          dataSourceTypes={dataSourceTypes}
          onTypeChange={() => {}}
        />
      </Modal>
    </div>
  );
};

export default DataSourceManagement;