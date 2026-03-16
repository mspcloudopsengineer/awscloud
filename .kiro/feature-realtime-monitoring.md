# 功能 #2: 实时成本监控

## 需求分析

### 业务目标
- 实时显示云成本变化
- 及时发现异常成本波动
- 提供成本变化提醒

### 功能需求
1. **实时数据**
   - WebSocket 连接实时更新
   - 成本变化频率设置（每分钟/5分钟/15分钟）
   - 多云成本实时汇总

2. **可视化**
   - 实时成本曲线
   - 成本变化百分比
   - 异常波动标记

3. **提醒功能**
   - 成本异常预警
   - 预算超支提醒
   - 自定义阈值提醒

4. **用户交互**
   - 实时刷新开关
   - 提醒设置
   - 历史变化查看

### 技术方案

#### 组件结构
```
components/RealtimeCost/
├── RealtimeCostMonitor.tsx     # 主组件
├── RealtimeChart.tsx           # 实时图表
├── RealtimeAlerts.tsx          # 实时提醒
├── useRealtimeCost.ts          # WebSocket hook
└── api.ts                      # API 调用
```

#### 数据流
```
1. 建立 WebSocket 连接
   ↓
2. 接收实时成本数据
   ↓
3. useRealtimeCost hook 处理数据
   ↓
4. RealtimeChart 渲染实时曲线
   ↓
5. 检查预警条件
   ↓
6. RealtimeAlerts 显示提醒
```

#### WebSocket 端点
```
ws://api.cloudhub.com/v2/cost-realtime?dataSourceId={id}
```

#### 消息格式
```json
{
  "type": "cost-update",
  "timestamp": "2026-03-15T12:00:00Z",
  "cost": 1050.50,
  "change": 2.5,
  "cloudAccounts": [
    {"id": "aws-123", "cost": 500, "change": 1.2},
    {"id": "azure-456", "cost": 300, "change": 3.5}
  ]
}
```

#### 依赖库
- `react-plotly.js` - 图表渲染（已存在）
- `date-fns` - 日期处理（已存在）

#### 开发任务
1. 创建组件目录结构
2. 实现 useRealtimeCost hook
3. 实现 RealtimeChart 组件
4. 实现 RealtimeAlerts 组件
5. 实现主 RealtimeCostMonitor 组件
6. 集成到仪表板
7. 测试和优化

#### 预计工作量
- 组件开发: 5-7 小时
- 集成测试: 2-3 小时
- 文档: 1 小时
- **总计: 8-11 小时**
