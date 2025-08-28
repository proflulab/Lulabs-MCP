# 陆向谦实验室 MCP 服务

该 MCP 服务用于高效查询陆向谦实验室学员在例会中的总结记录，支持按学员、时间段和记录类型进行灵活筛选。通过该服务，用户可以获取指定学员在某30天周期内的会议总结数据，为后续的进度追踪、表现评估和数据分析提供支持。

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

### 2. 配置飞书应用

在使用前，您需要：

1. 在飞书开放平台创建应用
2. 获取应用的 `App ID` 和 `App Secret`
3. 获取用户访问令牌 `User Access Token`
4. 修改 `src/index.ts` 中的配置：

```typescript
// 将 'your_app_id' 和 'your_app_secret' 替换为实际值
const client = createLarkClient('your_app_id', 'your_app_secret');
```

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
lulabs-mcp/
├── src/
│   └── index.ts          # 主服务文件
├── build/                # 编译输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目文档
```

### 开发模式

```bash
npm run dev  # 监听文件变化并自动编译
```

### 技术栈

- **Node.js**: 运行环境
- **TypeScript**: 开发语言
- **@modelcontextprotocol/sdk**: MCP 协议实现
- **@larksuiteoapi/node-sdk**: 飞书 API SDK
- **zod**: 参数验证

## 许可证

MIT License

## 支持

如有问题或建议，请联系陆向谦实验室技术团队。
