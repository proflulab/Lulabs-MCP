// 日期处理工具函数

// 将日期字符串转换为毫秒时间戳
export function dateToTimestamp(dateStr: string): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`无效的日期格式: ${dateStr}，请使用 YYYY-MM-DD 格式`);
  }
  return date.getTime();
}

// 验证时间区间（最长31天）
export function validateTimeRange(startTime: string, endTime: string): void {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start > end) {
    throw new Error('开始时间不能晚于结束时间');
  }

  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 31) {
    throw new Error('时间区间不能超过31天');
  }
}