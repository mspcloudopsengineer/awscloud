# OptScale 云连接信息全面分析

## 一、支持的云平台总览

OptScale 通过 `tools/cloud_adapter/` 模块实现了统一的多云适配层，共支持 10 种云连接类型：

| 云类型标识 | 适配器类 | 云平台 | 说明 |
|---|---|---|---|
| `aws_cnr` | `Aws` | Amazon Web Services | AWS 单账户连接 |
| `azure_cnr` | `Azure` | Microsoft Azure | Azure 单订阅连接 |
| `azure_tenant` | `AzureTenant` | Microsoft Azure | Azure 租户级连接（多订阅） |
| `gcp_cnr` | `Gcp` | Google Cloud Platform | GCP 单项目连接 |
| `gcp_tenant` | `GcpTenant` | Google Cloud Platform | GCP 租户级连接（多项目） |
| `alibaba_cnr` | `Alibaba` | Alibaba Cloud | 阿里云连接 |
| `nebius` | `Nebius` | Nebius Cloud | Nebius 云连接（原 Yandex Cloud 分支） |
| `kubernetes_cnr` | `Kubernetes` | Kubernetes | K8s 集群连接（通过 Prometheus） |
| `databricks` | `Databricks` | Databricks | Databricks 工作空间连接 |
| `environment` | `Environment` | 虚拟环境 | 内部环境管理（无实际云连接） |

---

## 二、各云平台连接详细分析

### 1. AWS (aws_cnr)

**适配器文件**: `tools/cloud_adapter/clouds/aws.py`
**基类**: `S3CloudMixin` → `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `access_key_id` | str | 是 | AWS Access Key ID |
| `secret_access_key` | str | 是 | AWS Secret Access Key（加密存储） |
| `config_scheme` | str | 否 | 配置方案：`find_report` / `create_report` / `bucket_only` |
| `bucket_name` | str | 否 | CUR 报告所在 S3 桶名 |
| `bucket_prefix` | str | 否 | S3 桶前缀 |
| `report_name` | str | 否 | CUR 报告名称 |
| `linked` | bool | 否 | 是否为关联账户 |
| `region_name` | str | 否 | 默认区域 |
| `assume_role_account_id` | str | 否 | AssumeRole 目标账户 ID |
| `assume_role_name` | str | 否 | AssumeRole 角色名 |
| `assume_role_session_name` | str | 否 | AssumeRole 会话名 |
| `cur_version` | int | 否 | CUR 版本（1 或 2） |
| `use_edp_discount` | bool | 否 | 是否使用 EDP 折扣 |

#### 连接方式
- 使用 `boto3` SDK 创建 Session
- 支持 AssumeRole 跨账户访问
- STS 默认 endpoint: `https://sts.amazonaws.com`（us-east-1）
- 支持自定义 `sts_endpoint_url` 和 `sts_region_name`

#### 账单数据获取
- 通过 S3 读取 AWS Cost and Usage Report (CUR)
- 支持 CUR v1（`cur` API）和 CUR v2（`bcm-data-exports` API）
- 支持 CSV 和 Parquet 格式

#### 资源发现能力
- EC2 实例（Instance）
- EBS 卷（Volume）
- EBS 快照（Snapshot）
- S3 存储桶（Bucket）- 含公开访问检测、Intelligent Tiering 分析
- 弹性 IP（IP Address）
- 负载均衡器（Load Balancer）- 含 Classic LB 和 ALB/NLB

#### AWS CN（中国区）支持分析

**结论：代码层面支持 AWS CN 区域，但需要手动配置。**

具体证据：

1. **区域坐标已包含中国区**（`_get_coordinates_map` 方法）：
   - `cn-north-1`: China (Beijing) - 北京
   - `cn-northwest-1`: China (Ningxia) - 宁夏

2. **STS endpoint 可自定义**：
   ```python
   DEFAULT_STS_REGION_NAME = "us-east-1"
   DEFAULT_STS_ENDPOINT_URL = "https://sts.amazonaws.com"
   ```
   代码支持通过配置覆盖：
   ```python
   region_name=self.config.get("sts_region_name") or DEFAULT_STS_REGION_NAME,
   endpoint_url=self.config.get("sts_endpoint_url") or DEFAULT_STS_ENDPOINT_URL,
   ```

3. **不支持 `arn:aws-cn` 分区**：
   代码中 ARN 构造使用硬编码的 `arn:aws` 前缀：
   ```python
   RoleArn=f'arn:aws:iam::{role_account_id}:role/{role_name}'
   ```
   这意味着 AssumeRole 在中国区会失败，需要修改代码。

4. **CUR 服务硬编码 us-east-1**：
   ```python
   def cur(self):
       return self.session.client('cur', 'us-east-1')
   ```
   AWS CN 的 CUR 服务在 `cn-northwest-1`，此处需要适配。

