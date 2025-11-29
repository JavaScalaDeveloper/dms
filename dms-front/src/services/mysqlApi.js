import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

// 创建 axios 实例
const mysqlApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL, // 后端API基础URL
  timeout: 30000, // 延长超时时间到30秒
  headers: {
    'Content-Type': 'application/json',
  }
});

// 合并的请求拦截器
mysqlApiClient.interceptors.request.use(
  (config) => {
    console.log('HTTP请求发送:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      data: config.data,
    });
    // 可以在这里添加认证token等
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('HTTP请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 合并的响应拦截器
mysqlApiClient.interceptors.response.use(
  (response) => {
    console.log('HTTP响应接收:', {
      url: response.config?.url,
      status: response.status,
      data: response.data
    });
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
    console.error('HTTP响应错误:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response
    });
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
  getDatabases: () => {
    console.log('准备调用MySQL数据库列表API');
    console.log('API URL:', `${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/list`);
    console.log('完整URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/list`);
    return mysqlApiClient.post(`${API_CONFIG.MYSQL_ENDPOINTS.DATABASES}/list`)
      .then(response => {
        console.log('MySQL数据库列表API调用成功，响应:', response);
        return response;
      })
      .catch(error => {
        console.error('MySQL数据库列表API调用失败:', error);
        console.error('错误详情:', error.response?.data || error.message);
        throw error;
      });
  },
  
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

// 结构设计相关API
export const schemaDesignApi = {
  createWorkOrder: (data) => mysqlApiClient.post(`${API_CONFIG.SCHEMA_ENDPOINTS.WORK_ORDERS}/create`, data),
  getWorkOrders: () => mysqlApiClient.post(`${API_CONFIG.SCHEMA_ENDPOINTS.WORK_ORDERS}/list`),
};

// 表结构设计相关API
export const tableStructureDesignApi = {
  save: (data) => mysqlApiClient.post(`/table-structure-design-detail/save`, data),
  getByWorkOrderId: (workOrderId) => mysqlApiClient.post(`/table-structure-design-detail/get-by-work-order`, { workOrderId }),
  listByWorkOrderId: (workOrderId) => mysqlApiClient.get(`/table-structure-design-detail/list-by-work-order?workOrderId=${workOrderId}`),
};

export default mysqlApiClient;