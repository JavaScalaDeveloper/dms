# 数据资产管理平台前端

数据资产管理平台是一个基于React和Ant Design的数据管理工具，支持多种数据库类型的连接、管理和查询。

## 功能特性

- **多数据源支持**：支持事务型（MySQL/TiDB）、分析型（ClickHouse/StarRocks/Elasticsearch）和日志型（SLS）数据库
- **数据源管理**：完整的增删改查功能，支持数据源连接测试
- **SQL查询**：在线SQL编辑器，支持语法高亮和执行查询
- **对象浏览**：树形结构展示数据库实例、数据库和表
- **数据源申请**：向导式申请流程，支持实例、数据库和表的申请
- **查询历史**：保存和重用历史查询记录
- **书签管理**：保存常用查询语句

## 技术栈

- React 18
- Ant Design 5
- React Router 6
- Axios
- Vite

## 目录结构

```
src/
├── components/          # 公共组件
│   ├── DataSourceForm.jsx    # 数据源表单组件
│   ├── DbObjectTree.jsx      # 数据库对象树组件
│   └── SqlEditor.jsx         # SQL编辑器组件
├── pages/               # 页面组件
│   ├── DataSourceApplication.jsx  # 数据源申请页面
│   ├── DataSourceManagement.jsx   # 数据源管理页面
│   └── SqlQuery.jsx              # SQL查询页面
├── services/            # API服务
│   └── api.js                # 接口封装
└── App.jsx              # 主应用组件
```

## 快速开始

### 启动项目

```bash
# 使用一键启动脚本（需要先创建启动脚本）
./start.sh

# 或者手动启动
npm install
npm run dev
```

### 构建项目

```bash
npm run build
```

## 使用说明

1. **数据源管理**：
   - 在"数据源管理"页面添加、编辑或删除数据源连接
   - 支持测试连接功能验证配置是否正确

2. **SQL查询**：
   - 在"SQL查询"页面选择数据源并执行SQL语句
   - 支持查询历史和书签功能

3. **数据源申请**：
   - 在"数据源申请"页面按向导流程申请新的实例、数据库或表

## 开发规范

- 使用函数式组件和Hooks
- 遵循Ant Design设计规范
- 组件文件使用.jsx扩展名
- 样式统一使用Ant Design组件库

## 注意事项

- 前端默认访问后端API地址：`http://localhost:8080/api`
- 请确保后端服务已启动后再使用前端功能