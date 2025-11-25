import React, { useState, useEffect } from 'react';
import { Tree, message, Spin } from 'antd';
import { 
  DatabaseOutlined, 
  FolderOutlined, 
  TableOutlined,
  ClusterOutlined
} from '@ant-design/icons';
import { dbObjectApi } from '../services/api';

const DbObjectTree = ({ dataSourceId, onNodeSelect }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataSourceId) {
      loadTreeData();
    }
  }, [dataSourceId]);

  const loadTreeData = async () => {
    setLoading(true);
    try {
      // 获取实例列表
      const instancesResponse = await dbObjectApi.getInstances(dataSourceId);
      const instances = instancesResponse.data;
      
      // 构建树形结构
      const tree = instances.map(instance => ({
        title: instance.name,
        key: `instance-${instance.id}`,
        icon: <ClusterOutlined />,
        children: [
          {
            title: '加载中...',
            key: `loading-${instance.id}`,
            isLeaf: true
          }
        ]
      }));
      
      setTreeData(tree);
    } catch (error) {
      message.error('加载数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onLoadData = async (node) => {
    const { key } = node;
    
    // 如果不是实例节点，不加载子节点
    if (!key.startsWith('instance-')) {
      return;
    }
    
    const instanceId = key.split('-')[1];
    
    try {
      // 获取数据库列表
      const databasesResponse = await dbObjectApi.getDatabases(dataSourceId, instanceId);
      const databases = databasesResponse.data;
      
      // 构建数据库节点
      const databaseNodes = databases.map(db => ({
        title: db.name,
        key: `db-${instanceId}-${db.name}`,
        icon: <DatabaseOutlined />,
        children: [
          {
            title: '加载中...',
            key: `loading-db-${instanceId}-${db.name}`,
            isLeaf: true
          }
        ]
      }));
      
      // 更新树形结构
      setTreeData(origin => 
        origin.map(node => {
          if (node.key === key) {
            return {
              ...node,
              children: databaseNodes
            };
          }
          return node;
        })
      );
    } catch (error) {
      message.error('加载数据库失败: ' + error.message);
    }
  };

  const onLoadTables = async (node) => {
    const { key } = node;
    
    // 如果不是数据库节点，不加载子节点
    if (!key.startsWith('db-')) {
      return;
    }
    
    const parts = key.split('-');
    const instanceId = parts[1];
    const databaseName = parts[2];
    
    try {
      // 获取表列表
      const tablesResponse = await dbObjectApi.getTables(dataSourceId, instanceId, databaseName);
      const tables = tablesResponse.data;
      
      // 构建表节点
      const tableNodes = tables.map(table => ({
        title: table.name,
        key: `table-${instanceId}-${databaseName}-${table.name}`,
        icon: <TableOutlined />,
        isLeaf: true,
        tableInfo: table
      }));
      
      // 更新树形结构
      setTreeData(origin => {
        const updateNode = (nodes) => {
          return nodes.map(node => {
            if (node.key === key) {
              return {
                ...node,
                children: tableNodes
              };
            }
            
            if (node.children) {
              return {
                ...node,
                children: updateNode(node.children)
              };
            }
            
            return node;
          });
        };
        
        return updateNode(origin);
      });
    } catch (error) {
      message.error('加载表失败: ' + error.message);
    }
  };

  const handleTreeNodeExpand = (expandedKeys, { expanded, node }) => {
    if (expanded) {
      const { key } = node;
      
      // 如果是实例节点，加载数据库
      if (key.startsWith('instance-')) {
        onLoadData(node);
      }
      
      // 如果是数据库节点，加载表
      if (key.startsWith('db-')) {
        onLoadTables(node);
      }
    }
  };

  const handleTreeNodeSelect = (selectedKeys, { selected, node }) => {
    if (selected && onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: '300px' }}>
        {treeData.length > 0 ? (
          <Tree
            showIcon
            treeData={treeData}
            loadData={onLoadData}
            onExpand={handleTreeNodeExpand}
            onSelect={handleTreeNodeSelect}
            style={{ backgroundColor: '#fafafa', padding: '12px', borderRadius: '4px' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            请选择数据源以查看数据库对象
          </div>
        )}
      </div>
    </Spin>
  );
};

export default DbObjectTree;