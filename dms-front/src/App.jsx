import React from 'react';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import {
  DatabaseOutlined,
  ConsoleSqlOutlined,
  HomeOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
  DatabaseFilled,
  CloudSyncOutlined,
  DownloadOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DataSourceManagement from './pages/DataSourceManagement';
import SqlQuery from './pages/SqlQuery';
import MysqlManagement from './pages/Transactional/MysqlManagement';
import TidbManagement from './pages/Transactional/TidbManagement';
import MongodbManagement from './pages/Transactional/MongodbManagement';
import ClickhouseManagement from './pages/Analytical/ClickhouseManagement';
import ElasticsearchManagement from './pages/Analytical/ElasticsearchManagement';
import StarrocksManagement from './pages/Analytical/StarrocksManagement';
import GbaseManagement from './pages/Graph/GbaseManagement';
import NebulaManagement from './pages/Graph/NebulaManagement';
import MilvusManagement from './pages/Other/MilvusManagement';
import HbaseManagement from './pages/Other/HbaseManagement';
import TsdbManagement from './pages/Other/TsdbManagement';

// 工单中心页面组件
import MyTickets from './pages/Ticket/MyTickets';
import Permissions from './pages/Ticket/Permissions';
import SchemaDesign from './pages/Ticket/DbDevelopment/SchemaDesign';
import SchemaSync from './pages/Ticket/DbDevelopment/SchemaSync';
import DataExport from './pages/Ticket/DbDevelopment/DataExport';
import DataArchive from './pages/Ticket/DbDevelopment/DataArchive';
import DataChange from './pages/Ticket/DbDevelopment/DataChange';
import DataCleanup from './pages/Ticket/DbDevelopment/DataCleanup';
import Resources from './pages/Ticket/Resources';
import DbPassword from './pages/Ticket/Other/DbPassword';
import './App.css';

const { Header, Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedColor: '#1890ff',
            itemHoverColor: '#1890ff',
            itemActiveBg: '#e6f7ff',
          },
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="header">
            <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              数据资产管理平台
            </div>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
                items={[
                  {
                    key: '1',
                    icon: <HomeOutlined />,
                    label: <Link to="/">首页</Link>,
                  },
                  {
                    key: '2',
                    icon: <DatabaseOutlined />,
                    label: '数据组件',
                    children: [
                      {
                        key: '2-1',
                        label: '事务型',
                        children: [
                          {
                            key: '2-1-1',
                            label: <Link to="/transactional/mysql">MySQL</Link>,
                          },
                          {
                            key: '2-1-2',
                            label: <Link to="/transactional/tidb">TiDB</Link>,
                          },
                          {
                            key: '2-1-3',
                            label: <Link to="/transactional/mongodb">MongoDB</Link>,
                          },
                        ],
                      },
                      {
                        key: '2-2',
                        label: '分析型',
                        children: [
                          {
                            key: '2-2-1',
                            label: <Link to="/analytical/clickhouse">ClickHouse</Link>,
                          },
                          {
                            key: '2-2-2',
                            label: <Link to="/analytical/elasticsearch">Elasticsearch</Link>,
                          },
                          {
                            key: '2-2-3',
                            label: <Link to="/analytical/starrocks">StarRocks</Link>,
                          },
                        ],
                      },
                      {
                        key: '2-3',
                        label: '图数据库',
                        children: [
                          {
                            key: '2-3-1',
                            label: <Link to="/graph/gbase">Gbase</Link>,
                          },
                          {
                            key: '2-3-2',
                            label: <Link to="/graph/nebula">Nebula</Link>,
                          },
                        ],
                      },
                      {
                        key: '2-4',
                        label: '其他数据库',
                        children: [
                          {
                            key: '2-4-1',
                            label: <Link to="/other/milvus">Milvus</Link>,
                          },
                          {
                            key: '2-4-2',
                            label: <Link to="/other/hbase">HBase</Link>,
                          },
                          {
                            key: '2-4-3',
                            label: <Link to="/other/tsdb">TSDB</Link>,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    key: '3',
                    icon: <ConsoleSqlOutlined />,
                    label: <Link to="/sql-query">SQL查询</Link>,
                  },
                  {
                    key: '4',
                    icon: <FileProtectOutlined />,
                    label: '工单中心',
                    children: [
                      {
                        key: '4-1',
                        icon: <FileSearchOutlined />,
                        label: <Link to="/ticket/my-tickets">我的工单</Link>,
                      },
                      {
                        key: '4-2',
                        icon: <SafetyCertificateOutlined />,
                        label: <Link to="/ticket/permissions">权限</Link>,
                      },
                      {
                        key: '4-3',
                        icon: <DatabaseFilled />,
                        label: '数据库开发',
                        children: [
                          {
                            key: '4-3-1',
                            icon: <SettingOutlined />,
                            label: <Link to="/ticket/db-development/schema-design">结构设计</Link>,
                          },
                          {
                            key: '4-3-2',
                            icon: <CloudSyncOutlined />,
                            label: <Link to="/ticket/db-development/schema-sync">结构同步</Link>,
                          },
                          {
                            key: '4-3-3',
                            icon: <DownloadOutlined />,
                            label: <Link to="/ticket/db-development/data-export">数据导出</Link>,
                          },
                          {
                            key: '4-3-4',
                            icon: <FolderOpenOutlined />,
                            label: <Link to="/ticket/db-development/data-archive">数据归档</Link>,
                          },
                          {
                            key: '4-3-5',
                            icon: <EditOutlined />,
                            label: <Link to="/ticket/db-development/data-change">数据变更</Link>,
                          },
                          {
                            key: '4-3-6',
                            icon: <DeleteOutlined />,
                            label: <Link to="/ticket/db-development/data-cleanup">数据清理</Link>,
                          },
                        ],
                      },
                      {
                        key: '4-4',
                        icon: <SettingOutlined />,
                        label: <Link to="/ticket/resources">资源</Link>,
                      },
                      {
                        key: '4-5',
                        icon: <FileProtectOutlined />,
                        label: '其他工单',
                        children: [
                          {
                            key: '4-5-1',
                            icon: <SafetyCertificateOutlined />,
                            label: <Link to="/ticket/other/db-password">数据库密码申请</Link>,
                          },
                        ],
                      },
                    ],
                  },

                ]}
              />
            </Sider>
            <Layout style={{ padding: '0' }}>
              <Content
                style={{
                  margin: 0,
                  minHeight: 280,
                  background: colorBgContainer,
                  padding: '24px',
                  width: '100%'
                }}
              >
                <Routes>
                  <Route path="/" element={<div>欢迎使用数据资产管理平台</div>} />
                  <Route path="/datasources" element={<DataSourceManagement />} />
                  <Route path="/sql-query" element={<SqlQuery />} />
                  <Route path="/transactional/mysql" element={<MysqlManagement />} />
                  <Route path="/transactional/tidb" element={<TidbManagement />} />
                  <Route path="/transactional/mongodb" element={<MongodbManagement />} />
                  <Route path="/analytical/clickhouse" element={<ClickhouseManagement />} />
                  <Route path="/analytical/elasticsearch" element={<ElasticsearchManagement />} />
                  <Route path="/analytical/starrocks" element={<StarrocksManagement />} />
                  <Route path="/graph/gbase" element={<GbaseManagement />} />
                  <Route path="/graph/nebula" element={<NebulaManagement />} />
                  <Route path="/other/milvus" element={<MilvusManagement />} />
                  <Route path="/other/hbase" element={<HbaseManagement />} />
                  <Route path="/other/tsdb" element={<TsdbManagement />} />
                  
                  {/* 工单中心路由 */}
                  <Route path="/ticket/my-tickets" element={<MyTickets />} />
                  <Route path="/ticket/permissions" element={<Permissions />} />
                  <Route path="/ticket/db-development/schema-design" element={<SchemaDesign />} />
                  <Route path="/ticket/db-development/schema-sync" element={<SchemaSync />} />
                  <Route path="/ticket/db-development/data-export" element={<DataExport />} />
                  <Route path="/ticket/db-development/data-archive" element={<DataArchive />} />
                  <Route path="/ticket/db-development/data-change" element={<DataChange />} />
                  <Route path="/ticket/db-development/data-cleanup" element={<DataCleanup />} />
                  <Route path="/ticket/resources" element={<Resources />} />
                  <Route path="/ticket/other/db-password" element={<DbPassword />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;