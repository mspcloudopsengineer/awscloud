# OptScale 项目整体介绍

## 项目概述

OptScale 是一个开源的 FinOps（金融运营）和云成本管理平台，旨在以最优的性能和成本运行任何云工作负载。该平台为各类组织提供有效的云成本管理解决方案。

### 核心价值
- **平均云成本节省**: 38%
- **服务组织数量**: 183+
- **开源协议**: Apache 2.0
- **支持的云平台**: AWS, Azure, Google Cloud, Alibaba Cloud, Kubernetes
- **支持的技术栈**: Databricks, MLflow, PyTorch, TensorFlow, Spark, Kubeflow

## 技术架构

### 整体架构特点
OptScale 采用微服务架构，基于 Kubernetes 部署，各服务通过消息队列和 REST API 进行通信。

### 技术栈

#### 后端技术
- **编程语言**: Python 3.12+
- **Web 框架**: Tornado (异步 Web 框架)
- **数据库**: 
  - MySQL (关系型数据库，使用 SQLAlchemy ORM)
  - MongoDB (文档数据库)
  - ClickHouse (列式数据库，用于分析)
  - InfluxDB (时序数据库)
- **消息队列**: Kombu (支持 RabbitMQ/Redis)
- **数据库迁移**: Alembic
- **容器化**: Docker + Kubernetes
- **包管理**: uv (现代 Python 包管理器)

#### 前端技术
- **框架**: React 18.2+ with TypeScript
- **构建工具**: Vite
- **Node 版本**: 22.16.0
- **包管理**: pnpm 10.12.1
- **GraphQL**: Apollo Client + Code Generator
- **UI 组件**: Material-UI

## 核心服务模块

### 1. 认证服务 (auth)

**目录**: `auth/`

**功能**:
- 用户认证和授权
- JWT Token 管理
- Zoho CRM 集成
- OAuth 2.0 支持

**关键组件**:
- `auth_server/`: 认证服务器核心逻辑
- `zoho_integrator/`: Zoho CRM 集成客户端
- 数据库迁移支持 (Alembic)

### 2. REST API 服务 (rest_api)

**目录**: `rest_api/`

**功能**:
- 核心业务逻辑 API
- 云资源管理
- 成本分析和优化建议
- 多云账户管理

**关键组件**:
- `rest_api_server/`: 主 API 服务器
- `google_calendar_client/`: Google Calendar 集成
- `optscale_console/`: 管理控制台
- `optscale_metrics/`: 指标收集和监控

**依赖服务**:
- ClickHouse (成本数据分析)
- MongoDB (资源元数据)
- MySQL (关系数据)
- Boto3 (AWS SDK)

### 3. 前端应用 (ngui)

**目录**: `ngui/`

**功能**:
- 用户界面
- 数据可视化
- 成本报表和仪表板
- 资源管理界面

**架构**:
- `ui/`: React 前端应用
- `server/`: Node.js BFF (Backend for Frontend) 层
- GraphQL API 网关

### 4. BI 导出服务 (bi_exporter)

**目录**: `bi_exporter/`

**功能**:
- 商业智能数据导出
- 报表生成
- 数据转换和聚合

### 5. 调度服务 (bumischeduler)

**目录**: `bumischeduler/`

**功能**:
- 任务调度
- 定时作业管理
- 工作流编排

### 6. 工作节点 (bumiworker)

**目录**: `bumiworker/`

**功能**:
- 异步任务处理
- 后台作业执行
- 状态转换管理

**关键文件**:
- `tasks.py`: 任务定义
- `transitions.py`: 状态机转换逻辑

### 7. 数据导入代理 (diproxy)

**目录**: `diproxy/`

**功能**:
- 云账单数据导入代理
- 存储客户端管理
- 数据预处理

### 8. 数据导入工作节点 (diworker)

**目录**: `diworker/`

**功能**:
- 云账单数据处理
- 多云平台数据导入
- 数据迁移和转换

**关键组件**:
- `importers/`: 各云平台导入器
- `migrations/`: 数据迁移脚本
- `migrator.py`: 迁移管理器

### 9. 流量处理服务 (trapper)

**目录**: `trapper/`

**功能**:
- 网络流量费用分析
- 流量模式识别
- 跨区域流量成本优化

### 10. 通知服务 (herald)

**目录**: `herald/`

**功能**:
- 邮件通知
- Slack 集成
- 告警管理

### 11. 监控服务 (metroculus)

**目录**: `metroculus/`

**功能**:
- 资源性能监控
- 指标收集
- 瓶颈识别

### 12. 内部分析服务 (insider)

**目录**: `insider/`

**功能**:
- 使用分析
- 用户行为追踪
- 产品分析

### 13. Jira 集成 (jira_bus, jira_ui)

**目录**: `jira_bus/`, `jira_ui/`

**功能**:
- Jira 工单集成
- 成本分配到项目
- 工单关联资源

### 14. 资源检查服务 (subspector)

**目录**: `subspector/`

