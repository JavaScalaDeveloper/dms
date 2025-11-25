#!/bin/bash

# 数据资产管理平台前端一键启动脚本

echo "==========================================="
echo "  数据资产管理平台前端启动脚本"
echo "==========================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null
then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null
then
    echo "错误: 未检测到npm，请先安装npm"
    exit 1
fi

echo "检测到 Node.js 版本: $(node -v)"
echo "检测到 npm 版本: $(npm -v)"

# 检查是否存在node_modules目录
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖包安装失败"
        exit 1
    fi
    echo "依赖包安装完成!"
else
    echo "依赖包已存在，跳过安装步骤"
fi

echo "正在启动开发服务器..."
echo "访问地址: http://localhost:5173"
echo "按 Ctrl+C 停止服务器"

# 启动开发服务器
npm run dev