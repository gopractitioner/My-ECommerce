# MyEcommerce 电商平台

基于React、.NET、PostgreSQL、Redis和RabbitMQ的现代电商平台。

## 项目概述

MyEcommerce是一个功能完整的电商平台，提供：

- 用户注册与登录
- 商品浏览与搜索
- 购物车管理
- 订单处理
- 支付集成

## 技术栈

- **前端**：React + TypeScript
- **后端**：.NET 6
- **数据库**：PostgreSQL
- **缓存**：Redis
- **消息队列**：RabbitMQ
- **容器化**：Docker

## 开发环境设置

### 前提条件

- Docker和Docker Compose
- .NET 6 SDK
- Node.js 16+
- npm 8+

### 启动步骤

1. 启动基础设施容器：

```bash
docker-compose up -d
```

2. 启动后端服务：

```bash
cd backend && dotnet run
```

3. 启动前端应用：

```bash
cd frontend && npm install && npm start
```

## 项目结构

```
myecommerce/
├── frontend/        # React前端应用
├── backend/         # .NET后端API
└── docker/          # Docker相关配置
```

## API文档

API文档可在后端启动后访问：http://localhost:5000/swagger

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request
