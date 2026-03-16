# 功能 #1: 成本预测模型

## 需求分析

### 业务目标
- 基于历史成本数据预测未来成本趋势
- 提前预警可能的预算超支
- 帮助用户制定成本控制策略

### 功能需求
1. **数据输入**
   - 历史成本数据（按天/周/月）
   - 时间范围选择（过去 30/90/180 天）
   - 成本类型选择（总成本、按云、按资源池）

2. **预测算法**
   - 简单线性回归（基础版）
   - 加权移动平均（中级版）
   - ARIMA 模型（高级版，可选）

3. **可视化**
   - 历史成本曲线
   - 预测成本曲线（带置信区间）
   - 成本差异显示

4. **用户交互**
   - 预测时间范围设置（未来 30/60/90 天）
   - 预警阈值设置
   - 导出预测报告

### 技术方案

#### 组件结构
```
components/CostPrediction/
├── CostPrediction.tsx          # 主组件
├── PredictionChart.tsx         # 预测图表
├── PredictionSettings.tsx      # 预测配置
├── PredictionSummary.tsx       # 预测摘要
├── useCostPrediction.ts        # 预测逻辑 hook
└── api.ts                      # API 调用
```

#### 数据流
```
1. 用户选择时间范围和成本类型
   ↓
2. 调用 API 获取历史成本数据
   ↓
3. useCostPrediction hook 处理预测
   ↓
4. PredictionChart 渲染图表
   ↓
5. 用户设置预警阈值
```

#### API 端点
```
GET /api/v2/cost-prediction?dataSourceId={id}&startDate={date}&endDate={date}&forecastDays={days}
```

#### 响应格式
```json
{
  "history": [
    {"date": "2026-01-01", "cost": 1000},
    {"date": "2026-01-02", "cost": 1050}
  ],
  "prediction": [
    {"date": "2026-02-01", "cost": 1100, "lower": 1050, "upper": 1150}
  ],
  "metrics": {
    "mape": 5.2,
    "rmse": 45.3
  }
}
```

#### 依赖库
- `react-plotly.js` - 图表渲染（已存在）
- `d3-array` - 数据处理（已存在）
- `date-fns` - 日期处理（已存在）

#### 开发任务
1. 创建组件目录结构
2. 实现 useCostPrediction hook
3. 实现 PredictionChart 组件
4. 实现 PredictionSettings 组件
5. 实现主 CostPrediction 组件
6. 集成到现有页面
7. 测试和优化

#### 预计工作量
- 组件开发: 4-6 小时
- 集成测试: 2-3 小时
- 文档: 1 小时
- **总计: 7-10 小时**
