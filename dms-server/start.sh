#!/bin/bash

# 后端项目启动脚本
# 该脚本会先清理Maven，然后启动Spring Boot应用

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 设置项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日志文件
LOG_FILE="$PROJECT_DIR/logs/app.log"
mkdir -p "$PROJECT_DIR/logs"

# 进入项目目录
cd "$PROJECT_DIR"

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}  DMS后端服务启动脚本${NC}"
echo -e "${GREEN}===========================================${NC}"
echo "项目目录: $PROJECT_DIR"
echo "日志文件: $LOG_FILE"
echo

# 检查Maven是否安装
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}错误: 未找到Maven命令，请先安装Maven${NC}"
    exit 1
fi

echo -e "${YELLOW}>>> 清理Maven项目...${NC}"
mvn clean >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: Maven清理失败，请查看日志文件: $LOG_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven清理完成${NC}"

echo
echo -e "${YELLOW}>>> 编译项目...${NC}"
mvn compile >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 项目编译失败，请查看日志文件: $LOG_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 项目编译完成${NC}"

echo
echo -e "${YELLOW}>>> 启动Spring Boot应用...${NC}"
echo "访问地址: http://localhost:8084"
echo "API基础路径: http://localhost:8084/api"
echo "H2控制台: http://localhost:8084/h2-console"
echo
echo "按 Ctrl+C 停止服务"
echo -e "${GREEN}===========================================${NC}"

# 启动应用并将输出同时写入日志文件
mvn spring-boot:run 2>&1 | tee -a "$LOG_FILE"

echo
echo -e "${GREEN}服务已停止${NC}"