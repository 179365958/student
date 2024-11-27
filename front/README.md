# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# 学生管理系统

## 当前状态
- [x] 基础框架搭建完成
- [x] 登录功能实现
- [x] 数据库连接配置
- [ ] 其他功能开发中

## 项目结构
D:\new\
├── front\          # Vue 3 + Element Plus
│   ├── src\
│   │   ├── api\
│   │   │   └── auth.js          # 认证相关API
│   │   ├── router\
│   │   │   └── index.js         # 路由配置
│   │   ├── stores\
│   │   │   └── user.js          # 用户状态管理
│   │   ├── utils\
│   │   │   └── request.js       # axios请求封装
│   │   ├── views\
│   │   │   ├── login\
│   │   │   │   └── Login.vue    # 登录页面
│   │   │   └── dashboard\
│   │   │       └── Index.vue    # 仪表盘
│   │   └── layouts\
│   │       └── DefaultLayout.vue # 默认布局
│   └── package.json
└── back\           # Node.js + Express + MSSQL
    ├── src\
    │   ├── controllers\
    │   │   └── authController.js # 认证控制器
    │   ├── routes\
    │   │   └── auth.js          # 认证路由
    │   ├── config\
    │   │   ├── db.js            # 数据库配置
    │   │   └── init.sql         # 数据库初始化SQL
    │   └── app.js               # 入口文件
    └── package.json

## 数据库信息
- 类型：SQL Server
- 数据库名：StudentDB
- 默认管理员账号：admin
- 默认密码：123456 (MD5: e10adc3949ba59abbe56e057f20f883e)

## 数据库表结构
-- Users 表
CREATE TABLE Users (
    UserID int IDENTITY(1,1),
    Username nvarchar(50),
    Password nvarchar(100),
    RealName nvarchar(50),
    Role nvarchar(20),
    Status bit,
    LastLoginTime bigint,
    CreateTime bigint,
    UpdateTime bigint
)

## 已实现功能
### 1. 用户认证
- [x] 登录接口 (/api/auth/login)
- [x] MD5 密码验证
- [x] JWT token 生成
- [x] 登录状态管理

### 2. 数据库连接
- [x] SQL Server 连接配置
- [x] 数据库初始化功能
- [x] 连接池管理

### 3. 前端页面
- [x] 登录页面
- [x] 基础布局
- [x] 路由配置
- [x] 状态管理

## 安装步骤

### 前端
cd front
npm install
npm run dev     # 开发环境
# 访问 http://localhost:8080

### 后端
cd back
npm install
npm start
# 服务运行在 http://localhost:3000

## 环境要求
- Node.js >= 14
- SQL Server 2012+
- Vue 3
- Element Plus

## 主要依赖
### 前端
- Vue 3
- Element Plus
- Pinia
- Vue Router
- Axios

### 后端
- Express
- MSSQL
- JWT
- Crypto (MD5)

## API 接口
### 认证相关
// 登录
POST /api/auth/login
Request: {
    username: string,
    password: string
}
Response: {
    success: boolean,
    data: {
        user: {
            id: number,
            username: string,
            role: string
        },
        token: string
    }
}

## 已知问题
1. Punycode 模块弃用警告（不影响功能）
2. 需要手动切换数据库上下文

## 注意事项
1. 确保 SQL Server 服务已启动
2. 首次使用需要初始化数据库
3. 默认使用 MD5 密码加密
4. 前端运行在 8080 端口
5. 后端运行在 3000 端口

## 下一步计划
- [ ] 学生管理模块
- [ ] 班级管理模块
- [ ] 成绩管理模块
- [ ] 考勤管理模块
- [ ] 用户管理模块