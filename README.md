# 陆向谦实验室 MCP 服务

该 MCP 服务用于高效查询陆向谦实验室学员在例会中的总结记录，支持按学员、时间段和记录类型进行灵活筛选。通过该服务，用户可以获取指定学员在某31天周期内的会议总结数据，为后续的进度追踪、表现评估和数据分析提供支持。

## 项目概述

本项目是一个基于 Model Context Protocol (MCP) 的服务器实现，专门为陆向谦实验室设计，用于查询和管理学员的会议总结记录。服务通过飞书多维表格作为数据源，提供标准化的 MCP 接口供 AI 助手调用。

## 功能特性

### 1. 获取学员个人总结记录

- 仅返回与该学员自身相关的总结内容（不包含整体会议总结）
- 时间区间最长 31 天，单次最多返回 500 条记录
- 支持按姓名和时间段精确筛选

### 2. 获取会议整体总结记录

- 包含学员所在例会的全部会议总结（整体内容，不仅限于该学员）
- 时间区间最长 31 天，单次最多返回 500 条记录
- 自动去重相同会议的多条记录

## 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在使用前，您需要：

1. 在飞书开放平台创建应用
2. 获取应用的 `App ID` 和 `App Secret`
3. 设置环境变量：

```bash
export LARK_APP_ID="your_app_id"
export LARK_APP_SECRET="your_app_secret"
```

或者创建 `.env` 文件：

```env
LARK_APP_ID=your_app_id
LARK_APP_SECRET=your_app_secret
```

**注意**：项目已预配置飞书多维表格信息，无需额外配置表格 ID。

### 3. 构建项目

```bash
npm run build
```

### 4. 运行服务

```bash
npm start
```

## API 接口

### get_personal_summary

获取某学员指定时间段的个人总结记录。

**参数：**

- `name` (string): 学员姓名
- `start_time` (string): 查询区间开始时间（YYYY-MM-DD格式）
- `end_time` (string): 查询区间结束时间（YYYY-MM-DD格式）

**示例：**

```json
{
  "name": "张三",
  "start_time": "2024-01-01",
  "end_time": "2024-01-31"
}
```

### get_meeting_summary

获取某学员指定时间段的所有会议整体总结记录。

**参数：**

- `name` (string): 学员姓名
- `start_time` (string): 查询区间开始时间（YYYY-MM-DD格式）
- `end_time` (string): 查询区间结束时间（YYYY-MM-DD格式）

**示例：**

```json
{
  "name": "李四",
  "start_time": "2024-02-01",
  "end_time": "2024-02-28"
}
```

## 数据源

数据存储在飞书多维表格中，包含以下字段：

- `name_search`: 学员姓名搜索字段
- `meeting_name`: 会议名称
- `participant_summary`: 学员个人总结
- `meeting_summary`: 会议整体总结
- `meet_start_time`: 会议开始时间（毫秒时间戳）
- `startAt_string`: 会议开始时间（字符串格式）

## 限制和约束

1. **时间区间限制**：单次查询时间区间不能超过 31 天
2. **记录数量限制**：单次最多返回 500 条记录
3. **日期格式**：必须使用 YYYY-MM-DD 格式
4. **权限要求**：需要有效的飞书应用凭证和用户访问令牌

## 错误处理

服务包含完整的错误处理机制：

- 参数验证（日期格式、时间区间等）
- 飞书 API 调用错误处理
- 详细的错误信息返回

## 开发说明

### 项目结构

```text
Lulabs-MCP/
├── src/
│   ├── index.ts          # 主服务文件和 MCP 服务器实现
│   ├── feishuService.ts  # 飞书 API 服务封装
│   └── dateUtils.ts      # 日期处理工具函数
├── build/                # 编译输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── LICENSE               # MIT 许可证
└── README.md            # 项目文档
```

### 开发模式

```bash
npm run dev  # 监听文件变化并自动编译
```

### 技术栈

- **Node.js**: 运行环境
- **TypeScript**: 开发语言，配置为 ES2022 目标和 Node16 模块
- **@modelcontextprotocol/sdk**: MCP 协议实现 (v1.17.4)
- **@larksuiteoapi/node-sdk**: 飞书 API SDK (v1.31.0)
- **zod**: 参数验证和类型安全 (v3.25.76)

### MCP 服务器特性

- 基于标准输入输出 (stdio) 传输
- 支持工具调用 (tool calling)
- 完整的错误处理和参数验证
- 自动去重会议记录
- 环境变量配置管理

### 使用示例

作为 MCP 服务器，本项目通常与支持 MCP 协议的 AI 助手集成使用：

```bash
# 启动 MCP 服务器
npm start

# 或在开发模式下运行
npm run dev
```

### 环境要求

- Node.js 18+
- TypeScript 5.9+
- 有效的飞书应用凭证
- 访问陆向谦实验室飞书多维表格的权限

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 作者

- **Lulabs & YangShiming**
- Email: <shiming.y@qq.com>

## 支持

如有问题或建议，请联系陆向谦实验室技术团队。
