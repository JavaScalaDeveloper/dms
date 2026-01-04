import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Steps,
  message,
  Row,
  Col,
  Divider,
  Typography,
  Space
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  FileProtectOutlined
} from '@ant-design/icons';
import { dataSourceApi, dbObjectApi } from '../services/api';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const DataSourceApplication = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dataSources, setDataSources] = useState([]);
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [applicationType, setApplicationType] = useState('instance');
  const [form] = Form.useForm();

  const dataSourceTypes = [
    { value: 'transactional', label: '事务型', subtypes: ['mysql', 'tidb'] },
    { value: 'analytical', label: '分析型', subtypes: ['clickhouse', 'starrocks', 'elasticsearch'] },
    { value: 'log', label: '日志型', subtypes: ['sls'] }
  ];

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await dataSourceApi.getDataSources();
      setDataSources(response.data);
    } catch (error) {
      message.error('获取数据源列表失败: ' + error.message);
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 根据申请类型调用不同的API
      let response;
      switch (applicationType) {
        case 'instance':
          response = await dbObjectApi.applyInstance(values);
          break;
        case 'database':
          response = await dbObjectApi.applyDatabase(values);
          break;
        case 'table':
          response = await dbObjectApi.applyTable(values);
          break;
        default:
          throw new Error('未知的申请类型');
      }
      
      message.success('申请提交成功');
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      message.error('申请提交失败: ' + error.message);
    }
  };

  const steps = [
    {
      title: '选择申请类型',
      content: (
        <div>
          <Title level={4}>请选择申请类型</Title>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
            <Card 
              hoverable 
              style={{ width: 200, textAlign: 'center' }} 
              onClick={() => {
                setApplicationType('instance');
                setCurrentStep(1);
              }}
            >
              <FileProtectOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <Title level={5} style={{ marginTop: '12px' }}>实例申请</Title>
              <Text type="secondary">申请新的数据库实例</Text>
            </Card>
            
            <Card 
              hoverable 
              style={{ width: 200, textAlign: 'center' }} 
              onClick={() => {
                setApplicationType('database');
                setCurrentStep(1);
              }}
            >
              <FileProtectOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
              <Title level={5} style={{ marginTop: '12px' }}>数据库申请</Title>
              <Text type="secondary">申请新的数据库</Text>
            </Card>
            
            <Card 
              hoverable 
              style={{ width: 200, textAlign: 'center' }} 
              onClick={() => {
                setApplicationType('table');
                setCurrentStep(1);
              }}
            >
              <FileProtectOutlined style={{ fontSize: '48px', color: '#faad14' }} />
              <Title level={5} style={{ marginTop: '12px' }}>表申请</Title>
              <Text type="secondary">申请新的数据表</Text>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: '填写申请信息',
      content: (
        <div>
          <Title level={4}>
            {applicationType === 'instance' && '实例申请信息'}
            {applicationType === 'database' && '数据库申请信息'}
            {applicationType === 'table' && '表申请信息'}
          </Title>
          
          <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
            <Form.Item
              name="dataSourceId"
              label="数据源"
              rules={[{ required: true, message: '请选择数据源' }]}
            >
              <Select 
                placeholder="请选择数据源"
                onChange={setSelectedDataSource}
              >
                {dataSources.map(ds => (
                  <Option key={ds.id} value={ds.id}>{ds.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            {applicationType === 'instance' && (
              <>
                <Form.Item
                  name="instanceName"
                  label="实例名称"
                  rules={[{ required: true, message: '请输入实例名称' }]}
                >
                  <Input placeholder="请输入实例名称" />
                </Form.Item>
                
                <Form.Item
                  name="instanceType"
                  label="实例类型"
                  rules={[{ required: true, message: '请选择实例类型' }]}
                >
                  <Select placeholder="请选择实例类型">
                    <Option value="mysql">MySQL</Option>
                    <Option value="tidb">TiDB</Option>
                    <Option value="clickhouse">ClickHouse</Option>
                    <Option value="starrocks">StarRocks</Option>
                    <Option value="elasticsearch">Elasticsearch</Option>
                    <Option value="sls">SLS</Option>
                  </Select>
                </Form.Item>
              </>
            )}
            
            {applicationType === 'database' && (
              <>
                <Form.Item
                  name="databaseName"
                  label="数据库名称"
                  rules={[{ required: true, message: '请输入数据库名称' }]}
                >
                  <Input placeholder="请输入数据库名称" />
                </Form.Item>
                
                <Form.Item
                  name="instanceId"
                  label="所属实例"
                  rules={[{ required: true, message: '请选择所属实例' }]}
                >
                  <Select placeholder="请选择所属实例">
                    <Option value="instance1">实例1</Option>
                    <Option value="instance2">实例2</Option>
                  </Select>
                </Form.Item>
              </>
            )}
            
            {applicationType === 'table' && (
              <>
                <Form.Item
                  name="tableName"
                  label="表名称"
                  rules={[{ required: true, message: '请输入表名称' }]}
                >
                  <Input placeholder="请输入表名称" />
                </Form.Item>
                
                <Form.Item
                  name="databaseName"
                  label="所属数据库"
                  rules={[{ required: true, message: '请选择所属数据库' }]}
                >
                  <Select placeholder="请选择所属数据库">
                    <Option value="database1">数据库1</Option>
                    <Option value="database2">数据库2</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="tableSchema"
                  label="表结构定义"
                  rules={[{ required: true, message: '请输入表结构定义' }]}
                >
                  <Input.TextArea 
                    placeholder="请输入表结构定义，例如：CREATE TABLE ..." 
                    rows={4} 
                  />
                </Form.Item>
              </>
            )}
            
            <Form.Item
              name="reason"
              label="申请原因"
              rules={[{ required: true, message: '请输入申请原因' }]}
            >
              <Input.TextArea placeholder="请输入申请原因" rows={3} />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="请输入描述信息" rows={2} />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: '确认并提交',
      content: (
        <div>
          <Title level={4}>确认申请信息</Title>
          <Card style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>申请类型: </Text>
              <Text>
                {applicationType === 'instance' && '实例申请'}
                {applicationType === 'database' && '数据库申请'}
                {applicationType === 'table' && '表申请'}
              </Text>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>数据源: </Text>
              <Text>
                {dataSources.find(ds => ds.id === selectedDataSource)?.name || '未选择'}
              </Text>
            </div>
            
            <Divider />
            
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                {applicationType === 'instance' && (
                  <>
                    <Col span={12}>
                      <Form.Item name="instanceName" label="实例名称" noStyle>
                        <Text strong>实例名称: </Text>
                        <Text>{form.getFieldValue('instanceName')}</Text>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="instanceType" label="实例类型" noStyle>
                        <Text strong>实例类型: </Text>
                        <Text>{form.getFieldValue('instanceType')}</Text>
                      </Form.Item>
                    </Col>
                  </>
                )}
                
                {applicationType === 'database' && (
                  <>
                    <Col span={12}>
                      <Form.Item name="databaseName" label="数据库名称" noStyle>
                        <Text strong>数据库名称: </Text>
                        <Text>{form.getFieldValue('databaseName')}</Text>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="instanceId" label="所属实例" noStyle>
                        <Text strong>所属实例: </Text>
                        <Text>{form.getFieldValue('instanceId')}</Text>
                      </Form.Item>
                    </Col>
                  </>
                )}
                
                {applicationType === 'table' && (
                  <>
                    <Col span={12}>
                      <Form.Item name="tableName" label="表名称" noStyle>
                        <Text strong>表名称: </Text>
                        <Text>{form.getFieldValue('tableName')}</Text>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="databaseName" label="所属数据库" noStyle>
                        <Text strong>所属数据库: </Text>
                        <Text>{form.getFieldValue('databaseName')}</Text>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="tableSchema" label="表结构定义" noStyle>
                        <Text strong>表结构定义: </Text>
                        <Text>{form.getFieldValue('tableSchema')}</Text>
                      </Form.Item>
                    </Col>
                  </>
                )}
                
                <Col span={24}>
                  <Form.Item name="reason" label="申请原因" noStyle>
                    <Text strong>申请原因: </Text>
                    <Text>{form.getFieldValue('reason')}</Text>
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item name="description" label="描述" noStyle>
                    <Text strong>描述: </Text>
                    <Text>{form.getFieldValue('description')}</Text>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>
          <Space>
            <FileProtectOutlined />
            数据源申请
          </Space>
        </Title>
        <p style={{ color: '#666', marginTop: '8px' }}>申请新的数据库实例、数据库或数据表</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <div style={{ padding: '24px' }}>
          <Title level={4} style={{ marginTop: 0 }}>
            <Space>
              <FileProtectOutlined />
              数据源申请
            </Space>
          </Title>
          
          <Steps 
            current={currentStep} 
            style={{ marginTop: '24px', marginBottom: '24px' }}
          >
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          
          <div style={{ minHeight: '400px' }}>
            {steps[currentStep].content}
          </div>
          
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit}>
                提交申请
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataSourceApplication;