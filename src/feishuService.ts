import * as lark from '@larksuiteoapi/node-sdk';
import { dateToTimestamp } from './dateUtils.js';

// 飞书配置常量
export const FEISHU_CONFIG = {
  APP_TOKEN: 'bascn3E5jmRJ7IYDEBSrhoiT5if',
  TABLE_ID: 'tblx2YkTD5kn4MAL',
};

// 创建飞书客户端
export function createLarkClient(appId: string, appSecret: string) {
  return new lark.Client({
    appId,
    appSecret,
  });
}

// 获取飞书客户端实例
function getLarkClient() {
  const appId = process.env.LARK_APP_ID;
  const appSecret = process.env.LARK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('缺少必要的环境变量：LARK_APP_ID 和 LARK_APP_SECRET');
  }

  return createLarkClient(appId, appSecret);
}

// 查询个人总结记录
export async function getPersonalSummaryRecords(
  studentName: string,
  startTime: string,
  endTime: string
) {
  const startTimestamp = dateToTimestamp(startTime);
  const endTimestamp = dateToTimestamp(endTime);
  const client = getLarkClient();

  const response = await client.bitable.v1.appTableRecord.search({
    path: {
      app_token: FEISHU_CONFIG.APP_TOKEN,
      table_id: FEISHU_CONFIG.TABLE_ID,
    },
    params: {
      page_size: 500,
    },
    data: {
      field_names: ['name_search', 'meeting_name', 'participant_summary', 'meet_start_time', 'startAt_string'],
      filter: {
        conjunction: 'and',
        conditions: [
          {
            field_name: 'meet_start_time',
            operator: 'isGreater',
            value: ['ExactDate', startTimestamp.toString()],
          },
          {
            field_name: 'meet_start_time',
            operator: 'isLess',
            value: ['ExactDate', endTimestamp.toString()],
          },
          {
            field_name: 'name_search',
            operator: 'contains',
            value: [studentName],
          }
        ],
      },
      automatic_fields: false,
    },
  });

  return response.data?.items || [];
}

// 查询会议总结记录
export async function getMeetingSummaryRecords(
  studentName: string,
  startTime: string,
  endTime: string
) {
  const startTimestamp = dateToTimestamp(startTime);
  const endTimestamp = dateToTimestamp(endTime);
  const client = getLarkClient();

  const response = await client.bitable.v1.appTableRecord.search({
    path: {
      app_token: FEISHU_CONFIG.APP_TOKEN,
      table_id: FEISHU_CONFIG.TABLE_ID,
    },
    params: {
      page_size: 500,
    },
    data: {
      field_names: ['name_search', 'meeting_name', 'meeting_summary', 'meet_start_time', 'startAt_string', 'record_file_id'],
      filter: {
        conjunction: 'and',
        conditions: [
          {
            field_name: 'meet_start_time',
            operator: 'isGreater',
            value: ['ExactDate', startTimestamp.toString()],
          },
          {
            field_name: 'meet_start_time',
            operator: 'isLess',
            value: ['ExactDate', endTimestamp.toString()],
          },
          {
            field_name: 'name_search',
            operator: 'contains',
            value: [studentName],
          }
        ],
      },
      automatic_fields: false,
    },
  });

  const records = response.data?.items || [];

  // 去重会议（根据record_file_id去重）
  const uniqueMeetings = new Map();
  records.forEach((record: any) => {
    const fields = record.fields || {};
    // 提取record_file_id作为唯一标识
    const recordFileId = fields.record_file_id?.value?.[0]?.text;
    if (recordFileId && !uniqueMeetings.has(recordFileId)) {
      uniqueMeetings.set(recordFileId, fields);
    }
  });

  return Array.from(uniqueMeetings.values());
}