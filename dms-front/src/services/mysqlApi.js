import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

// 创建 axios 实例
const mysqlApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // 后端API基础URL
  timeout: 10000,
});

// 请求拦截器
mysqlApiClient.interceptors.request.use(
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
mysqlApiClient.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    const data = response.data;
    if (data.success === false) {
      // 如果后端返回success为false，抛出错误
      const error = new Error(data.message || '操作失败');
      error.response = response;
      return Promise.reject(error);
    }
    return data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// MySQL实例相关API
export const mysqlInstanceApi = {
  // 获取所有实例
  getInstances: () => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.INSTANCES}/list`),
  
  // 获取单个实例
  getInstance: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.INSTANCES}/get`, { id }),
  
  // 创建实例
  createInstance: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.INSTANCES}/create`, data),
  
  // 更新实例
  updateInstance: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.INSTANCES}/update`, data),
  
  // 删除实例
  deleteInstance: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.INSTANCES}/delete`, { id })
};

// MySQL数据库相关API
export const mysqlDatabaseApi = {
  // 获取所有数据库
  getDatabases: () => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/list`),
  
  // 根据实例地址获取数据库
  getDatabasesByInstanceHost: (instanceHost) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/listByInstanceHost`, { instanceHost }),
  
  // 获取单个数据库
  getDatabase: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/get`, { id }),
  
  // 创建数据库
  createDatabase: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/create`, data),
  
  // 更新数据库
  updateDatabase: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/update`, data),
  
  // 删除数据库
  deleteDatabase: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/delete`, { id })
};

// MySQL表相关API
export const mysqlTableApi = {
  // 获取所有表
  getTables: () => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/list`),
  
  // 根据数据库ID获取表
  getTablesByDatabaseId: (databaseId) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/listByDatabaseId`, { databaseId }),
  
  // 获取单个表
  getTable: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/get`, { id }),
  
  // 创建表
  createTable: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/create`, data),
  
  // 更新表
  updateTable: (data) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/update`, data),
  
  // 删除表
  deleteTable: (id) => mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.TABLES}/delete`, { id })
};

export default mysqlApiClient;