5. **Pricing API 硬编码 us-east-1**：
   ```python
   def pricing(self):
       return self.session.client('pricing', 'us-east-1')
   ```
   AWS CN 没有 Pricing API，需要替代方案。

**AWS CN 使用限制总结**：

| 功能 | Global | CN（中国区） | 说明 |
|---|---|---|---|
| 基本连接认证 | ✅ | ⚠️ 需配置 sts_endpoint_url | 需设置为 `https://sts.cn-north-1.amazonaws.com.cn` |
| 区域坐标显示 | ✅ | ✅ | cn-north-1, cn-northwest-1 已内置 |
| 资源发现 | ✅ | ⚠️ 部分支持 | 需要正确配置 region_name |
| CUR 账单导入 | ✅ | ❌ 需代码修改 | CUR endpoint 硬编码 us-east-1 |
| AssumeRole | ✅ | ❌ 需代码修改 | ARN 前缀硬编码为 `arn:aws` |
| Pricing API | ✅ | ❌ 不可用 | CN 区域无此 API |
| 推荐引擎 | ✅ | ❌ 受限 | 依赖 Pricing API |

### 2. Azure (azure_cnr)

**适配器文件**: `tools/cloud_adapter/clouds/azure.py`
**基类**: `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `subscription_id` | str | 是 | Azure 订阅 ID |
| `secret` | str | 是 | 客户端密钥（加密存储） |
| `client_id` | str | 是 | 应用程序（客户端）ID |
| `tenant` | str | 是 | Azure AD 租户 ID |
| `expense_import_scheme` | str | 否 | 费用导入方案 |
| `partner_tenant` | str | 否 | CSP 合作伙伴租户 |
| `partner_client_id` | str | 否 | CSP 合作伙伴客户端 ID |
| `partner_secret` | str | 否 | CSP 合作伙伴密钥 |
| `export_name` | str | 否 | 导出名称 |
| `sa_connection_string` | str | 否 | 存储账户连接字符串 |
| `container` | str | 否 | Blob 容器名 |
| `directory` | str | 否 | 目录路径 |

#### 连接方式
- 使用 MSAL（Microsoft Authentication Library）进行 OAuth2 认证
- 自实现 `MsalCredential` 类管理 Token 生命周期
- 支持 Service Principal 和 Client Secret 两种认证方式
- 内置重试机制（指数退避 + 抖动）

#### 账单数据获取
- 支持两种费用导入方案（`ExpenseImportScheme`）：
  - Consumption API（消费 API）
  - Export（导出到 Blob Storage）
- 支持 CSP 合作伙伴账户
- 支持 Modern Usage 和 Raw Usage 查询

#### 资源发现能力
- 虚拟机（Instance）
- 托管磁盘（Volume）
- 快照（Snapshot）
- 存储账户（Bucket/Storage Account）
- 公共 IP 地址（IP Address）
- 负载均衡器（Load Balancer）

#### 区域支持
代码中包含完整的 Azure 区域坐标映射，包括：
- 全球所有商业区域
- **中国区域**：China East, China East 2, China North, China North 2
- 政府区域（US Gov）

**注意**：Azure 中国区（21Vianet 运营）使用不同的 endpoint，代码中未见针对 Azure China 的特殊 endpoint 处理，可能需要额外配置。

---

### 3. Azure Tenant (azure_tenant)

**适配器文件**: `tools/cloud_adapter/clouds/azure_tenant.py`
**基类**: `Azure`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `secret` | str | 是 | 客户端密钥 |
| `client_id` | str | 是 | 应用程序 ID |
| `tenant` | str | 是 | 租户 ID |
| `partner_tenant` | str | 否 | CSP 合作伙伴租户 |
| `partner_client_id` | str | 否 | CSP 合作伙伴客户端 ID |
| `partner_secret` | str | 否 | CSP 合作伙伴密钥 |
| `skipped_subscriptions` | dict | 否 | 跳过的订阅列表 |

#### 特殊功能
- 租户级别管理，自动发现所有订阅
- 为每个订阅创建子连接（`AZURE_CNR` 类型）
- 不执行资源发现（`discovery_calls_map` 返回空）

---

### 4. GCP (gcp_cnr)

**适配器文件**: `tools/cloud_adapter/clouds/gcp.py`
**基类**: `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `credentials` | dict | 是 | GCP Service Account JSON 密钥 |
| `billing_data.dataset_name` | str | 是 | BigQuery 账单数据集名 |
| `billing_data.table_name` | str | 是 | BigQuery 账单表名 |
| `billing_data.project_id` | str | 否 | 账单数据所在项目 ID |
| `pricing_data.dataset_name` | str | 否 | 定价数据集名 |
| `pricing_data.table_name` | str | 否 | 定价表名 |
| `pricing_data.project_id` | str | 否 | 定价数据所在项目 ID |

