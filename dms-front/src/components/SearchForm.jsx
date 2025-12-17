import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = ({ onSearch, onReset, fields, loading }) => {
  const [form] = Form.useForm();

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      // 处理日期范围字段
      if (values.dateRange) {
        values.startTime = values.dateRange[0]?.format('YYYY-MM-DD HH:mm:ss');
        values.endTime = values.dateRange[1]?.format('YYYY-MM-DD HH:mm:ss');
        delete values.dateRange;
      }
      onSearch(values);
    } catch (error) {
      console.log('查询参数验证失败:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Row gutter={24}>
        {fields.map(field => (
          <Col key={field.name} span={field.span || 6}>
            <Form.Item name={field.name} label={field.label}>
              {field.type === 'select' ? (
                <Select placeholder={field.placeholder || '请选择'}>
                  {field.options?.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              ) : field.type === 'dateRange' ? (
                <RangePicker showTime style={{ width: '100%' }} />
              ) : field.type === 'number' ? (
                <Input type="number" placeholder={field.placeholder || '请输入'} />
              ) : (
                <Input placeholder={field.placeholder || '请输入'} />
              )}
            </Form.Item>
          </Col>
        ))}
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleSearch}
                loading={loading}
              >
                查询
              </Button>
              <Button icon={<SyncOutlined />} onClick={handleReset}>
                重置
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;