**功能**:
- 资源合规性检查
- 安全扫描
- 最佳实践验证

### 15. 守护者服务 (keeper)

**目录**: `keeper/`

**功能**:
- 资源生命周期管理
- 自动化清理
- 策略执行

## 共享工具库

### tools/ 目录

**核心工具模块**:

1. **cloud_adapter**: 多云平台适配器
   - 统一的云资源接口
   - 支持 AWS, Azure, GCP, Alibaba, Nebius

2. **optscale_exceptions**: 统一异常处理
   - 自定义异常类型
   - 错误码管理

3. **optscale_types**: 数据类型定义
   - SQLAlchemy 自定义类型
   - 数据验证器

4. **optscale_data**: 数据处理工具
   - 数据转换
   - 格式化工具

5. **optscale_time**: 时间处理工具
   - 时区转换
   - 时间范围计算

6. **optscale_password**: 密码管理
   - 加密/解密
   - 密码验证

7. **stripe_client**: Stripe 支付集成
   - 订阅管理
   - 支付处理

### optscale_client/ 目录

**客户端 SDK**:
- `auth_client`: 认证客户端
- `rest_api_client`: REST API 客户端
- `config_client`: 配置客户端
- `herald_client`: 通知客户端
- `katara_client`: Katara 服务客户端
- `metroculus_client`: 监控客户端
- `insider_client`: 分析客户端
- `subspector_client`: 检查服务客户端

## 核心功能特性

### 1. 成本优化
- **预留实例 (RI) 和节省计划优化**: 自动分析和推荐最优的 RI/SP 购买策略
- **Spot 实例利用**: 识别适合使用 Spot 实例的工作负载
- **未使用资源检测**: 自动发现闲置和未充分利用的资源
- **实例类型优化**: 推荐最适合工作负载的实例类型和规格

### 2. 性能管理
- **资源瓶颈识别**: 实时监控并识别性能瓶颈
- **资源调整建议**: 基于实际使用情况的 rightsizing 建议
- **VM 电源调度**: 自动化的虚拟机启停调度

### 3. 存储优化
- **S3 重复对象查找**: 识别和清理重复的 S3 对象
- **S3 和 Redshift 监控**: 存储使用分析和优化建议
- **生命周期策略**: 自动化的数据生命周期管理

### 4. 多云支持
- **统一管理界面**: 单一平台管理多个云账户
- **跨云成本分析**: 统一的成本视图和报表
- **云平台支持**:
  - AWS (Amazon Web Services)
  - Microsoft Azure
  - Google Cloud Platform
  - Alibaba Cloud
  - Kubernetes 集群

### 5. Databricks 集成
- **Databricks 连接**: 原生支持 Databricks 工作空间
- **作业成本分析**: 详细的 Spark 作业成本追踪
- **优化建议**: 针对 Databricks 工作负载的优化建议

### 6. 资源池和环境管理
- **资源池**: 按项目、团队或环境组织资源
- **共享环境**: 多团队共享资源的管理
- **成本分配**: 按所有者、项目或标签的成本分解

### 7. 可视化和报表
- **成本地图**: 地理位置的成本分布可视化
- **成本浏览器**: 多维度的成本分析工具
- **自定义仪表板**: 可配置的监控面板
- **导出功能**: Excel/CSV 格式的报表导出

## 部署架构

### 基础设施要求

**最低硬件配置**:
- CPU: 8+ 核心
- 内存: 16GB
- 存储: 150GB+ SSD (推荐 NVMe)

**操作系统**:
- Ubuntu 24.04 (推荐)
- Ubuntu 22.04 (兼容)

### 部署方式

**Kubernetes 集群部署**:
1. 使用 Ansible 自动化部署 K8s 集群
2. 通过 Helm Charts 部署 OptScale 服务
3. 支持单节点和多节点部署

**核心组件**:
- **Kubernetes**: 容器编排
- **Nginx Ingress**: 入口控制器
- **ELK Stack**: 日志聚合 (可选)
- **Prometheus**: 监控 (可选)

### 配置管理

**overlay 配置系统**:
- 基于 YAML 的配置覆盖
- 环境特定的配置管理
- 密钥和凭证管理

## 数据流架构

### 数据采集流程

1. **云账单导入**:
   ```
   云平台 → diproxy → diworker → 数据存储
   ```

2. **资源监控**:
   ```
   云资源 → metroculus → InfluxDB → 分析引擎
   ```

3. **流量分析**:
   ```
   账单数据 → trapper → 流量模式识别 → 优化建议
   ```

### 数据存储策略

- **MySQL**: 用户、组织、配置等结构化数据
- **MongoDB**: 云资源元数据、灵活的文档数据
- **ClickHouse**: 大规模成本数据分析、时间序列聚合
- **InfluxDB**: 性能指标、监控数据

## 开发和构建

### 构建系统

**后端构建**:
```bash
# 使用 uv 包管理器
./build.sh --use-nerdctl
```

