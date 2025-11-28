// API配置文件
const API_CONFIG = {
  // 后端服务基础URL
  BASE_URL: 'http://localhost:9000/api',
  
  // MySQL相关API端点
  MYSQL_ENDPOINTS: {
    INSTANCES: '/mysql/instances',
    DATABASES: '/mysql/databases',
    TABLES: '/mysql/tables'
  }
};

export default API_CONFIG;