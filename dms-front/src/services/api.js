import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API基础URL
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 数据源相关API
export const dataSourceApi = {
  // 获取所有数据源
  getDataSources: () => apiClient.get('/datasources'),
  
  // 获取单个数据源
  getDataSource: (id) => apiClient.get(`/datasources/${id}`),
  
  // 创建数据源
  createDataSource: (data) => apiClient.post('/datasources', data),
  
  // 更新数据源
  updateDataSource: (id, data) => apiClient.put(`/datasources/${id}`, data),
  
  // 删除数据源
  deleteDataSource: (id) => apiClient.delete(`/datasources/${id}`),
  
  // 测试数据源连接
  testConnection: (data) => apiClient.post('/datasources/test-connection', data)
};

// SQL查询相关API
export const sqlApi = {
  // 执行SQL查询
  executeQuery: (data) => apiClient.post('/sql/execute', data),
  
  // 保存查询
  saveQuery: (data) => apiClient.post('/sql/save-query', data),
  
  // 获取查询历史
  getQueryHistory: () => apiClient.get('/sql/query-history')
};

// 数据库对象相关API（实例/数据库/表）
export const dbObjectApi = {
  // 获取实例列表
  getInstances: (dataSourceId) => apiClient.get(`/datasources/${dataSourceId}/instances`),
  
  // 获取数据库列表
  getDatabases: (dataSourceId, instanceId) => apiClient.get(`/datasources/${dataSourceId}/instances/${instanceId}/databases`),
  
  // 获取表列表
  getTables: (dataSourceId, instanceId, databaseName) => apiClient.get(`/datasources/${dataSourceId}/instances/${instanceId}/databases/${databaseName}/tables`),
  
  // 申请实例
  applyInstance: (data) => apiClient.post('/applications/instance', data),
  
  // 申请数据库
  applyDatabase: (data) => apiClient.post('/applications/database', data),
  
  // 申请表
  applyTable: (data) => apiClient.post('/applications/table', data)
};

export default apiClient;