#### 连接方式
- 使用 Google Cloud Service Account 认证
- 通过 BigQuery 查询账单和定价数据
- 使用 Google Cloud Compute/Storage/Monitoring 客户端库

#### 账单数据获取
- 通过 BigQuery 查询 Billing Export 数据
- 支持定价数据查询（用于推荐引擎）

#### 资源发现能力
- Compute 实例（Instance）
- 持久化磁盘（Volume/Disk）
- 快照（Snapshot）
- 镜像（Image）
- Cloud Storage 存储桶（Bucket）
- 静态 IP 地址（IP Address）

#### 区域支持
代码中包含完整的 GCP 区域坐标映射，包括：
- 全球所有商业区域
- `asia-east2` 标记为 alias "China"（香港区域）
- 支持 global 区域

---

### 5. GCP Tenant (gcp_tenant)

**适配器文件**: `tools/cloud_adapter/clouds/gcp_tenant.py`
**基类**: `Gcp`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `billing_data` | dict | 是 | BigQuery 账单数据配置 |
| `pricing_data` | dict | 否 | BigQuery 定价数据配置 |
| `credentials` | dict | 是 | Service Account JSON 密钥 |
| `skipped_subscriptions` | dict | 否 | 跳过的项目列表 |

#### 特殊功能
- 租户级别管理，自动发现 BigQuery 中的所有项目
- 为每个项目创建子连接（`GCP_CNR` 类型）
- 不执行资源发现

---

### 6. Alibaba Cloud (alibaba_cnr)

**适配器文件**: `tools/cloud_adapter/clouds/alibaba.py`
**基类**: `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `access_key_id` | str | 是 | 阿里云 Access Key ID |
| `secret_access_key` | str | 是 | 阿里云 Secret Access Key |
| `skip_refunds` | bool | 否 | 是否跳过退款数据 |

#### 连接方式
- 使用阿里云 SDK（`AcsClient`）
- 通过 RAM 用户凭证认证
- 要求 RAM 用户具有 `ReadOnlyAccess` 权限
- 自动检测账单区域（国际版 vs 中国版）

#### 账单数据获取
- 通过 `DescribeInstanceBill` API 获取账单明细
- 通过 `QueryBillOverview` API 获取账单概览
- 支持国际版和中国版账单区域自动切换：
  ```python
  # 先尝试国际版区域
  response = self.get_bill_overview(now, region_id=BILLING_REGION_ID)
  # 如果失败，切换到中国版区域 cn-hangzhou
  config_update['region_id'] = cn_region
  ```

#### 资源发现能力
- ECS 实例（Instance）
- 云盘（Volume）
- 快照链（Snapshot Chain）
- RDS 数据库实例（RDS Instance）
- 弹性公网 IP（IP Address）
- 负载均衡器（Load Balancer）- 含 CLB/ALB/NLB/GWLB
- 镜像（Image）

#### 区域支持
代码中包含完整的阿里云区域坐标映射，覆盖：
- **中国大陆**：青岛、北京、张家口、呼和浩特、乌兰察布、杭州、上海、深圳、河源、广州、成都、南京
- **中国香港**
- **亚太**：东京、首尔、新加坡、吉隆坡、雅加达、马尼拉、曼谷
- **欧美**：弗吉尼亚、硅谷、伦敦、法兰克福
- **中东**：迪拜

---

### 7. Nebius Cloud (nebius)

**适配器文件**: `tools/cloud_adapter/clouds/nebius.py`
**基类**: `S3CloudMixin` → `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `service_account_id` | str | 是 | 服务账户 ID |
| `key_id` | str | 是 | 密钥 ID |
| `private_key` | str | 是 | 私钥（PEM 格式） |
| `bucket_name` | str | 是 | S3 桶名（账单数据） |
| `bucket_prefix` | str | 是 | S3 桶前缀 |
| `access_key_id` | str | 是 | S3 Access Key |
| `secret_access_key` | str | 是 | S3 Secret Key |
| `cloud_name` | str | 是 | 云名称 |
| `endpoint` | str | 否 | API endpoint |
| `region_name` | str | 否 | 区域名 |
| `s3_endpoint` | str | 否 | S3 endpoint |
| `console_endpoint` | str | 否 | 控制台 endpoint |

#### 连接方式
- 使用 Yandex Cloud SDK（gRPC）
- JWT Token 认证（PS256 算法）
- 默认 endpoint: `api.il.nebius.cloud`（以色列区域）
- S3 兼容存储: `https://storage.il.nebius.cloud`

#### 账单数据获取
- 通过 S3 兼容存储读取 CSV 格式账单报告

#### 资源发现能力
- 计算实例（Instance）
- 磁盘（Volume）
- 快照（Snapshot）
- 镜像（Image）
- 存储桶（Bucket）
- IP 地址（IP Address）
- RDS 数据库实例（支持 MySQL, MongoDB, ClickHouse, PostgreSQL）

