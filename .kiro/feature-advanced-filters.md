# 功能 #4: 高级筛选和搜索

## 需求分析

### 业务目标
- 增强现有的筛选系统
- 支持复杂查询条件
- 保存常用筛选条件

### 功能需求
1. **高级筛选**
   - 多条件组合
   - 逻辑运算符（AND/OR/NOT）
   - 动态字段选择

2. **搜索功能**
   - 全局搜索
   - 字段级搜索
   - 模糊匹配

3. **保存筛选**
   - 保存常用条件
   - 共享筛选条件
   - 筛选模板

4. **用户交互**
   - 筛选器构建器
   - 筛选条件显示
   - 批量操作

### 技术方案

#### 组件结构
```
components/AdvancedFilterBuilder/
├── AdvancedFilterBuilder.tsx   # 主构建器
├── FilterCondition.tsx         # 筛选条件
├── SavedFilters.tsx            # 保存的筛选器
├── FilterPreview.tsx           # 筛选预览
├── useFilterBuilder.ts         # 筛选器 hook
└── api.ts                      # API 调用
```

#### 数据流
```
1. 用户添加筛选条件
   ↓
2. useFilterBuilder 处理条件
   ↓
3. FilterCondition 渲染条件
   ↓
4. 用户保存筛选器
   ↓
5. FilterPreview 显示预览
```

#### API 端点
```
GET  /api/v2/filters
POST /api/v2/filters
DELETE /api/v2/filters/{id}
```

#### 请求格式
```json
{
  "name": "High Cost Resources",
  "conditions": [
    {"field": "cost", "operator": "gt", "value": 1000},
    {"field": "cloudType", "operator": "eq", "value": "aws"}
  ],
  "logic": "AND"
}
```

#### 依赖库
- `react-hook-form` - 表单处理（已存在）
- `date-fns` - 日期处理（已存在）

#### 开发任务
1. 创建组件目录结构
2. 实现 useFilterBuilder hook
3. 实现 FilterCondition 组件
4. 实现 SavedFilters 组件
5. 实现主 AdvancedFilterBuilder 组件
6. 集成到资源列表
7. 测试和优化

#### 预计工作量
- 组件开发: 6-8 小时
- 集成测试: 2-3 小时
- 文档: 1 小时
- **总计: 9-12 小时**