**前端构建**:
```bash
cd ngui
pnpm install
pnpm build
```

### 测试框架

**Python 测试**:
- pytest: 单元测试和集成测试
- coverage: 代码覆盖率
- pylint: 代码质量检查

**JavaScript 测试**:
- Jest: 单元测试
- ESLint: 代码规范检查
- Prettier: 代码格式化

### 代码质量

**Python**:
- 使用 `.pylintrc` 配置 pylint
- 代码覆盖率配置 `.coveragerc`
- 类型提示和验证

**TypeScript**:
- 严格的 TypeScript 配置
- ESLint 规则集
- Prettier 自动格式化

## 安全特性

### 认证和授权
- JWT Token 认证
- OAuth 2.0 集成
- 基于角色的访问控制 (RBAC)
- 多租户隔离

### 数据安全
- 密码加密存储
- API 密钥管理
- 云凭证加密
- HTTPS/TLS 通信

### 合规性
- 审计日志
- 数据保留策略
- 隐私保护

## 集成能力

### 第三方集成

1. **云平台 SDK**:
   - AWS Boto3
   - Azure SDK
   - Google Cloud Client
   - Alibaba Cloud SDK

2. **通信工具**:
   - Slack (通知和告警)
   - Email (SMTP)
   - Jira (工单集成)

3. **日历集成**:
   - Google Calendar (资源预订)

4. **支付系统**:
   - Stripe (订阅管理)

5. **CRM 系统**:
   - Zoho CRM (客户管理)

### API 接口

**REST API**:
- OpenAPI/Swagger 文档
- 版本化 API
- 标准 HTTP 方法

**GraphQL API**:
- 前端 BFF 层
- 类型安全的查询
- 代码生成

## 监控和运维

### 日志管理
- ELK Stack 集成
- 结构化日志
- 日志聚合和搜索

### 性能监控
- Prometheus 指标
- 自定义指标收集
- 性能分析

### 健康检查
- Kubernetes 就绪探针
- 存活探针
- 服务依赖检查

## 项目特色

### 1. 微服务架构
- 服务解耦，独立部署
- 水平扩展能力
- 故障隔离

### 2. 异步处理
- 消息队列驱动
- 后台任务处理
- 高并发支持

### 3. 多租户支持
- 组织级别隔离
- 资源配额管理
- 独立的数据视图

### 4. 可扩展性
- 插件化的云适配器
- 可配置的推荐引擎
- 自定义规则引擎

### 5. 开源生态
- Apache 2.0 许可证
- 活跃的社区支持
- 完整的文档

## 使用场景

### 1. 企业云成本管理
- 多部门成本分摊
- 预算控制和告警
- 成本趋势分析

### 2. DevOps 团队
- 资源生命周期自动化
- CI/CD 成本优化
- 环境管理

### 3. FinOps 实践
- 云财务管理
- 成本可见性
- 优化建议执行

### 4. 研发团队
- 实验环境管理
- 资源预订系统
- 成本归属

## 社区和支持

### 官方资源
- **官网**: https://hystax.com
- **文档**: https://hystax.com/documentation/optscale/
- **在线演示**: https://my.optscale.com/live-demo
- **GitHub**: https://github.com/hystax/optscale

### 社区
- **FinOps 实践社区**: https://finopsinpractice.org/
- **LinkedIn**: https://www.linkedin.com/company/hystax
- **Twitter**: https://twitter.com/hystaxcom
- **YouTube**: 技术教程和最佳实践

### 联系方式
- **邮箱**: info@hystax.com
- **问题反馈**: GitHub Issues
- **贡献指南**: CONTRIBUTING.md

## 贡献和开发

### 贡献流程
1. Fork 项目仓库
2. 创建功能分支
3. 提交代码变更
4. 签署贡献协议 (CLA)
5. 提交 Pull Request

### 开发环境设置
1. 安装依赖 (Python 3.12+, Node.js 22+)
2. 配置本地 Kubernetes 集群
3. 运行本地开发环境
4. 执行测试套件

### 代码规范
- 遵循 PEP 8 (Python)
- 使用 ESLint 配置 (JavaScript/TypeScript)
- 编写单元测试
- 更新文档

## 许可证

OptScale 采用 **Apache License 2.0** 开源许可证，允许商业使用、修改和分发。

## 总结

OptScale 是一个功能全面、架构先进的云成本管理平台，具有以下特点:

- ✅ **开源免费**: Apache 2.0 许可证
- ✅ **多云支持**: 统一管理 AWS、Azure、GCP 等
- ✅ **成本优化**: 平均节省 38% 云成本
- ✅ **微服务架构**: 可扩展、高可用
- ✅ **现代技术栈**: Python 3.12+, React 18, Kubernetes
- ✅ **活跃社区**: 183+ 组织使用
- ✅ **完整文档**: 详细的部署和使用指南

无论是企业级云成本管理，还是 DevOps 团队的资源优化，OptScale 都提供了强大而灵活的解决方案。
