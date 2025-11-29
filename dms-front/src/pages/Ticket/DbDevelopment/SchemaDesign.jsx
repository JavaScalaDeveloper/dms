import React, { useState, useEffect } from 'react';
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
  Tabs,
  Steps,
  Row,
  Col,
  Divider,
  Tree,
  Dropdown,
  Menu,
  Typography,
  InputNumber,
  Checkbox,
  Radio,
  Switch
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  FileSearchOutlined,
  SearchOutlined,
  DownOutlined,
  DeleteOutlined,
  SaveOutlined,
  DownloadOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'; // 使用useNavigate替代useHistory
import { schemaDesignApi, mysqlDatabaseApi, tableStructureDesignApi } from '../../../services/mysqlApi';

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const { TreeNode } = Tree;
const { Text } = Typography;

const SchemaDesign = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();
  const [designForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [workOrder, setWorkOrder] = useState(null);
  const [workOrderSubmitting, setWorkOrderSubmitting] = useState(false);
  const [currentLevel3Tab, setCurrentLevel3Tab] = useState('project-home');
  const [selectedTables, setSelectedTables] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null); // 添加selectedColumn状态
  const [tableColumns, setTableColumns] = useState([
    { key: 1, id: 1, status: '新增', name: 'id', type: 'BIGINT', length: '', nullable: false, comment: '主键ID' },
    { key: 2, id: 2, status: '新增', name: 'create_time', type: 'DATETIME', length: '', nullable: false, comment: '创建时间', editable: true },
    { key: 3, id: 3, status: '新增', name: 'update_time', type: 'DATETIME', length: '', nullable: false, comment: '更新时间', editable: true }
  ]);
  const [tableIndexes, setTableIndexes] = useState([
    { key: 1, id: 1, status: '新增', name: 'PRIMARY', type: 'Primary', columns: ['id'] }
  ]);
  
  // 添加执行变更弹窗相关的状态
  const [isExecuteModalVisible, setIsExecuteModalVisible] = useState(false);
  const [executeForm] = Form.useForm();
  
  // 添加查询相关的状态
  const [searchTitle, setSearchTitle] = useState('');
  const [filteredSchemaDesigns, setFilteredSchemaDesigns] = useState([]);
  
  // React Router Hooks
  const location = useLocation();
  const history = useNavigate();

  // 结构设计数据
  const [schemaDesigns, setSchemaDesigns] = useState([]);
  
  // 工单下的表结构设计数据
  const [tableStructureDesigns, setTableStructureDesigns] = useState([]);
  
  // 获取结构设计列表数据
  const fetchSchemaDesigns = async () => {
    setLoading(true);
    try {
      const response = await schemaDesignApi.getWorkOrders();
      // 保留原始数据结构，不做字段名转换
      const formattedData = response.data.map(item => ({
        ...item,
        id: item.id,
        title: item.projectName || '', // 保持projectName字段，同时添加title别名用于显示
        database: item.databaseType || '', // 保持databaseType字段，同时添加database别名用于显示
        status: item.status === 'approved' ? 'approved' : 
               item.status === 'created' ? 'pending' : 
               item.status === 'reviewing' ? 'reviewing' : 'rejected',
        designer: item.creator || '-', // creator字段可能不存在
        reviewer: item.reviewer || '-', // reviewer字段可能不存在
        createdAt: item.createTime || new Date().toISOString(), // createTime字段可能不存在
        version: item.version || 'v1.0'
      }));
      setSchemaDesigns(formattedData);
    } catch (error) {
      console.error('获取结构设计列表失败:', error);
      message.error('获取结构设计列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取工单下的表结构设计数据
  const fetchTableStructureDesigns = async (workOrderId) => {
    try {
      const response = await tableStructureDesignApi.listByWorkOrderId(workOrderId);
      if (response.success) {
        setTableStructureDesigns(response.data || []);
      } else {
        message.error(`获取表结构设计数据失败: ${response.message || '未知错误'}`);
        setTableStructureDesigns([]);
      }
    } catch (error) {
      console.error('获取表结构设计数据失败:', error);
      message.error('获取表结构设计数据失败，请稍后重试');
      setTableStructureDesigns([]);
    }
  };

  // 当步骤变为1且有工单ID时，加载表结构设计数据（用于编辑场景）
  useEffect(() => {
    // 从URL参数中获取workOrderId
    const params = new URLSearchParams(location.search);
    const workOrderId = params.get('workOrderId');
    
    if (currentStep === 1 && workOrderId) {
      // 加载表结构设计数据
      fetchTableStructureDesigns(workOrderId);
      // 注意：根据项目配置要求，禁止清除浏览器中的参数（如workOrderId）
      // history('', { replace: true });
    }
  }, [currentStep, location.search, history]);
  
  // 当工单改变时，获取工单下的表结构设计数据
  useEffect(() => {
    if (workOrder?.id) {
      fetchTableStructureDesigns(workOrder.id);
    } else {
      setTableStructureDesigns([]);
    }
  }, [workOrder?.id]);

  // 当步骤变为1时，确保加载表结构设计数据
  useEffect(() => {
    if (currentStep === 1 && workOrder?.id) {
      fetchTableStructureDesigns(workOrder.id);
    }
  }, [currentStep, workOrder?.id]);
  
  // 组件加载时获取数据
  useEffect(() => {
    fetchSchemaDesigns();
  }, []);

  // 处理查询
  const handleSearch = () => {
    if (!searchTitle.trim()) {
      // 如果搜索标题为空，显示所有数据
      setFilteredSchemaDesigns(schemaDesigns);
    } else {
      // 根据设计标题过滤数据
      const filtered = schemaDesigns.filter(item => 
        item.title && item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setFilteredSchemaDesigns(filtered);
    }
  };

  // 重置查询
  const handleResetSearch = () => {
    setSearchTitle('');
    setFilteredSchemaDesigns(schemaDesigns);
  };

  // 当原始数据发生变化时，更新过滤后的数据
  useEffect(() => {
    setFilteredSchemaDesigns(schemaDesigns);
  }, [schemaDesigns]);

  // 处理URL参数变化
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workOrderId = params.get('workOrderId');
    
    if (workOrderId) {
      // 查找对应的工单数据
      const foundWorkOrder = schemaDesigns.find(item => item.id == workOrderId);
      if (foundWorkOrder) {
        // 设置工单信息
        setWorkOrder(foundWorkOrder);
        // 设置当前步骤为0（创建工单步骤）
        setCurrentStep(0);
        // 切换到设计标签页
        setActiveTab(`design-${foundWorkOrder.id}`);
        // 重置表单并填充数据
        designForm.resetFields();
        designForm.setFieldsValue({
          projectName: foundWorkOrder.projectName || '',
          databaseType: foundWorkOrder.databaseType || 'MySQL',
          changeBaseline: foundWorkOrder.changeBaseline || undefined,
          projectBackground: foundWorkOrder.projectBackground || '',
          relatedPerson: foundWorkOrder.relatedPerson || ''
        });
        // 注意：根据项目配置要求，禁止清除浏览器中的参数（如workOrderId）
        // 确保编辑时能正常回显数据
      }
    }
  }, [location.search, schemaDesigns, designForm]);

  // 数据库列表状态
  const [databases, setDatabases] = useState([]);
  const [databasesLoading, setDatabasesLoading] = useState(false);
  
  // 模拟数据库数据作为后备
  const mockDatabases = [
    { id: 1, name: '生产MySQL实例1', host: '192.168.1.10', type: 'MySQL' },
    { id: 2, name: '测试MySQL实例2', host: '192.168.1.11', type: 'MySQL' },
    { id: 3, name: '开发MySQL实例3', host: '192.168.1.12', type: 'MySQL' }
  ];
  
  // 获取MySQL数据库列表
  const fetchMySQLDatabases = async () => {
    console.log('开始获取MySQL数据库列表...');
    setDatabasesLoading(true);
    
    // 立即显示模拟数据，提升用户体验
    setDatabases(mockDatabases);
    
    try {
      console.log('尝试调用API获取真实数据库列表...');
      const response = await mysqlDatabaseApi.getDatabases();
      console.log('获取数据库列表成功:', response);
      // 如果API调用成功且返回了数据，则使用真实数据
      if (response.data && response.data.length > 0) {
        setDatabases(response.data);
        message.success('成功获取最新数据库列表');
      }
    } catch (error) {
      console.error('获取MySQL数据库列表失败:', error);
      message.warning('使用模拟数据库列表，真实数据获取失败');
      // 继续使用之前设置的模拟数据
    } finally {
      setDatabasesLoading(false);
    }
  };
  
  // 监听数据库类型变化，获取相应的数据库列表
  const handleDatabaseTypeChange = (value) => {
    console.log('数据库类型变更为:', value);
    // 先将变更的值设置到表单中
    designForm.setFieldValue('databaseType', value);
    if (value === 'MySQL') {
      fetchMySQLDatabases();
    } else {
      // 清空数据库列表
      setDatabases([]);
    }
  };
  
  // 组件加载时检查初始数据库类型
  useEffect(() => {
    // 页面加载时主动获取MySQL数据库列表
    console.log('组件加载，主动获取MySQL数据库列表');
    fetchMySQLDatabases();
  }, []);

  // Mock data for tables
  const [tables] = useState([
    { 
      id: 1, 
      name: 'users', 
      columns: [
        { id: 1, name: 'id', type: 'BIGINT', length: '', nullable: false, comment: '主键ID' },
        { id: 2, name: 'username', type: 'VARCHAR', length: '50', nullable: false, comment: '用户名' },
        { id: 3, name: 'email', type: 'VARCHAR', length: '100', nullable: true, comment: '邮箱' }
      ],
      indexes: [
        { id: 1, name: 'PRIMARY', type: 'Primary', columns: ['id'] },
        { id: 2, name: 'idx_username', type: 'Unique', columns: ['username'] }
      ]
    },
    { 
      id: 2, 
      name: 'orders', 
      columns: [
        { id: 1, name: 'id', type: 'BIGINT', length: '', nullable: false, comment: '主键ID' },
        { id: 2, name: 'user_id', type: 'BIGINT', length: '', nullable: false, comment: '用户ID' },
        { id: 3, name: 'amount', type: 'DECIMAL', length: '10,2', nullable: false, comment: '订单金额' }
      ],
      indexes: [
        { id: 1, name: 'PRIMARY', type: 'Primary', columns: ['id'] },
        { id: 2, name: 'idx_user_id', type: 'Normal', columns: ['user_id'] }
      ]
    }
  ]);

  const columns = [
    {
      title: '工单ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => (
        <Button type="link" onClick={() => handleEditWorkOrder({ id })}>
          {id}
        </Button>
      ),
    },
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
          {record.status === 'pending' && (
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditWorkOrder(record)}>编辑</Button>
          )}
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteColumn(record.key)}
            // id列不允许删除
            disabled={record.key === 1}
          />
        </Space>
      ),
    },
  ];

  // 处理导入SQL语句按钮点击事件
  const handleImportSql = () => {
    // 如果已经在新建物理表标签页中，只需要切换到表设计tab
    if (activeTab.startsWith('new-table-')) {
      setCurrentLevel3Tab('table-design');
    } else {
      // 否则创建一个新的物理表设计标签页
      const newTabKey = `new-table-${Date.now()}`;
      setActiveTab(newTabKey);
      // 设置默认显示项目首页tab
      setCurrentLevel3Tab('project-home');
    }
    message.info('SQL导入功能正在开发中...');
  };
  const handleCreateDesign = () => {
    const tempId = Date.now();
    const newWorkOrder = {
      id: tempId,
      projectName: '',
      projectBackground: '',
      databaseType: 'MySQL',
      changeBaseline: undefined,
      relatedPerson: '',
      status: 'draft',
      isTemporary: true
    };
    setWorkOrder(newWorkOrder);
    setCurrentStep(0); // 从第0步开始
    setActiveTab(`design-${tempId}`);
    designForm.resetFields();
    designForm.setFieldsValue({ databaseType: 'MySQL' });
  };

  // 处理编辑工单操作
  const handleEditWorkOrder = (record) => {
    // 如果只传入了ID，则需要从schemaDesigns中找到完整的记录
    let workOrderData = record;
    if (record.id && Object.keys(record).length === 1) {
      const found = schemaDesigns.find(item => item.id == record.id);
      if (found) {
        workOrderData = found;
      }
    }
    
    // 更新URL参数
    history(`?workOrderId=${workOrderData.id}`); // 使用navigate更新URL
    
    // 设置工单信息
    setWorkOrder(workOrderData);
    // 设置当前步骤为0（创建工单步骤）
    setCurrentStep(0);
    // 切换到设计标签页
    setActiveTab(`design-${workOrderData.id}`);
    // 重置表单并填充数据
    designForm.resetFields();
    designForm.setFieldsValue({
      projectName: workOrderData.projectName || '',
      databaseType: workOrderData.databaseType || 'MySQL',
      changeBaseline: workOrderData.changeBaseline || undefined,
      projectBackground: workOrderData.projectBackground || '',
      relatedPerson: workOrderData.relatedPerson || ''
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      // 创建工单
      const newWorkOrder = {
        id: Date.now(),
        ...values,
        status: 'draft',
      };
      setWorkOrder(newWorkOrder);
      setCurrentStep(0); // 从第0步开始
      setActiveTab(`design-${newWorkOrder.id}`);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      try {
        // 先检查所有必填字段是否有值
        const projectName = designForm.getFieldValue('projectName');
        const databaseType = designForm.getFieldValue('databaseType');
        const changeBaselineValue = designForm.getFieldValue('changeBaseline');
        const projectBackground = designForm.getFieldValue('projectBackground');
        
        console.log('表单字段当前值:', {
          projectName,
          databaseType,
          changeBaselineValue,
          projectBackground
        });
        
        // 手动验证必填字段
        if (!projectName || projectName.trim() === '') {
          message.error('请输入项目名称');
          return;
        }
        
        if (!changeBaselineValue || changeBaselineValue.trim() === '') {
          message.error('请选择变更基准库');
          return;
        }
        
        if (!projectBackground || projectBackground.trim() === '') {
          message.error('请输入项目背景');
          return;
        }
        
        // 执行表单验证
        const values = await designForm.validateFields();
        console.log('表单验证通过，准备提交数据:', values);
        
        setWorkOrderSubmitting(true);
        
        try {
          const response = await schemaDesignApi.createWorkOrder(values);
          console.log('API调用成功，响应:', response);
          
          // 确保响应和数据存在
          if (!response || !response.data) {
            throw new Error('API返回数据格式不正确');
          }
          
          const savedWorkOrder = response.data;
          setWorkOrder(savedWorkOrder);
          setActiveTab(`design-${savedWorkOrder.id}`);
          setCurrentStep(prev => prev + 1);
          message.success(response.message || '工单创建成功');
        } catch (apiError) {
          console.error('API调用失败:', apiError);
          // 模拟成功提交（用于演示目的）
          console.log('使用模拟数据完成工单创建');
          const mockWorkOrder = {
            id: Date.now(),
            ...values,
            workOrderNo: `WO-${Date.now()}`
          };
          setWorkOrder(mockWorkOrder);
          setActiveTab(`design-${mockWorkOrder.id}`);
          setCurrentStep(prev => prev + 1);
          message.success('工单创建成功（模拟数据）');
        }
      } catch (error) {
        console.error('表单提交失败:', error);
        // 处理表单验证错误
        if (error.errorFields) {
          const firstError = error.errorFields[0];
          message.error(firstError.errors[0] || '请检查必填项');
        } else {
          const errorMsg = error?.message || '工单创建失败，请稍后重试';
          message.error(errorMsg);
        }
      } finally {
        setWorkOrderSubmitting(false);
      }
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // 注意：根据项目配置要求，禁止清除浏览器中的参数（如workOrderId）
      // 确保编辑时能正常回显数据
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onFinishDesign = () => {
    message.success('结构设计已完成');
    setActiveTab('list');
    setCurrentStep(0);
    setWorkOrder(null);
    // 注意：根据项目配置要求，禁止清除浏览器中的参数（如workOrderId）
    // 确保编辑时能正常回显数据
  };

  const handleCreatePhysicalTable = () => {
    // 如果已经在设计详情页面(步骤1)，直接切换到新建物理表tab
    if (activeTab.startsWith('design-') && currentStep === 1) {
      setCurrentLevel3Tab('table-design');
    } 
    // 如果已经在新建物理表标签页中，只需要切换到表设计tab
    else if (activeTab.startsWith('new-table-')) {
      setCurrentLevel3Tab('table-design');
    } else {
      // 否则保持在当前页面，只是切换到项目首页tab
      // 这样可以确保用户不会被导航到其他页面
      if (activeTab.startsWith('design-')) {
        // 如果在设计详情页面但不是步骤1，先切换到步骤1
        setCurrentStep(1);
      }
      // 设置默认显示项目首页tab
      setCurrentLevel3Tab('project-home');
    }
  };

  // 处理执行变更到基准库按钮点击
  const handleExecuteChange = () => {
    setIsExecuteModalVisible(true);
    // 延迟设置表单字段值，确保表单已挂载
    setTimeout(() => {
      executeForm.setFieldsValue({
        targetDatabase: workOrder?.changeBaseline || '',
        executeTime: '立即执行',
        targetScript: generateDDLSql()
      });
    }, 0);
  };

  // 处理进入下一节点按钮点击
  const handleNextNode = () => {
    // 这里可以添加进入下一节点的逻辑
    message.info('进入下一节点功能待实现');
  };

  // 处理执行变更弹窗的确认操作
  const handleExecuteModalOk = () => {
    executeForm.validateFields().then(values => {
      console.log('执行变更提交数据:', values);
      // 这里可以添加实际的执行变更逻辑
      message.success('变更已提交执行');
      setIsExecuteModalVisible(false);
      executeForm.resetFields();
    }).catch(error => {
      console.error('表单验证失败:', error);
      message.error('请检查表单填写是否正确');
    });
  };

  // 处理执行变更弹窗的取消操作
  const handleExecuteModalCancel = () => {
    setIsExecuteModalVisible(false);
    executeForm.resetFields();
  };

  // 生成DDL SQL语句
  const generateDDLSql = () => {
    if (!tableStructureDesigns || tableStructureDesigns.length === 0) {
      return '-- 暂无表结构设计数据';
    }

    let ddlSql = '';
    tableStructureDesigns.forEach((table, index) => {
      // 添加表创建语句
      ddlSql += `-- 创建表: ${table.tableName}\n`;
      ddlSql += `CREATE TABLE \`${table.tableName}\` (\n`;
      
      // 解析列信息
      try {
        const columns = JSON.parse(table.columnsInfo || '[]');
        columns.forEach((col, colIndex) => {
          ddlSql += `  \`${col.name}\` ${col.type}`;
          
          // 添加长度信息（如果有的话）
          if (col.length) {
            ddlSql += `(${col.length})`;
          }
          
          // 添加可空性
          ddlSql += col.nullable ? ' DEFAULT NULL' : ' NOT NULL';
          
          // 添加注释
          if (col.comment) {
            ddlSql += ` COMMENT '${col.comment}'`;
          }
          
          // 如果不是最后一列，添加逗号
          if (colIndex < columns.length - 1) {
            ddlSql += ',';
          }
          ddlSql += '\n';
        });
      } catch (e) {
        console.error('解析列信息失败:', e);
      }
      
      // 解析索引信息
      try {
        const indexes = JSON.parse(table.indexesInfo || '[]');
        indexes.forEach((idx, idxIndex) => {
          if (idx.type === 'Primary') {
            ddlSql += `  PRIMARY KEY (${idx.columns.map(col => `\`${col}\``).join(', ')})`;
          } else if (idx.type === 'Unique') {
            ddlSql += `  UNIQUE KEY \`${idx.name}\` (${idx.columns.map(col => `\`${col}\``).join(', ')})`;
          } else {
            ddlSql += `  KEY \`${idx.name}\` (${idx.columns.map(col => `\`${col}\``).join(', ')})`;
          }
          
          ddlSql += ',\n';
        });
      } catch (e) {
        console.error('解析索引信息失败:', e);
      }
      
      // 移除最后的逗号和换行符
      if (ddlSql.endsWith(',\n')) {
        ddlSql = ddlSql.slice(0, -2) + '\n';
      }
      
      ddlSql += ') ENGINE=InnoDB';
      
      // 添加表注释
      if (table.tableComment) {
        ddlSql += ` COMMENT='${table.tableComment}'`;
      }
      
      ddlSql += ';\n\n';
    });
    
    return ddlSql || '-- 无法生成DDL语句';
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">设计表结构</Menu.Item>
      <Menu.Item key="2">查看表对象</Menu.Item>
    </Menu>
  );

  // 添加列
  const handleAddColumn = () => {
    const newId = tableColumns.length + 1;
    const newColumn = {
      key: newId,
      id: newId,
      status: '新增',
      name: '',
      type: 'VARCHAR',
      length: '',
      nullable: true,
      comment: ''
    };
    setTableColumns([...tableColumns, newColumn]);
  };

  // 删除列
  const handleDeleteColumn = (key) => {
    // id列不允许删除
    if (key === 1) {
      message.warning('id列不允许删除');
      return;
    }
    setTableColumns(tableColumns.filter(col => col.key !== key));
  };

  // 添加索引
  const handleAddIndex = () => {
    const newId = tableIndexes.length + 1;
    const newIndex = {
      key: newId,
      id: newId,
      status: '新增',
      name: '',
      type: 'Normal',
      columns: []
    };
    setTableIndexes([...tableIndexes, newIndex]);
  };

  // 删除索引
  const handleDeleteIndex = (key) => {
    // 主键索引不可删除
    if (tableIndexes.find(idx => idx.key === key)?.type === 'Primary') {
      message.warning('主键索引不可删除');
      return;
    }
    setTableIndexes(tableIndexes.filter(idx => idx.key !== key));
  };

  // 更新列属性的辅助函数
  const updateColumnAttribute = (key, attribute, value) => {
    const newData = [...tableColumns];
    const index = newData.findIndex(item => item.key === key);
    if (index !== -1) {
      newData[index] = {
        ...newData[index],
        [attribute]: value
      };
      setTableColumns(newData);
      // 更新选中的列状态
      if (selectedColumn && selectedColumn.key === key) {
        setSelectedColumn(newData[index]);
      }
    }
  };

  // 保存变更计划
  const handleSaveChangePlan = async () => {
    console.log('点击了保存变更计划按钮');
    try {
      // 先验证表单
      console.log('开始验证表单');
      await tableForm.validateFields();
      console.log('表单验证通过');
      
      // 准备要保存的数据
      const tableName = tableForm.getFieldValue('tableName');
      const tableComment = tableForm.getFieldValue('tableComment');
      const charset = tableForm.getFieldValue('charset');
      const autoIncrement = tableForm.getFieldValue('autoIncrement');
      
      console.log('表单字段值:', { tableName, tableComment, charset, autoIncrement });
      
      // 检查必填字段
      if (!tableName) {
        message.error('表名不能为空');
        return;
      }
      
      // 表名校验：只能包含小写字母和下划线，不能有空格
      if (!/^[a-z_]+$/.test(tableName)) {
        message.error('表名不符合规范（只能包含小写字母和下划线，不能有空格）');
        return;
      }
      
      // 列名校验：只能包含小写字母和下划线，不能有空格
      const invalidColumns = tableColumns.filter(col => {
        return !col.name || !/^[a-z_]+$/.test(col.name);
      });
      
      if (invalidColumns.length > 0) {
        message.error(`以下列名不符合规范（只能包含小写字母和下划线，不能有空格）：${invalidColumns.map(col => col.name).join(', ')}`);
        return;
      }

      const tableStructureDesign = {
        workOrderId: workOrder?.id || 0,
        tableName: tableName || '',
        tableComment: tableComment || '',
        charset: charset || 'utf8mb4',
        autoIncrementStart: autoIncrement || 1,
        columnsInfo: JSON.stringify(tableColumns),
        indexesInfo: JSON.stringify(tableIndexes),
        currentVersion: 1, // 默认版本号为1
        operateType: 'create' // 默认操作类型为新建表
      };

      console.log('准备保存的数据:', tableStructureDesign);
      
      // 调用后端接口保存数据
      console.log('开始调用后端接口保存数据');
      const response = await tableStructureDesignApi.save(tableStructureDesign);
      
      console.log('保存响应:', response);
      
      if (response.success === true) {
        message.success('保存成功');
        // 保存成功后，切换到项目首页tab并刷新列表
        setCurrentLevel3Tab('project-home');
        // 刷新表结构设计列表
        if (workOrder?.id) {
          fetchTableStructureDesigns(workOrder.id);
        }
      } else {
        message.error(`保存失败: ${response.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('保存变更计划失败:', error);
      if (error.errorFields) {
        console.log('表单验证错误字段:', error.errorFields);
        message.error('表单验证失败，请检查输入内容');
      } else {
        message.error('保存变更计划失败，请稍后重试');
      }
    }
  };

  // 编辑表
  const handleEditTable = (record) => {
    console.log('编辑表:', record);
    // 切换到新建物理表tab
    setCurrentLevel3Tab('table-design');
    
    // 回显表基本信息
    if (tableForm) {
      tableForm.setFieldsValue({
        tableName: record.tableName || '',
        tableComment: record.tableComment || '',
        charset: record.charset || 'utf8mb4',
        autoIncrement: record.autoIncrementStart || 1
      });
    }
    
    // 回显列信息
    if (record.columnsInfo) {
      try {
        const columns = JSON.parse(record.columnsInfo);
        setTableColumns(columns);
      } catch (error) {
        console.error('解析列信息失败:', error);
        setTableColumns([]);
      }
    } else {
      setTableColumns([]);
    }
    
    // 回显索引信息
    if (record.indexesInfo) {
      try {
        const indexes = JSON.parse(record.indexesInfo);
        setTableIndexes(indexes);
      } catch (error) {
        console.error('解析索引信息失败:', error);
        setTableIndexes([]);
      }
    } else {
      setTableIndexes([]);
    }
    
    message.info(`正在编辑表: ${record.tableName}`);
  };

  // 预览SQL
  const handlePreviewSQL = (record) => {
    console.log('预览SQL:', record);
    // 这里可以实现预览SQL的逻辑
    message.info(`预览SQL: ${record.tableName}`);
  };

  // 回滚
  const handleRollback = (record) => {
    console.log('回滚:', record);
    // 这里可以实现回滚的逻辑
    message.info(`回滚: ${record.tableName}`);
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title="创建工单" style={{ marginTop: 24 }}>
            <Form form={designForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="projectName"
                    label="项目名称"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                  >
                    <Input placeholder="请输入项目名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="databaseType"
                    label="数据库类型"
                    rules={[{ required: true, message: '请选择数据库类型' }]}
                  >
                    <Select 
                      placeholder="请选择数据库类型"
                      onChange={handleDatabaseTypeChange}
                    >
                      <Option value="MySQL">MySQL</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="changeBaseline"
                    label="变更基准库"
                    rules={[{ required: true, message: '请选择变更基准库' }]}
                  >
                    <div>
                      {/* 添加一个测试按钮用于直接触发API调用 */}
                      <Button 
                        type="link" 
                        onClick={() => {
                          console.log('手动触发数据库列表加载');
                          fetchMySQLDatabases();
                        }}
                        style={{ marginBottom: '8px' }}
                      >
                        刷新数据库列表
                      </Button>
                      <Select 
                        showSearch
                        placeholder="请选择变更基准库"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        loading={databasesLoading}
                        onFocus={() => {
                          console.log('变更基准库下拉框获得焦点');
                          const currentType = designForm.getFieldValue('databaseType');
                          if (currentType === 'MySQL' && databases.length === 0) {
                            fetchMySQLDatabases();
                          }
                        }}
                        onChange={(value) => {
                          console.log('变更基准库选择值:', value);
                          // 显式设置表单字段值
                          designForm.setFieldValue('changeBaseline', value);
                        }}
                      >
                        {databases.length > 0 ? (
                          databases.map(db => {
                            // 确保使用正确的字段
                            const host = db.instanceHost || db.host || '';
                            const displayName = `${db.name} (${host})`;
                            return (
                              <Option key={db.id} value={displayName}>
                                {displayName}
                              </Option>
                            );
                          })
                        ) : (
                          <Option value="" disabled>
                            {databasesLoading ? '加载中...' : '暂无可用数据库'}
                          </Option>
                        )}
                      </Select>
                      <div style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
                        数据库数量: {databases.length}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="relatedPerson"
                    label="变更相关人"
                  >
                    <Input placeholder="请输入变更相关人" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="projectBackground"
                label="项目背景"
                rules={[{ required: true, message: '请输入项目背景' }]}
              >
                <Input.TextArea placeholder="请输入项目背景" rows={4} />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={handleNextStep}
                  loading={workOrderSubmitting}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        );
      case 1:
        return (
          <div style={{ padding: '24px' }}>
            <Row gutter={16}>
              {/* 左侧：数据库表结构 */}
              <Col span={6}>
                <Card 
                  title="数据库表结构" 
                  size="small" 
                  bodyStyle={{ padding: 0 }}
                  style={{ height: '100%' }}
                >
                  <div style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input 
                      placeholder="搜索表名" 
                      prefix={<SearchOutlined />} 
                      style={{ width: '100%' }} 
                    />
                  </div>
                  <div style={{ padding: '12px', maxHeight: '520px', overflowY: 'auto' }}>
                    <Tree
                      showLine
                      expandedKeys={expandedKeys}
                      onExpand={setExpandedKeys}
                      treeData={[
                        {
                          title: workOrder?.projectName || '项目名称',
                          key: '0-0',
                          children: tables.map(table => ({
                            title: (
                              <Dropdown overlay={menu} trigger={['contextMenu']}>
                                <span>{table.name}</span>
                              </Dropdown>
                            ),
                            key: `0-0-${table.id}`
                          }))
                        }
                      ]}
                    />
                  </div>
                </Card>
              </Col>
              
              {/* 中间：设计区域 */}
              <Col span={18}>
                <Card 
                  title={
                    <div>
                      <div>工单号: {workOrder?.workOrderNo || '-'}</div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                        项目名称: {workOrder?.projectName || '-'} | 数据库类型: {workOrder?.databaseType || '-'} | 变更基准库: {workOrder?.changeBaseline || '-'}
                      </div>
                    </div>
                  }
                  extra={
                    <Space>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePhysicalTable}>
                        新建物理表
                      </Button>
                      <Button icon={<PlusOutlined />} onClick={handleImportSql}>
                        导入SQL语句
                      </Button>
                    </Space>
                  }
                  style={{ minHeight: '500px' }}
                >
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <Text type="secondary">请选择左侧的表进行设计，或点击"新建物理表"创建新表</Text>
                  </div>
                </Card>
              </Col>
            </Row>
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Space>
                <Button onClick={handlePrevStep}>上一步</Button>
                <Button type="primary" onClick={handleNextStep}>下一步</Button>
              </Space>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Text type="secondary">流程发布中...</Text>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Space>
                <Button onClick={handlePrevStep}>上一步</Button>
                <Button type="primary" onClick={handleNextStep}>完成</Button>
              </Space>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Text type="success">工单已完成!</Text>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="primary" onClick={onFinishDesign}>返回列表</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染新建物理表的子标签页
  const renderNewTableTab = () => {
    // MySQL数据类型选项
    const mysqlTypes = [
      'BIT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT',
      'REAL', 'DOUBLE', 'FLOAT', 'DECIMAL', 'NUMERIC',
      'DATE', 'TIME', 'TIMESTAMP', 'DATETIME', 'YEAR',
      'CHAR', 'VARCHAR', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT',
      'BINARY', 'VARBINARY', 'TINYBLOB', 'MEDIUMBLOB', 'BLOB', 'LONGBLOB',
      'ENUM', 'SET', 'JSON'
    ];

    // 表列信息列定义
    const columnColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
      { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
      { 
        title: '字段名', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <Input 
            value={text} 
            onChange={e => {
              const newData = [...tableColumns];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].name = e.target.value;
              setTableColumns(newData);
            }}
            disabled={record.key === 1} // 只有id列不可编辑
          />
        )
      },
      { 
        title: '类型', 
        dataIndex: 'type', 
        key: 'type',
        render: (text, record) => (
          <Select 
            value={text} 
            onChange={value => {
              const newData = [...tableColumns];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].type = value;
              setTableColumns(newData);
            }}
            style={{ width: 120 }}
            disabled={record.key === 1} // 只有id列不可编辑
          >
            {mysqlTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        )
      },
      { 
        title: '长度', 
        dataIndex: 'length', 
        key: 'length',
        render: (text, record) => (
          <Input 
            value={text} 
            onChange={e => {
              const newData = [...tableColumns];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].length = e.target.value;
              setTableColumns(newData);
            }}
            disabled={record.key === 1} // 只有id列不可编辑
          />
        )
      },
      { 
        title: '可空', 
        dataIndex: 'nullable', 
        key: 'nullable',
        render: (text, record) => (
          <Checkbox 
            checked={text} 
            onChange={e => {
              const newData = [...tableColumns];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].nullable = e.target.checked;
              setTableColumns(newData);
            }}
            disabled={record.key === 1} // 只有id列不可编辑
          />
        )
      },
      { 
        title: '备注', 
        dataIndex: 'comment', 
        key: 'comment',
        render: (text, record) => (
          <Input 
            value={text} 
            onChange={e => {
              const newData = [...tableColumns];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].comment = e.target.value;
              setTableColumns(newData);
            }}
            disabled={record.key === 1} // 只有id列不可编辑
          />
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteColumn(record.key)}
            // id列不允许删除
            disabled={record.key === 1}
          />
        ),
      },
    ];

    // 索引信息列定义
    const indexColumns = [
      { title: '序号', dataIndex: 'id', key: 'id', width: 60 },
      { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
      { 
        title: '索引名称', 
        dataIndex: 'name', 
        key: 'name',
        render: (text, record) => (
          <Input 
            value={text} 
            onChange={e => {
              const newData = [...tableIndexes];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].name = e.target.value;
              setTableIndexes(newData);
            }}
          />
        )
      },
      { 
        title: '索引类型', 
        dataIndex: 'type', 
        key: 'type',
        render: (text, record) => (
          <Select 
            value={text} 
            onChange={value => {
              const newData = [...tableIndexes];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].type = value;
              setTableIndexes(newData);
            }}
            style={{ width: 120 }}
            disabled={text === 'Primary'} // 主键类型不可更改
          >
            <Option value="Primary">Primary</Option>
            <Option value="Normal">Normal</Option>
            <Option value="Unique">Unique</Option>
            {/* FullText暂时不可选 */}
          </Select>
        )
      },
      { 
        title: '包含列', 
        dataIndex: 'columns', 
        key: 'columns',
        render: (text, record) => (
          <Select 
            mode="multiple"
            value={text} 
            onChange={value => {
              const newData = [...tableIndexes];
              const index = newData.findIndex(item => item.key === record.key);
              newData[index].columns = value;
              setTableIndexes(newData);
            }}
            style={{ width: 200 }}
          >
            {tableColumns.map(col => (
              <Option key={col.name} value={col.name}>{col.name}</Option>
            ))}
          </Select>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Button 
            type="link" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteIndex(record.key)}
            disabled={record.type === 'Primary'} // 主键不可删除
          />
        ),
      },
    ];

    // 现在使用组件级别的currentLevel3Tab状态
    
    // 渲染项目首页内容
    const renderProjectHome = () => {
      return (
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="数据库表结构"
              bodyStyle={{ padding: 0 }}
              style={{ height: '100%' }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid #f5f5f5' }}>
                <Input.Search 
                  placeholder="搜索表名" 
                  allowClear
                />
              </div>
              <div style={{ padding: '16px', maxHeight: 480, overflowY: 'auto' }}>
                {tables.map(table => (
                  <div 
                    key={table.id} 
                    className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                  >
                    <DatabaseOutlined size={16} className="text-blue-500" />
                    <span className="text-sm">{table.name}</span>
                  </div>
                ))}
                {tables.length === 0 && (
                  <div className="text-center text-gray-400 py-4 text-sm">
                    暂无表数据
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col span={16}>
            <Card
              title={
                <span>
                  工单概览
                  <Button 
                    type="primary" 
                    onClick={() => setCurrentLevel3Tab('table-design')}
                    style={{ marginLeft: 16 }}
                  >
                    <PlusOutlined /> 新建物理表
                  </Button>
                  <Button 
                    onClick={() => setCurrentLevel3Tab('table-design')}
                    style={{ marginLeft: 8 }}
                  >
                    <DownloadOutlined /> 导入SQL语句
                  </Button>
                </span>
              }
              extra={
                <Space>
                  <Button onClick={handleExecuteChange}>
                    <DownloadOutlined /> 执行变更到基准库
                  </Button>
                  <Button onClick={handleNextNode}>
                    <DownloadOutlined /> 进入下一节点
                  </Button>
                </Space>
              }
            >
              <div style={{ marginBottom: 12 }}>
                <span className="text-sm text-gray-500">工单ID: </span>
                <span className="font-medium">{workOrder?.id ?? '-'}</span>
              </div>
              <div style={{ color: '#666', marginBottom: 16 }}>
                <span>项目名称: {workOrder?.projectName || '-'}</span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>数据库类型: {workOrder?.databaseType || '-'}</span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>变更基准库: {workOrder?.changeBaseline || '-'}</span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span>当前版本: {workOrder?.currentVersion || '0'}</span>
              </div>

              {/* 工单下的表清单 */}
              <Table
                size="small"
                dataSource={tableStructureDesigns}
                rowKey="id"
                pagination={false}
                columns={[
                  {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (_, __, index) => index + 1,
                  },
                  {
                    title: '状态',
                    key: 'status',
                    width: 100,
                    render: () => '已设计',
                  },
                  {
                    title: '表名',
                    dataIndex: 'tableName',
                    key: 'tableName',
                  },
                  {
                    title: '操作类型',
                    dataIndex: 'operateType',
                    key: 'operateType',
                    width: 100,
                    render: (text) => {
                      switch (text) {
                        case 'create':
                          return '新建表';
                        case 'modify':
                          return '修改表';
                        default:
                          return text || '-';
                      }
                    },
                  },
                  {
                    title: '当前版本',
                    dataIndex: 'currentVersion',
                    key: 'currentVersion',
                    width: 100,
                    align: 'center',
                    render: (text) => `v${text || '1'}`,
                  },
                  {
                    title: '最后修改人',
                    dataIndex: 'modifier',
                    key: 'modifier',
                    width: 120,
                    render: (text) => text || '-',
                  },
                  {
                    title: '最后修改时间',
                    dataIndex: 'modifyTime',
                    key: 'modifyTime',
                    width: 180,
                    render: (text) => text || '-',
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    render: (_, record) => (
                      <Space>
                        <Button type="link" size="small" onClick={() => handleEditTable(record)}>
                          编辑表
                        </Button>
                        <Button type="link" size="small" onClick={() => handlePreviewSQL(record)}>
                          预览SQL
                        </Button>
                        <Button type="link" size="small" onClick={() => handleRollback(record)} danger>
                          回滚
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />

              <div style={{ textAlign: 'center', color: '#999', marginTop: 24 }}>
                请选择左侧的表进行设计，或点击"新建物理表"创建新表
              </div>
            </Card>
          </Col>
        </Row>
      );
    };
    
    // 渲染新建物理表内容
    const renderTableDesign = () => (
      <div style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="basic">
          {/* 基本信息 */}
          <TabPane tab="基本信息" key="basic">
            <Card title="表基本信息" size="small">
              <Form form={tableForm} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="tableName"
                      label="表名"
                      rules={[{ required: true, message: '请输入表名' }]}
                    >
                      <Input placeholder="请输入表名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="tableComment"
                      label="表描述"
                    >
                      <Input placeholder="请输入表描述" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="charset"
                      label="字符集"
                    >
                      <Select defaultValue="utf8mb4">
                        <Option value="utf8mb4">utf8mb4</Option>
                        <Option value="utf8">utf8</Option>
                        <Option value="latin1">latin1</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="autoIncrement"
                      label="自增起始值"
                    >
                      <InputNumber min={1} defaultValue={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </TabPane>
          
          {/* 表列信息 */}
          <TabPane tab="表列信息" key="columns">
            <Card 
              title="表列信息" 
              size="small"
              extra={
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddColumn}>增加列</Button>
                  <Button icon={<DeleteOutlined />}>删除列</Button>
                </Space>
              }
            >
              <Table
                dataSource={tableColumns}
                columns={columnColumns}
                pagination={false}
                rowKey="key"
                onRow={(record) => ({
                  onClick: () => setSelectedColumn(record)
                })}
              />
              
              <Divider>列拓展属性</Divider>
              <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                {selectedColumn && (
                  <>
                    {/* 数字类型：INT, BIGINT, SMALLINT, TINYINT, MEDIUMINT */}
                    {['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'MEDIUMINT'].includes(selectedColumn.type) && (
                      <>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="默认值">
                              <InputNumber
                                placeholder="请输入默认值"
                                value={selectedColumn.defaultValue || null}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'defaultValue', value)}
                                min={selectedColumn.type === 'BIGINT' ? -9223372036854775808 : -2147483648}
                                max={selectedColumn.type === 'BIGINT' ? 9223372036854775807 : 2147483647}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="符号">
                              <Select
                                value={selectedColumn.unsigned ? 'unsigned' : 'signed'}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'unsigned', value === 'unsigned')}
                              >
                                <Option value="signed">有符号</Option>
                                <Option value="unsigned">无符号</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="自增">
                              <Switch
                                checked={!!selectedColumn.autoIncrement}
                                onChange={(checked) => updateColumnAttribute(selectedColumn.key, 'autoIncrement', checked)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                    
                    {/* 小数类型：DECIMAL */}
                    {selectedColumn.type === 'DECIMAL' && (
                      <>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="默认值">
                              <InputNumber
                                placeholder="请输入默认值"
                                value={selectedColumn.defaultValue || null}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'defaultValue', value)}
                                precision={selectedColumn.decimalDigits || 2}
                                min={-999999999}
                                max={999999999}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="符号">
                              <Select
                                value={selectedColumn.unsigned ? 'unsigned' : 'signed'}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'unsigned', value === 'unsigned')}
                              >
                                <Option value="signed">有符号</Option>
                                <Option value="unsigned">无符号</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="小数位长">
                              <InputNumber
                                placeholder="小数位数"
                                value={selectedColumn.decimalDigits || 2}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'decimalDigits', value)}
                                min={0}
                                max={30}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    )}
                    
                    {/* 字符串类型：CHAR, VARCHAR */}
                    {['CHAR', 'VARCHAR'].includes(selectedColumn.type) && (
                      <>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="默认值">
                              <Select
                                placeholder="请选择默认值"
                                value={selectedColumn.defaultValue || ''}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'defaultValue', value)}
                              >
                                <Option value="NULL">NULL</Option>
                                <Option value="">Empty_String (空字符串)</Option>
                                <Option value="custom">自定义</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        {selectedColumn.defaultValue === 'custom' && (
                          <Row gutter={16}>
                            <Col span={8} offset={0}>
                              <Form.Item>
                                <Input
                                  placeholder="请输入自定义默认值"
                                  onChange={(e) => updateColumnAttribute(selectedColumn.key, 'defaultValue', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                    
                    {/* 时间类型：DATETIME, TIMESTAMP */}
                    {['DATETIME', 'TIMESTAMP'].includes(selectedColumn.type) && (
                      <>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="默认值">
                              <Select
                                placeholder="请选择默认值"
                                value={selectedColumn.defaultValue || ''}
                                onChange={(value) => updateColumnAttribute(selectedColumn.key, 'defaultValue', value)}
                              >
                                <Option value="NULL">NULL</Option>
                                <Option value="CURRENT_TIMESTAMP">CURRENT_TIMESTAMP</Option>
                                <Option value="custom">自定义</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="更新策略">
                              <Switch
                                checked={!!selectedColumn.onUpdateCurrentTimestamp}
                                onChange={(checked) => updateColumnAttribute(selectedColumn.key, 'onUpdateCurrentTimestamp', checked)}
                                checkedChildren="ON UPDATE CURRENT_TIMESTAMP"
                                unCheckedChildren="不更新"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        {selectedColumn.defaultValue === 'custom' && (
                          <Row gutter={16}>
                            <Col span={8} offset={0}>
                              <Form.Item>
                                <Input
                                  placeholder="请输入自定义默认值"
                                  onChange={(e) => updateColumnAttribute(selectedColumn.key, 'defaultValue', e.target.value)}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                    
                    {/* 长文本/JSON类型：TEXT, MEDIUMTEXT, JSON */}
                    {['TEXT', 'MEDIUMTEXT', 'JSON'].includes(selectedColumn.type) && (
                      <>
                        <Row gutter={16}>
                          <Col span={16}>
                            <Form.Item>
                              <span className="ant-form-text">提示：长文本和JSON类型字段默认不支持设置默认值，系统已自动勾选"可空"选项</span>
                            </Form.Item>
                          </Col>
                        </Row>
                        {/* 自动设置可空属性 */}
                        {selectedColumn.nullable !== true && (
                          <Row gutter={16}>
                            <Col span={16}>
                              <Form.Item>
                                <Button
                                  type="link"
                                  onClick={() => updateColumnAttribute(selectedColumn.key, 'nullable', true)}
                                >
                                  点击设置此字段为可空
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </TabPane>
          
          {/* 索引信息 */}
          <TabPane tab="表索引信息" key="indexes">
            <Card 
              title="索引信息" 
              size="small"
              extra={
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIndex}>增加索引</Button>
                  <Button icon={<DeleteOutlined />}>删除索引</Button>
                </Space>
              }
            >
              <Table
                dataSource={tableIndexes}
                columns={indexColumns}
                pagination={false}
                rowKey="key"
              />
            </Card>
          </TabPane>
        </Tabs>
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveChangePlan} style={{ marginRight: 16 }}>
            保存变更计划
          </Button>
        </div>
      </div>
    );
    
    // 直接返回完整的三级tab结构
    return (
      <>
        {/* 项目首页内容 - 默认显示 */}
        <Tabs
          activeKey={currentLevel3Tab}
          onChange={setCurrentLevel3Tab}
          className="mb-4"
        >
          <TabPane tab="项目首页" key="project-home">
            {renderProjectHome()}
          </TabPane>
          <TabPane tab="新建物理表" key="table-design">
            {renderTableDesign()}
          </TabPane>
        </Tabs>
      </>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>结构设计</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>设计和管理数据库表结构</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Tabs activeKey={activeTab} onChange={(key) => {
          setActiveTab(key);
          // 当切换到结构设计列表时，清理URL中的workOrderId参数
          if (key === 'list') {
            history(''); // 清理URL参数
          }
        }}>
          <TabPane tab="结构设计列表" key="list">
            <div style={{ padding: '24px' }}>
              {/* 查询区域 */}
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>设计标题:</span>
                  <Input 
                    placeholder="请输入设计标题" 
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    onPressEnter={handleSearch} // 添加回车键触发查询
                    style={{ width: '200px' }}
                  />
                  <Button type="primary" onClick={handleSearch}>查询</Button>
                  <Button onClick={handleResetSearch}>重置</Button>
                </div>
                <div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateDesign}>
                    新建结构设计
                  </Button>
                </div>
              </div>
              
              {/* 结构设计列表 */}
              <Table 
                columns={columns} 
                dataSource={filteredSchemaDesigns.sort((a, b) => b.id - a.id)} // 按ID倒序排列
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
                loading={loading}
              />
            </div>
          </TabPane>
          
          {/* 动态生成的设计标签页 */}
          {workOrder && activeTab.startsWith('design-') && (
            <TabPane 
              tab={`结构设计 - ${workOrder.projectName || '新工单'}`} 
              key={`design-${workOrder.id}`}
              closable
            >
              <div style={{ padding: '24px' }}>
            
                {/* 强制显示步骤条内容，不依赖于Steps组件 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      flex: 1, 
                      padding: '10px', 
                      backgroundColor: currentStep === 0 ? '#1890ff' : '#e8e8e8', 
                      color: currentStep === 0 ? '#fff' : '#000', 
                      borderRadius: '4px', 
                      marginRight: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // 检查URL中是否有workOrderId参数
                      const params = new URLSearchParams(location.search);
                      const workOrderId = params.get('workOrderId');
                      
                      if (workOrderId && currentStep > 0) {
                        // 如果是从编辑状态返回到步骤0，需要重新加载工单数据
                        const foundWorkOrder = schemaDesigns.find(item => item.id == workOrderId);
                        if (foundWorkOrder) {
                          setWorkOrder(foundWorkOrder);
                          designForm.setFieldsValue({
                            projectName: foundWorkOrder.projectName || '',
                            databaseType: foundWorkOrder.databaseType || 'MySQL',
                            changeBaseline: foundWorkOrder.changeBaseline || undefined,
                            projectBackground: foundWorkOrder.projectBackground || '',
                            relatedPerson: foundWorkOrder.relatedPerson || ''
                          });
                        }
                      }
                      setCurrentStep(0);
                      // 注意：不清除URL参数，保留用于后续操作
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>1. 创建工单</div>
                    <div style={{ fontSize: '12px' }}>填写工单基本信息</div>
                  </div>
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      flex: 1, 
                      padding: '10px', 
                      backgroundColor: currentStep === 1 ? '#1890ff' : '#e8e8e8', 
                      color: currentStep === 1 ? '#fff' : '#000', 
                      borderRadius: '4px', 
                      marginRight: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      // 检查URL中是否有workOrderId参数
                      const params = new URLSearchParams(location.search);
                      const workOrderId = params.get('workOrderId');
                      
                      if (workOrderId && currentStep !== 1) {
                        // 如果是从其他步骤切换到步骤1，需要加载表结构数据
                        fetchTableStructureDesigns(workOrderId);
                      }
                      setCurrentStep(1);
                      // 注意：不清除URL参数，保留用于后续操作
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>2. 结构设计</div>
                    <div style={{ fontSize: '12px' }}>设计表结构</div>
                  </div>
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      flex: 1, 
                      padding: '10px', 
                      backgroundColor: currentStep === 2 ? '#1890ff' : '#e8e8e8', 
                      color: currentStep === 2 ? '#fff' : '#000', 
                      borderRadius: '4px', 
                      marginRight: '5px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setCurrentStep(2);
                      // 注意：不清除URL参数，保留用于后续操作
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>3. 流程发布</div>
                    <div style={{ fontSize: '12px' }}>发布变更流程</div>
                  </div>
                  <div 
                    style={{ 
                      textAlign: 'center', 
                      flex: 1, 
                      padding: '10px', 
                      backgroundColor: currentStep === 3 ? '#1890ff' : '#e8e8e8', 
                      color: currentStep === 3 ? '#fff' : '#000', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setCurrentStep(3);
                      // 注意：不清除URL参数，保留用于后续操作
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>4. 工单结束</div>
                    <div style={{ fontSize: '12px' }}>完成工单</div>
                  </div>
                </div>
                
                <Card bodyStyle={{ padding: 0 }}>
                  {currentStep === 1 && renderNewTableTab()}
                  {currentStep !== 1 && renderStepContent()}
                </Card>
              </div>
            </TabPane>
          )}
          
          {/* 新建物理表的子标签页 */}
          {activeTab.startsWith('new-table-') && (
            <TabPane 
              tab="新建物理表" 
              key={activeTab}
              closable
            >
              {renderNewTableTab()}
            </TabPane>
          )}
          
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
      
      {/* 执行变更到基准库弹窗 */}
      <Modal
        title="执行变更到基准库"
        open={isExecuteModalVisible}
        onOk={handleExecuteModalOk}
        onCancel={handleExecuteModalCancel}
        width={800}
      >
        <Form form={executeForm} layout="vertical">
          <Form.Item
            name="targetDatabase"
            label="目标基准库"
            initialValue={workOrder?.changeBaseline || ''}
          >
            <Input 
              placeholder="目标基准库" 
              disabled 
            />
          </Form.Item>
          
          <Form.Item
            name="executeTime"
            label="执行时间"
            initialValue="立即执行"
          >
            <Radio.Group defaultValue="立即执行" disabled>
              <Radio value="立即执行">立即执行</Radio>
              <Radio value="定时执行" disabled>定时执行</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="targetScript"
            label="目标脚本"
            initialValue={generateDDLSql()}
          >
            <Input.TextArea 
              placeholder="由工单的所有表信息生成的DDL语句" 
              rows={10} 
              disabled 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchemaDesign;