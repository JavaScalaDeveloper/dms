import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Button,
  Table,
  message,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  Input,
  Tag
} from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import SqlEditor from '../components/SqlEditor';
import { dataSourceApi, sqlApi } from '../services/api';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const SqlQuery = () => {
  const [dataSources, setDataSources] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [tabs, setTabs] = useState([
    { id: '1', title: '查询1', dataSourceId: null, sqlQuery: '', queryResult: null, loading: false }
  ]);
  const [queryHistory, setQueryHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmarkName, setNewBookmarkName] = useState('');

  useEffect(() => {
    loadDataSources();
    loadQueryHistory();
    loadBookmarks();
    
    // 从localStorage恢复tabs状态
    const savedTabs = localStorage.getItem('sqlQueryTabs');
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) {
          setActiveTab(parsedTabs[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved tabs', e);
      }
    }
  }, []);

  // 保存tabs状态到localStorage
  useEffect(() => {
    localStorage.setItem('sqlQueryTabs', JSON.stringify(tabs));
  }, [tabs]);

  const loadBookmarks = async () => {
    try {
      const response = await sqlApi.getBookmarks();
      setBookmarks(response.data);
    } catch (error) {
      // 如果API不存在，使用本地存储
      const savedBookmarks = localStorage.getItem('sqlBookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    }
  };

  const loadDataSources = async () => {
    try {
      const response = await dataSourceApi.getDataSources();
      setDataSources(response.data);
    } catch (error) {
      message.error('加载数据源失败: ' + error.message);
    }
  };

  const loadQueryHistory = async () => {
    try {
      const response = await sqlApi.getQueryHistory();
      setQueryHistory(response.data);
    } catch (error) {
      message.error('加载查询历史失败: ' + error.message);
    }
  };

  const handleExecuteQuery = async (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab.dataSourceId) {
      message.warning('请选择数据源');
      return;
    }

    if (!tab.sqlQuery.trim()) {
      message.warning('请输入SQL查询语句');
      return;
    }

    // 更新tab状态为加载中
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, loading: true } : t
    ));
    
    try {
      const response = await sqlApi.executeQuery({
        dataSourceId: tab.dataSourceId,
        sql: tab.sqlQuery
      });
      
      // 更新tab结果
      setTabs(tabs.map(t => 
        t.id === tabId ? { ...t, queryResult: response.data, loading: false } : t
      ));
      message.success('查询执行成功');
    } catch (error) {
      message.error('查询执行失败: ' + error.message);
      // 更新tab状态为非加载中
      setTabs(tabs.map(t => 
        t.id === tabId ? { ...t, loading: false } : t
      ));
    }
  };

  const handleSaveQuery = async (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab.sqlQuery.trim()) {
      message.warning('请输入SQL查询语句');
      return;
    }

    try {
      await sqlApi.saveQuery({
        name: `查询${tabId}`,
        sql: tab.sqlQuery,
        dataSourceId: tab.dataSourceId
      });
      message.success('查询已保存');
      loadQueryHistory();
    } catch (error) {
      message.error('保存查询失败: ' + error.message);
    }
  };

  const handleSaveBookmark = async (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab.sqlQuery.trim()) {
      message.warning('请输入SQL查询语句');
      return;
    }

    if (!newBookmarkName.trim()) {
      message.warning('请输入书签名称');
      return;
    }

    const newBookmark = {
      id: Date.now(),
      name: newBookmarkName,
      sql: tab.sqlQuery,
      dataSourceId: tab.dataSourceId,
      createdAt: new Date().toISOString()
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    
    // 保存到本地存储
    localStorage.setItem('sqlBookmarks', JSON.stringify(updatedBookmarks));
    
    setNewBookmarkName('');
    message.success('书签已保存');
  };

  const handleDeleteBookmark = async (id) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    
    // 更新本地存储
    localStorage.setItem('sqlBookmarks', JSON.stringify(updatedBookmarks));
    
    message.success('书签已删除');
  };

  const handleUseBookmark = (tabId, bookmark) => {
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, sqlQuery: bookmark.sql, dataSourceId: bookmark.dataSourceId } : t
    ));
  };

  const handleUseHistoryQuery = (tabId, query) => {
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, sqlQuery: query.sql, dataSourceId: query.dataSourceId } : t
    ));
  };

  const handleClearQuery = (tabId) => {
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, sqlQuery: '' } : t
    ));
  };

  const handleFormatQuery = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab.sqlQuery) {
      // 简单的SQL格式化
      const formatted = tab.sqlQuery
        .replace(/;/g, ';\n')
        .replace(/FROM/g, '\nFROM')
        .replace(/WHERE/g, '\nWHERE')
        .replace(/GROUP BY/g, '\nGROUP BY')
        .replace(/ORDER BY/g, '\nORDER BY')
        .replace(/LIMIT/g, '\nLIMIT');
      
      setTabs(tabs.map(t => 
        t.id === tabId ? { ...t, sqlQuery: formatted } : t
      ));
    }
  };

  const handleDataSourceChange = (tabId, dataSourceId) => {
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, dataSourceId } : t
    ));
  };

  const handleSqlChange = (tabId, sqlQuery) => {
    setTabs(tabs.map(t => 
      t.id === tabId ? { ...t, sqlQuery } : t
    ));
  };

  const addNewTab = () => {
    const newTabId = `${Date.now()}`;
    const newTab = {
      id: newTabId,
      title: `查询${tabs.length + 1}`,
      dataSourceId: null,
      sqlQuery: '',
      queryResult: null,
      loading: false
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTabId);
  };

  const removeTab = (targetKey) => {
    if (tabs.length === 1) {
      message.warning('至少保留一个查询标签页');
      return;
    }
    
    const newTabs = tabs.filter(tab => tab.id !== targetKey);
    setTabs(newTabs);
    
    if (activeTab === targetKey) {
      setActiveTab(newTabs[0].id);
    }
  };

  const getColumns = (tab) => {
    return tab.queryResult ? tab.queryResult.columns.map(col => ({
      title: col,
      dataIndex: col,
      key: col
    })) : [];
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>SQL查询</Title>
        <p style={{ color: '#666', marginTop: '8px' }}>执行SQL查询语句并查看结果</p>
      </div>
      
      <Card bodyStyle={{ padding: '0' }}>
        <Title level={4} style={{ padding: '24px 24px 0 24px' }}>SQL查询</Title>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === 'add') {
              addNewTab();
            } else {
              removeTab(targetKey);
            }
          }}
          style={{ padding: '0 24px 24px 24px' }}
        >
          {tabs.map(tab => (
            <TabPane 
              tab={tab.title} 
              key={tab.id}
              closable={tabs.length > 1}
            >
              <div style={{ padding: '0 16px' }}>
                <div style={{ marginBottom: 16 }}>
                  <strong>选择数据源:</strong>
                  <Select
                    style={{ width: '300px', marginTop: 8 }}
                    placeholder="请选择数据源"
                    onChange={(value) => handleDataSourceChange(tab.id, value)}
                    value={tab.dataSourceId}
                  >
                    {dataSources.map(ds => (
                      <Option key={ds.id} value={ds.id}>{ds.name}</Option>
                    ))}
                  </Select>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong>SQL查询语句:</strong>
                    <Space>
                      <Button size="small" onClick={() => handleFormatQuery(tab.id)}>格式化</Button>
                      <Button size="small" onClick={() => handleClearQuery(tab.id)}>清空</Button>
                    </Space>
                  </div>
                  <SqlEditor
                    value={tab.sqlQuery}
                    onChange={(value) => handleSqlChange(tab.id, value)}
                    onExecute={() => handleExecuteQuery(tab.id)}
                    onSave={() => handleSaveQuery(tab.id)}
                    onHistory={() => {}}
                    loading={tab.loading}
                  />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <Card title="查询结果" size="small">
                    {tab.queryResult ? (
                      <Table
                        columns={getColumns(tab)}
                        dataSource={tab.queryResult.data}
                        pagination={{ pageSize: 10 }}
                        scroll={{ y: 300 }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p>执行查询后将在此显示结果</p>
                      </div>
                    )}
                  </Card>
                </div>
                
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Input
                      placeholder="书签名称"
                      value={newBookmarkName}
                      onChange={e => setNewBookmarkName(e.target.value)}
                      style={{ flex: 1, maxWidth: '300px' }}
                    />
                    <Button 
                      icon={<SaveOutlined />} 
                      onClick={() => handleSaveBookmark(tab.id)}
                      disabled={!tab.sqlQuery.trim() || !newBookmarkName.trim()}
                    >
                      保存书签
                    </Button>
                  </div>
                </div>
              </div>
            </TabPane>
          ))}
          
          <TabPane tab="查询历史" key="history">
            <div style={{ padding: '0 16px' }}>
              <Table
                columns={[{
                  title: '查询名称', dataIndex: 'name', key: 'name' },
                  { title: 'SQL语句', dataIndex: 'sql', key: 'sql' },
                  { title: '数据源', dataIndex: 'dataSourceName', key: 'dataSourceName' },
                  { 
                    title: '操作', 
                    key: 'action',
                    render: (_, record) => (
                      <Button 
                        type="link" 
                        onClick={() => handleUseHistoryQuery(activeTab, record)}
                      >
                        使用
                      </Button>
                    )
                  }
                ]}
                dataSource={queryHistory}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            </div>
          </TabPane>
                    
          <TabPane tab="书签" key="bookmarks">
            <div style={{ padding: '0 16px' }}>
              {bookmarks.length > 0 ? (
                <Table
                  columns={[{
                    title: '书签名称', 
                    dataIndex: 'name', 
                    key: 'name',
                    render: (text, record) => (
                      <Button 
                        type="link" 
                        onClick={() => handleUseBookmark(activeTab, record)}
                      >
                        {text}
                      </Button>
                    )
                  },
                  { 
                    title: 'SQL语句', 
                    dataIndex: 'sql', 
                    key: 'sql',
                    ellipsis: true
                  },
                  { 
                    title: '创建时间', 
                    dataIndex: 'createdAt', 
                    key: 'createdAt',
                    render: (text) => new Date(text).toLocaleString()
                  },
                  { 
                    title: '操作', 
                    key: 'action',
                    render: (_, record) => (
                      <Space>
                        <Button 
                          type="link" 
                          onClick={() => handleUseBookmark(activeTab, record)}
                        >
                          使用
                        </Button>
                        <Button 
                          type="link" 
                          danger
                          onClick={() => handleDeleteBookmark(record.id)}
                        >
                          删除
                        </Button>
                      </Space>
                    )
                  }]}
                  dataSource={bookmarks}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 'max-content' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>暂无书签，可以通过保存查询创建书签</p>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SqlQuery;