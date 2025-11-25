import React from 'react';
import { Form, Input, Select, InputNumber, Switch } from 'antd';
import { dbObjectApi } from '../services/api';

const { Option } = Select;

const getSubtypeLabel = (subtype) => {
  // 对于某些特殊子类型，返回特定的标签以提高可读性
  const labels = {
    'elasticsearch': 'Elasticsearch',
    'sls': 'SLS'
  };
  return labels[subtype] || subtype.toUpperCase();
};

const DataSourceForm = ({ form, onTypeChange, dataSourceTypes }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="数据源名称"
        rules={[{ required: true, message: '请输入数据源名称' }]}
      >
        <Input placeholder="请输入数据源名称" />
      </Form.Item>
      
      <Form.Item
        name="type"
        label="数据源类型"
        rules={[{ required: true, message: '请选择数据源类型' }]}
      >
        <Select 
          placeholder="请选择数据源类型"
          onChange={onTypeChange}
        >
          {dataSourceTypes.map(type => (
            <Option key={type.value} value={type.value}>{type.label}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
      >
        {({ getFieldValue }) => {
          const type = getFieldValue('type');
          const subtypes = dataSourceTypes.find(t => t.value === type)?.subtypes || [];
          return (
            <Form.Item
              name="subtype"
              label="子类型"
              rules={[{ required: true, message: '请选择子类型' }]}
            >
              <Select placeholder="请选择子类型">
                {subtypes.map(subtype => (
                  <Option key={subtype} value={subtype}>{getSubtypeLabel(subtype)}</Option>
                ))}
              </Select>
            </Form.Item>
          );
        }}
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
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      
      <Form.Item
        name="description"
        label="描述"
      >
        <Input.TextArea placeholder="请输入描述信息" rows={3} />
      </Form.Item>
      
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.subtype !== currentValues.subtype}
      >
        {({ getFieldValue }) => {
          const subtype = getFieldValue('subtype');
          
          // Elasticsearch 特定字段
          if (subtype === 'elasticsearch') {
            return (
              <>
                <Form.Item
                  name="clusterName"
                  label="集群名称"
                >
                  <Input placeholder="请输入集群名称" />
                </Form.Item>
                
                <Form.Item
                  name="indexPattern"
                  label="索引模式"
                >
                  <Input placeholder="请输入索引模式" />
                </Form.Item>
              </>
            );
          }
          
          // SLS 特定字段
          if (subtype === 'sls') {
            return (
              <>
                <Form.Item
                  name="projectName"
                  label="项目名称"
                >
                  <Input placeholder="请输入项目名称" />
                </Form.Item>
                
                <Form.Item
                  name="logstoreName"
                  label="日志库名称"
                >
                  <Input placeholder="请输入日志库名称" />
                </Form.Item>
              </>
            );
          }
          
          return null;
        }}
      </Form.Item>
      
      <Form.Item
        name="enabled"
        label="是否启用"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default DataSourceForm;