#!/usr/bin/env node

// 加载环境变量
import dotenv from 'dotenv';
dotenv.config();

import { getPersonalSummaryRecords, getMeetingSummaryRecords } from './build/feishuService.js';

// 简单的测试函数
async function testWithEnv() {
    console.log('🚀 开始测试飞书服务（带环境变量加载）...\n');
    
    try {
        // 检查环境变量
        console.log('检查环境变量...');
        console.log('LARK_APP_ID:', process.env.LARK_APP_ID ? '已配置' : '未配置');
        console.log('LARK_APP_SECRET:', process.env.LARK_APP_SECRET ? '已配置' : '未配置');
        
        if (!process.env.LARK_APP_ID || !process.env.LARK_APP_SECRET) {
            throw new Error('❌ 缺少环境变量 LARK_APP_ID 或 LARK_APP_SECRET');
        }
        
        console.log('✅ 环境变量已配置');
        
        // 测试个人总结查询
        console.log('\n📊 测试个人总结记录查询...');
        const personalRecords = await getPersonalSummaryRecords('杨仕明', '2025-08-01', '2025-08-21');
        console.log(`✅ 个人总结记录查询成功，找到 ${personalRecords.length} 条记录`);
        
        if (personalRecords.length > 0) {
            console.log('📋 第一条记录示例:');
            console.log('  - 会议名称:', personalRecords[0].fields?.meeting_name || 'N/A');
            console.log('  - 开始时间:', personalRecords[0].fields?.startAt_string || 'N/A');
            console.log('  - 参与者总结:', personalRecords[0].fields?.participant_summary ? '已存在' : '无');
        }
        
        // 测试会议总结查询
        console.log('\n🎯 测试会议总结记录查询...');
        const meetingRecords = await getMeetingSummaryRecords('杨仕明', '2025-08-01', '2025-08-21');
        console.log(`✅ 会议总结记录查询成功，找到 ${meetingRecords.length} 条记录`);
        
        if (meetingRecords.length > 0) {
            console.log('📋 第一条记录示例:');
            console.log('  - 会议名称:', meetingRecords[0].meeting_name || 'N/A');
            console.log('  - 开始时间:', meetingRecords[0].startAt_string || 'N/A');
            console.log('  - 会议总结:', meetingRecords[0].meeting_summary ? '已存在' : '无');
            console.log('  - 记录文件ID:', meetingRecords[0].record_file_id?.value?.[0]?.text || '无');
        }
        
        console.log('\n🎉 所有测试通过！飞书服务运行正常');
        
    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        if (error.message.includes('环境变量')) {
            console.log('\n💡 请确保:');
            console.log('1. 在项目根目录创建 .env 文件');
            console.log('2. 添加以下内容:');
            console.log('   LARK_APP_ID=your_actual_app_id');
            console.log('   LARK_APP_SECRET=your_actual_app_secret');
        }
        process.exit(1);
    }
}

// 运行测试
testWithEnv();