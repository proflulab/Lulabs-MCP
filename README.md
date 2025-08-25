# Lulabs MCP Server

一个基于 Model Context Protocol (MCP) 的服务器实现，提供天气查询和时间查询功能。

## 功能特性

- 🌤️ **天气查询**: 获取指定位置的当前天气信息
- 🕐 **时间查询**: 获取当前时间，支持指定时区
- 🔧 **标准 MCP 协议**: 完全兼容 MCP 标准
- 📦 **TypeScript 支持**: 使用 TypeScript 开发，提供类型安全

## 安装

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

## 使用方法

### 开发模式

```bash
# 监听文件变化并自动编译
npm run dev
```

### 生产模式

```bash
# 构建并启动服务器
npm run build
npm start
```

### 作为 MCP 服务器使用

该服务器通过 stdio 与 MCP 客户端通信。你可以在支持 MCP 的应用中配置此服务器：

```json
{
  "mcpServers": {
    "lulabs-mcp": {
      "command": "node",
      "args": ["/path/to/lulabs-mcp/build/index.js"]
    }
  }
}
```

## 可用工具

### get_weather

获取指定位置的天气信息。

**参数:**

- `location` (string, 必需): 要查询天气的位置

**示例:**

```json
{
  "name": "get_weather",
  "arguments": {
    "location": "北京"
  }
}
```

### get_time

获取当前时间，可选择指定时区。

**参数:**

- `timezone` (string, 可选): 时区标识符 (如: "Asia/Shanghai")

**示例:**

```json
{
  "name": "get_time",
  "arguments": {
    "timezone": "Asia/Shanghai"
  }
}
```

## 项目结构

```text
lulabs-mcp/
├── src/
│   └── index.ts          # 主服务器文件
├── build/                # 编译输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── LICENSE               # MIT 许可证
└── README.md             # 项目文档
```

## 开发

### 技术栈

- **TypeScript**: 主要开发语言
- **@modelcontextprotocol/sdk**: MCP 协议实现
- **Zod**: 运行时类型验证
- **Node.js**: 运行环境

### 添加新工具

1. 在 `tools` 数组中定义新工具的 schema
2. 为工具参数创建 Zod schema
3. 在 `CallToolRequestSchema` 处理器中添加新的 case
4. 实现工具的具体逻辑

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！
