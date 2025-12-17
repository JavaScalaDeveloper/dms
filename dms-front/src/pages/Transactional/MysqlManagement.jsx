import React, { useState, useEffect } from 'react';
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
  Popconfirm,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DatabaseOutlined,
  TableOutlined
} from '@ant-design/icons';
import { mysqlInstanceApi, mysqlDatabaseApi, mysqlTableApi } from '../../services/mysqlApi';
import SearchForm from '../../components/SearchForm';

const { Option } = Select;

const MysqlManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  
  // 实例数据
  const [instances, setInstances] = useState([]);
  const [loadingInstances, setLoadingInstances] = useState(false);
  
  // 数据库数据
  const [databases, setDatabases] = useState([]);
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  
  // 表数据
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);

  // 查询条件
  const [searchParams, setSearchParams] = useState({});

  // 获取实例数据
  const fetchInstances = async (params = {}) => {
    setLoadingInstances(true);
    try {
      const response = await mysqlInstanceApi.getInstances(params);
      setInstances(response.data || []);
    } catch (error) {
      message.error('获取实例数据失败: ' + error.message);
    } finally {
      setLoadingInstances(false);
    }
  };

  // 获取数据库数据
  const fetchDatabases = async (params = {}) => {
    setLoadingDatabases(true);
    try {
      const response = await mysqlDatabaseApi.getDatabases(params);
      setDatabases(response.data || []);
    } catch (error) {
      message.error('获取数据库数据失败: ' + error.message);
    } finally {
      setLoadingDatabases(false);
    }
  };

  // 获取表数据
  const fetchTables = async (params = {}) => {
    setLoadingTables(true);
    try {
      const response = await mysqlTableApi.getTables(params);
      setTables(response.data || []);
    } catch (error) {
      message.error('获取表数据失败: ' + error.message);
    } finally {
      setLoadingTables(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 监听环境字段变化，确保关联实例选择框正确显示/隐藏
  useEffect(() => {
    const currentEnv = form.getFieldValue('env');
    // 如果当前环境不是dev，则清空关联实例的值
    if (currentEnv !== 'dev') {
      form.setFieldsValue({
        relatedTestInstance: undefined,
        relatedPreInstance: undefined,
        relatedPrdInstance: undefined
      });
    }
  }, [form.getFieldValue('env')]);

  // 切换标签页时刷新数据
  useEffect(() => {
    switch (activeTab) {
      case 'instances':
        fetchInstances(searchParams);
        break;
      case 'databases':
        fetchDatabases(searchParams);
        break;
      case 'tables':
        fetchTables(searchParams);
        break;
      default:
        break;
    }
  }, [activeTab]);

  // 处理查询
  const handleSearch = (params = {}) => {
    setSearchParams(params);
    switch (activeTab) {
      case 'instances':
        fetchInstances(params);
        break;
      case 'databases':
        fetchDatabases(params);
        break;
      case 'tables':
        fetchTables(params);
        break;
      default:
        break;
    }
  };

  // 重置查询
  const handleResetSearch = () => {
    handleSearch({});
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
      title: '环境',
      dataIndex: 'env',
      key: 'env',
      render: (env) => {
        const envMap = {
          'prd': { text: '生产环境', color: 'red' },
          'pre': { text: '预发布环境', color: 'red' },
          'test': { text: '测试环境', color: 'blue' },
          'dev': { text: '开发环境', color: 'blue' }
        };
        
        const envInfo = envMap[env] || { text: env || '未知环境', color: 'default' };
        
        return (
          <span style={{ color: envInfo.color }}>
            {envInfo.text}
          </span>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
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
      title: '所属实例域名',
      dataIndex: 'instanceHost',
      key: 'instanceHost',
      render: (instanceHost) => {
        const instance = instances.find(inst => inst.host === instanceHost);
        return instance ? `${instance.name} (${instance.host}:${instance.port})` : instanceHost;
      }
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '表数量',
      dataIndex: 'tableCount',
      key: 'tableCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
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

  const tableColumns = [
    {
      title: '表名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属数据库',
      dataIndex: 'dbName',
      key: 'dbName',
    },
    {
      title: '所属实例',
      dataIndex: 'instanceHost',
      key: 'instanceHost',
    },
    {
      title: '行数',
      dataIndex: 'rowCount',
      key: 'rowCount',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      render: (text) => text ? new Date(text).toLocaleString() : ''
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit('table', record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个表吗？"
            onConfirm={() => handleDelete('table', record.id)}
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
    // 移除时间字段，避免表单验证问题
    const formData = { ...record };
    delete formData.createTime;
    delete formData.modifyTime;
    
    // 确保环境字段正确设置
    if (!formData.env) {
      formData.env = 'dev'; // 默认值
    }
    
    // 确保关联实例字段正确设置
    if (formData.env === 'dev') {
      // 如果环境是开发环境，确保关联实例字段存在
      if (formData.relatedTestInstance === undefined) {
        formData.relatedTestInstance = null;
      }
      if (formData.relatedPreInstance === undefined) {
        formData.relatedPreInstance = null;
      }
      if (formData.relatedPrdInstance === undefined) {
        formData.relatedPrdInstance = null;
      }
    }
    
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  };

  const handleDelete = async (type, id) => {
    try {
      switch (type) {
        case 'instance':
          await mysqlInstanceApi.deleteInstance(id);
          message.success('实例删除成功');
          fetchInstances(searchParams);
          break;
        case 'database':
          await mysqlDatabaseApi.deleteDatabase(id);
          message.success('数据库删除成功');
          fetchDatabases(searchParams);
          break;
        case 'table':
          await mysqlTableApi.deleteTable(id);
          message.success('表删除成功');
          fetchTables(searchParams);
          break;
        default:
          break;
      }
    } catch (error) {
      message.error('删除失败: ' + error.message);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 如果是开发环境，确保关联实例信息也被保存
      if (values.env === 'dev') {
        // 关联实例信息已在values中，直接保存即可
      }
      
      if (editingRecord) {
        // 编辑操作
        switch (editingRecord.type) {
          case 'instance':
            // 修复：将ID合并到values对象中，而不是作为单独的参数传递
            await mysqlInstanceApi.updateInstance({...values, id: editingRecord.id});
            message.success('实例更新成功');
            fetchInstances(searchParams);
            break;
          case 'database':
            // 修复：将ID合并到values对象中，而不是作为单独的参数传递
            await mysqlDatabaseApi.updateDatabase({...values, id: editingRecord.id});
            message.success('数据库更新成功');
            fetchDatabases(searchParams);
            break;
          case 'table':
            // 修复：将ID合并到values对象中，而不是作为单独的参数传递
            await mysqlTableApi.updateTable({...values, id: editingRecord.id});
            message.success('表更新成功');
            fetchTables(searchParams);
            break;
          default:
            break;
        }
      } else {
        // 新增操作
        switch (activeTab) {
          case 'instances':
            await mysqlInstanceApi.createInstance(values);
            message.success('实例添加成功');
            fetchInstances(searchParams);
            break;
          case 'databases':
            await mysqlDatabaseApi.createDatabase(values);
            message.success('数据库添加成功');
            fetchDatabases(searchParams);
            break;
          case 'tables':
            await mysqlTableApi.createTable(values);
            message.success('表添加成功');
            fetchTables(searchParams);
            break;
          default:
            break;
        }
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('操作失败: ' + error.message);
    }
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
    },
    { 
      name: 'env', 
      label: '环境', 
      type: 'select', 
      options: [
        { value: 'prd', label: '生产环境' },
        { value: 'pre', label: '预发布环境' },
        { value: 'test', label: '测试环境' },
        { value: 'dev', label: '开发环境' }
      ]
    }
  ];

  const getDatabaseSearchFields = () => [
    { name: 'name', label: '数据库名称', placeholder: '请输入数据库名称' },
    { name: 'instanceHost', label: '所属实例', placeholder: '请输入所属实例' }
  ];

  const getTableSearchFields = () => [
    { name: 'name', label: '表名称', placeholder: '请输入表名称' },
    { name: 'dbName', label: '所属数据库', placeholder: '请输入所属数据库' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>MySQL管理</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>管理MySQL实例、数据库和表</p>
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
                  loading={loadingInstances}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增实例
                </Button>
              </div>
              
              <Table 
                columns={instanceColumns} 
                dataSource={instances} 
                loading={loadingInstances}
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
                  loading={loadingDatabases}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增数据库
                </Button>
              </div>
              
              <Table 
                columns={databaseColumns} 
                dataSource={databases} 
                loading={loadingDatabases}
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
                表管理
              </span>
            }
            key="tables"
          >
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                <SearchForm 
                  fields={getTableSearchFields()} 
                  onSearch={handleSearch} 
                  onReset={handleResetSearch}
                  loading={loadingTables}
                />
              </div>
              
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增表
                </Button>
              </div>
              
              <Table 
                columns={tableColumns} 
                dataSource={tables} 
                loading={loadingTables}
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
                <Input placeholder="请输入主机地址" disabled={!!editingRecord} />
              </Form.Item>
              
              <Form.Item
                name="port"
                label="端口"
                rules={[{ required: true, message: '请输入端口号' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入端口号" />
              </Form.Item>
              
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="running">运行中</Option>
                  <Option value="stopped">已停止</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="env"
                label="环境"
              >
                <Select 
                  placeholder="请选择环境"
                  onChange={(value) => {
                    // 当环境改变时，清空关联实例的值
                    if (value !== 'dev') {
                      form.setFieldsValue({
                        relatedTestInstance: undefined,
                        relatedPreInstance: undefined,
                        relatedPrdInstance: undefined
                      });
                    }
                    // 触发表单重新渲染以正确显示/隐藏关联实例选择框
                    form.setFieldsValue({ env: value });
                  }}
                >
                  <Option value="prd">生产环境</Option>
                  <Option value="pre">预发布环境</Option>
                  <Option value="test">测试环境</Option>
                  <Option value="dev">开发环境</Option>
                </Select>
              </Form.Item>
              
              {/* 关联实例选择框 - 仅在开发环境时显示 */}
              {form.getFieldValue('env') === 'dev' && (
                <>
                  <Form.Item
                    name="relatedTestInstance"
                    label="关联测试实例"
                  >
                    <Select 
                      showSearch
                      placeholder="请选择关联的测试实例"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {instances
                        .filter(instance => instance.env === 'test')
                        .map(instance => (
                          <Option key={instance.host} value={instance.host}>
                            {instance.name} ({instance.host}:{instance.port})
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="relatedPreInstance"
                    label="关联预发实例"
                  >
                    <Select 
                      showSearch
                      placeholder="请选择关联的预发实例"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {instances
                        .filter(instance => instance.env === 'pre')
                        .map(instance => (
                          <Option key={instance.host} value={instance.host}>
                            {instance.name} ({instance.host}:{instance.port})
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="relatedPrdInstance"
                    label="关联生产实例"
                  >
                    <Select 
                      showSearch
                      placeholder="请选择关联的生产实例"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {instances
                        .filter(instance => instance.env === 'prd')
                        .map(instance => (
                          <Option key={instance.host} value={instance.host}>
                            {instance.name} ({instance.host}:{instance.port})
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </>
              )}
              
              <Form.Item
                name="creator"
                label="创建人"
              >
                <Input placeholder="请输入创建人" />
              </Form.Item>
              
              <Form.Item
                name="modifier"
                label="修改人"
              >
                <Input placeholder="请输入修改人" />
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
                name="instanceHost"
                label="所属实例域名"
                rules={[{ required: true, message: '请选择所属实例' }]}
              >
                <Select placeholder="请选择所属实例">
                  {instances.map(instance => (
                    <Option key={instance.host} value={instance.host}>
                      {instance.name} ({instance.host}:{instance.port})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {/* 新增和修改数据库时不需要填写大小和数量 */}
              {!editingRecord && (
                <>
                  <Form.Item
                    name="creator"
                    label="创建人"
                  >
                    <Input placeholder="请输入创建人" />
                  </Form.Item>
                  
                  <Form.Item
                    name="modifier"
                    label="修改人"
                  >
                    <Input placeholder="请输入修改人" />
                  </Form.Item>
                </>
              )}
            </>
          )}
          
          {activeTab === 'tables' && (
            <>
              <Form.Item
                name="name"
                label="表名称"
                rules={[{ required: true, message: '请输入表名称' }]}
              >
                <Input placeholder="请输入表名称" />
              </Form.Item>
              
              <Form.Item
                name="databaseId"
                label="所属数据库"
                rules={[{ required: true, message: '请选择所属数据库' }]}
              >
                <Select 
                  showSearch
                  placeholder="请选择所属数据库"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {databases.map(database => (
                    <Option 
                      key={database.id} 
                      value={database.id}
                      dbName={database.name}
                      instanceHost={database.instanceHost}
                    >
                      {database.name} ({database.instanceHost})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              {/* 新增和修改表时不需要填写行数和大小 */}
              {!editingRecord && (
                <>
                  <Form.Item
                    name="creator"
                    label="创建人"
                  >
                    <Input placeholder="请输入创建人" />
                  </Form.Item>
                  
                  <Form.Item
                    name="modifier"
                    label="修改人"
                  >
                    <Input placeholder="请输入修改人" />
                  </Form.Item>
                </>
              )}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default MysqlManagement;