---

### 8. Kubernetes (kubernetes_cnr)

**适配器文件**: `tools/cloud_adapter/clouds/kubernetes.py`
**基类**: `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `user` | str | 是 | Prometheus 用户名 |
| `password` | str | 是 | Prometheus 密码 |
| `credentials` | str | 否 | Base64 编码的凭证（自动生成） |
| `custom_price` | bool | 否 | 是否使用自定义定价 |

#### 连接方式
- 通过 Prometheus HTTP API 查询指标
- 使用 Basic Auth 认证
- 默认超时: 60 秒

#### 数据获取
- 通过 PromQL 查询 Pod 信息指标（`kube_pod_info`）
- 查询 Pod 标签（`kube_pod_labels`）
- 查询 Service 选择器（`kube_service_selectors`）

#### 资源发现能力
- Pod 资源（唯一支持的资源类型）
- 包含：Pod 名称、命名空间、节点、IP、创建者信息、关联 Service

---

### 9. Databricks (databricks)

**适配器文件**: `tools/cloud_adapter/clouds/databricks.py`
**基类**: `CloudBase`

#### 连接凭证

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `client_id` | str | 是 | Service Principal 客户端 ID |
| `client_secret` | str | 是 | Service Principal 密钥 |
| `account_id` | str | 是 | Databricks 账户 ID |

#### 连接方式
- 使用 Databricks SDK（`AccountClient` / `WorkspaceClient`）
- 固定 host: `https://accounts.cloud.databricks.com`
- 要求 Service Principal 具有 Account Admin 权限

#### 账单数据获取
- 通过 `billable_usage.download` API 下载使用量日志
- 仅支持 USD 货币

#### 资源发现能力
- 无资源发现（`discovery_calls_map` 返回空）
- 仅用于账单数据导入

---

### 10. Environment (environment)

**适配器文件**: `tools/cloud_adapter/clouds/environment.py`
**基类**: `CloudBase`

#### 说明
- 虚拟环境类型，不连接任何实际云平台
- 用于 OptScale 内部的环境管理功能（如共享环境、资源预订）
- 无需凭证，无资源发现，无账单导入

---

## 三、资源类型支持矩阵

| 资源类型 | AWS | Azure | GCP | Alibaba | Nebius | K8s | Databricks |
|---|---|---|---|---|---|---|---|
| 计算实例 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 磁盘/卷 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 快照 | ✅ | ✅ | ✅ | ✅（快照链） | ✅ | ❌ | ❌ |
| 存储桶 | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| IP 地址 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| 负载均衡 | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 镜像 | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| RDS 实例 | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Pod | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| 实例启停 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

## 四、账单/费用导入方式对比

| 云平台 | 导入方式 | 数据源 | 格式 |
|---|---|---|---|
| AWS | S3 下载 | Cost and Usage Report (CUR v1/v2) | CSV / Parquet |
| Azure | API / Blob | Consumption API 或 Export 到 Blob Storage | JSON / CSV |
| GCP | BigQuery | Billing Export 到 BigQuery | SQL 查询 |
| Alibaba | API | DescribeInstanceBill API | JSON |
| Nebius | S3 下载 | CSV 报告文件 | CSV |
| K8s | Prometheus | PromQL 指标查询 | 时序数据 |
| Databricks | API | Billable Usage Download API | CSV |

## 五、架构设计特点

### 统一适配器模式
```
CloudBase (抽象基类)
├── S3CloudMixin (S3 存储混入)
│   ├── Aws
│   └── Nebius
├── Azure
│   └── AzureTenant
├── Gcp
│   └── GcpTenant
├── Alibaba
├── Kubernetes
├── Databricks
└── Environment
```

### 工厂模式
通过 `Cloud.get_adapter(cloud_config)` 统一创建适配器实例，根据 `type` 字段自动选择对应的适配器类。

### 租户-子账户模式
Azure 和 GCP 支持两级连接：
- **Tenant 级别**：管理多个订阅/项目，自动发现子账户
- **CNR 级别**：单个订阅/项目，执行实际的资源发现和账单导入

### 安全设计
- 敏感凭证标记为 `protected=True`，在 API 响应中脱敏
- 部分字段标记为 `readonly=True`，防止用户修改
- 所有云连接支持凭证验证（`validate_credentials`）

## 六、总结

OptScale 的云适配层设计成熟，通过统一的抽象接口支持 7 个主流云平台 + K8s + Databricks。对于 AWS CN（中国区），代码中已包含区域坐标定义，但 STS endpoint、CUR 服务、ARN 格式等存在硬编码问题，直接使用会有兼容性问题，需要进行代码适配才能完整支持。AWS Global 则完全支持，包括所有商业区域和 GovCloud 区域。

