# 功能 #9: 用户引导和帮助

## 需求分析

### 业务目标
- 提供用户引导
- 帮助用户快速上手
- 减少学习成本

### 功能需求
1. **引导系统**
   - 新手引导
   - 功能提示
   - 视频教程

2. **帮助系统**
   - 在线帮助
   - FAQ
   - 联系支持

3. **用户交互**
   - 引导进度
   - 跳过引导
   - 重新开始

### 技术方案

#### 组件结构
```
components/UserGuide/
├── UserGuide.tsx               # 主组件
├── VideoTutorial.tsx           # 视频教程
├── FAQSection.tsx              # FAQ 模块
├── InteractiveGuide.tsx        # 交互式引导
├── useUserGuide.ts             # 引导 hook
└── api.ts                      # API 调用
```

#### 数据流
```
1. 用户访问页面
   ↓
2. useUserGuide 检查引导状态
   ↓
3. InteractiveGuide 显示引导
   ↓
4. 用户完成引导
```

#### API 端点
```
GET  /api/v2/user-guide/status
POST /api/v2/user-guide/mark-complete
GET  /api/v2/faq
```

#### 请求格式
```json
{
  "feature": "cost-prediction",
  "completed": true
}
```

#### 依赖库
- `react-tour` - 交互式引导
- `react-player` - 视频播放

#### 开发任务
1. 创建组件目录结构
2. 实现 useUserGuide hook
3. 实现 InteractiveGuide 组件
4. 实现 VideoTutorial 组件
5. 实现 FAQSection 组件
6. 集成到各个页面
7. 测试和优化

#### 预计工作量
- 组件开发: 4-6 小时
- 视频制作: 2-4 小时
- 集成测试: 1-2 小时
- 文档: 0.5 小时
- **总计: 7.5-12.5 小时**
