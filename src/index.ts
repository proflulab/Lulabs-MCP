#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { validateTimeRange } from './dateUtils.js';
import { getPersonalSummaryRecords, getMeetingSummaryRecords } from './feishuService.js';

// 定义工具参数的 Zod schema
const GetPersonalSummaryArgsSchema = z.object({
  name: z.string().describe('学员姓名'),
  start_time: z.string().describe('查询区间开始时间（YYYY-MM-DD格式）'),
  end_time: z.string().describe('查询区间结束时间（YYYY-MM-DD格式）'),
});

const GetMeetingSummaryArgsSchema = z.object({
  name: z.string().describe('学员姓名'),
  start_time: z.string().describe('查询区间开始时间（YYYY-MM-DD格式）'),
  end_time: z.string().describe('查询区间结束时间（YYYY-MM-DD格式）'),
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
    name: 'get_personal_summary',
    description: '获取某学员指定时间段的个人总结记录（仅返回与该学员自身相关的总结内容）',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '学员姓名',
        },
        start_time: {
          type: 'string',
          description: '查询区间开始时间（YYYY-MM-DD格式）',
        },
        end_time: {
          type: 'string',
          description: '查询区间结束时间（YYYY-MM-DD格式）',
        },
      },
      required: ['name', 'start_time', 'end_time'],
    },
  },
  {
    name: 'get_meeting_summary',
    description: '获取某学员指定时间段的会议整体总结记录（返回包含该学员姓名的会议的整体总结，自动去重）',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '学员姓名',
        },
        start_time: {
          type: 'string',
          description: '查询区间开始时间（YYYY-MM-DD格式）',
        },
        end_time: {
          type: 'string',
          description: '查询区间结束时间（YYYY-MM-DD格式）',
        },
      },
      required: ['name', 'start_time', 'end_time'],
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
      case 'get_personal_summary': {
        const { name: studentName, start_time, end_time } = GetPersonalSummaryArgsSchema.parse(args);

        // 验证时间区间
        validateTimeRange(start_time, end_time);

        // 获取个人总结记录
        const records = await getPersonalSummaryRecords(studentName, start_time, end_time);

        return {
          content: [
            {
              type: 'text',
              text: `学员 ${studentName} 在 ${start_time} 至 ${end_time} 期间的个人总结记录：\n\n` +
                `共找到 ${records.length} 条记录\n\n` +
                records.map((record: any, index: number) => {
                  const fields = record.fields || {};
                  return `第${index + 1}条记录\n会议名称：${fields.meeting_name?.value?.[0]?.text || '未知'}\n` +
                    `会议开始时间：${fields.startAt_string?.value?.[0]?.text || '未知'}\n` +
                    `会议个人总结：${fields.participant_summary?.[0]?.text || '无总结'}\n`;
                }).join('\n'),
            },
          ],
        };
      }

      case 'get_meeting_summary': {
        const { name: studentName, start_time, end_time } = GetMeetingSummaryArgsSchema.parse(args);

        // 验证时间区间
        validateTimeRange(start_time, end_time);

        // 获取会议总结记录
        const meetingList = await getMeetingSummaryRecords(studentName, start_time, end_time);

        return {
          content: [
            {
              type: 'text',
              text: `学员 ${studentName} 在 ${start_time} 至 ${end_time} 期间参与的会议整体总结：\n\n` +
                `共找到 ${meetingList.length} 条录制会议记录\n\n` +
                meetingList.map((meeting: any, index: number) => {
                  return `第${index + 1}条会议录制记录\n会议名称：${meeting.meeting_name?.value?.[0]?.text || '未知'}\n` +
                    `会议开始时间：${meeting.startAt_string?.value?.[0]?.text || '未知'}\n` +
                    `会议总结：${meeting.meeting_summary?.value?.[0]?.text || '无总结'}\n`;
                }).join('\n'),
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