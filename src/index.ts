#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// 定义工具参数的 Zod schema
const GetWeatherArgsSchema = z.object({
  location: z.string().describe('The location to get weather for'),
});

const GetTimeArgsSchema = z.object({
  timezone: z.string().optional().describe('The timezone to get time for (optional)'),
});

// 创建 MCP 服务器实例
const server = new Server(
  {
    name: 'lulabs-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义可用的工具
const tools: Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather information for a location',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The location to get weather for',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'get_time',
    description: 'Get current time, optionally for a specific timezone',
    inputSchema: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'The timezone to get time for (optional)',
        },
      },
      required: [],
    },
  },
];

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_weather': {
        const { location } = GetWeatherArgsSchema.parse(args);

        // 模拟天气数据
        const weatherData = {
          location,
          temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
          condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 100),
          windSpeed: Math.floor(Math.random() * 20),
        };

        return {
          content: [
            {
              type: 'text',
              text: `Weather in ${location}:\n` +
                `Temperature: ${weatherData.temperature}°C\n` +
                `Condition: ${weatherData.condition}\n` +
                `Humidity: ${weatherData.humidity}%\n` +
                `Wind Speed: ${weatherData.windSpeed} km/h`,
            },
          ],
        };
      }

      case 'get_time': {
        const { timezone } = GetTimeArgsSchema.parse(args);

        const now = new Date();
        const timeString = timezone
          ? now.toLocaleString('en-US', { timeZone: timezone })
          : now.toLocaleString();

        return {
          content: [
            {
              type: 'text',
              text: `Current time${timezone ? ` in ${timezone}` : ''}: ${timeString}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 这行代码永远不会被执行，因为服务器会一直运行
  console.error('MCP server running on stdio');
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 启动主函数
main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});