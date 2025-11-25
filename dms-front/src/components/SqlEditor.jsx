import React, { useState, useRef } from 'react';
import { Input, Button, Space, Dropdown, Menu, message } from 'antd';
import { 
  PlayCircleOutlined, 
  SaveOutlined, 
  HistoryOutlined,
  DownOutlined,
  CopyOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

const SqlEditor = ({ 
  value, 
  onChange, 
  onExecute, 
  onSave, 
  onHistory,
  loading = false 
}) => {
  const textareaRef = useRef(null);

  const handleFormatSql = () => {
    if (value) {
      // 简单的SQL格式化示例
      const formatted = value
        .replace(/;/g, ';\n')
        .replace(/FROM/g, '\nFROM')
        .replace(/WHERE/g, '\nWHERE')
        .replace(/GROUP BY/g, '\nGROUP BY')
        .replace(/ORDER BY/g, '\nORDER BY')
        .replace(/LIMIT/g, '\nLIMIT');
      
      onChange(formatted);
      message.success('SQL已格式化');
    }
  };

  const handleCopySql = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      message.success('SQL已复制到剪贴板');
    }
  };

  const handleClearSql = () => {
    onChange('');
    message.success('SQL已清空');
  };

  const menu = (
    <Menu>
      <Menu.Item key="format" icon={<DownOutlined />} onClick={handleFormatSql}>
        格式化SQL
      </Menu.Item>
      <Menu.Item key="copy" icon={<CopyOutlined />} onClick={handleCopySql}>
        复制SQL
      </Menu.Item>
      <Menu.Item key="clear" icon={<ClearOutlined />} onClick={handleClearSql}>
        清空SQL
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <TextArea
        ref={textareaRef}
        rows={12}
        placeholder="请输入SQL语句，例如：SELECT * FROM users LIMIT 10;"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ fontFamily: 'monospace', marginBottom: 16 }}
      />
      
      <Space>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={onExecute}
          loading={loading}
        >
          执行查询
        </Button>
        
        <Button
          icon={<SaveOutlined />}
          onClick={onSave}
        >
          保存查询
        </Button>
        
        <Button
          icon={<HistoryOutlined />}
          onClick={onHistory}
        >
          查询历史
        </Button>
        
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            更多操作 <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default SqlEditor;