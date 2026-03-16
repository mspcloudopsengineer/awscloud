# 功能 #3: 自定义仪表板

## 需求分析

### 业务目标
- 用户可自定义仪表板布局
- 拖拽式小部件管理
- 保存个性化配置

### 功能需求
1. **布局系统**
   - 拖拽式布局
   - 响应式网格
   - 小部件调整大小

2. **小部件系统**
   - 成本小部件
   - 资源小部件
   - 预测小部件
   - 实时监控小部件
   - 自定义小部件

3. **配置管理**
   - 保存/加载布局
   - 多用户配置
   - 配置模板

4. **用户交互**
   - 添加/删除小部件
   - 小部件设置
   - 布局预览

### 技术方案

#### 组件结构
```
components/DashboardBuilder/
├── DashboardBuilder.tsx        # 主构建器
├── WidgetContainer.tsx         # 小部件容器
├── WidgetSelector.tsx          # 小部件选择器
├── SavedDashboards.tsx         # 保存的仪表板
├── useDashboardLayout.ts       # 布局 hook
└── api.ts                      # API 调用
```

#### 数据流
```
1. 用户选择小部件
   ↓
2. 拖拽到布局区域
   ↓
3. useDashboardLayout 处理布局
   ↓
4. WidgetContainer 渲染小部件
   ↓
5. 用户保存布局
```

#### API 端点
```
GET  /api/v2/dashboard-layout
POST /api/v2/dashboard-layout
```

#### 请求格式
```json
{
  "layout": [
    {"widgetId": "cost-summary", "x": 0, "y": 0, "w": 2, "h": 1},
    {"widgetId": "realtime-cost", "x": 2, "y": 0, "w": 2, "h": 1}
  ],
  "name": "My Dashboard"
}
```

#### 依赖库
- `react-grid-layout` - 拖拽布局
- `react-draggable` - 拖拽功能

#### 开发任务
1. 创建组件目录结构
2. 实现 useDashboardLayout hook
3. 实现 WidgetContainer 组件
4. 实现 WidgetSelector 组件
5. 实现主 DashboardBuilder 组件
6. 集成到仪表板页面
7. 测试和优化

#### 预计工作量
- 组件开发: 8-12 小时
- 集成测试: 3-4 小时
- 文档: 1 小时
- **总计: 12-17 小时**
