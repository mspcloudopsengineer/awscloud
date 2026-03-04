# 需求文档：AWS CN（中国区）支持

## 简介

OptScale 平台当前的 AWS 适配器（`tools/cloud_adapter/clouds/aws.py`）中存在多处硬编码值，仅适用于 AWS 全球区（Global Partition）。本特性旨在使 OptScale 完整支持 AWS 中国区（`aws-cn` 分区），包括 ARN 分区识别、STS 端点、CUR 服务区域、定价 API 替代方案、控制台链接以及区域检测等方面的适配。

## 术语表

- **Adapter（适配器）**: OptScale 中用于连接和操作特定云服务商的模块，即 `Aws` 类（位于 `tools/cloud_adapter/clouds/aws.py`）
- **CN_Partition（中国分区）**: AWS 中国区分区，ARN 前缀为 `arn:aws-cn`，包含 `cn-north-1`（北京）和 `cn-northwest-1`（宁夏）两个区域
- **Global_Partition（全球分区）**: AWS 标准全球分区，ARN 前缀为 `arn:aws`
- **CUR（成本和使用报告）**: AWS Cost and Usage Report，用于获取详细的账单数据
- **STS（安全令牌服务）**: AWS Security Token Service，用于临时凭证和角色切换
- **Pricing_API（定价 API）**: AWS Price List Service API，用于查询服务定价信息
- **Console_URL（控制台链接）**: AWS 管理控制台的 Web 访问地址
- **Partition_Detector（分区检测器）**: Adapter 中用于自动判断当前账户所属分区的逻辑组件

## 需求

### 需求 1：分区自动检测

**用户故事：** 作为 OptScale 管理员，我希望系统能自动检测 AWS 账户所属的分区（中国区或全球区），以便无需手动配置即可正确连接。

#### 验收标准

1. WHEN 用户提供 AWS 凭证进行连接时，THE Adapter SHALL 通过调用 STS `get_caller_identity` 返回的 ARN 中的分区字段自动判断账户属于 CN_Partition 还是 Global_Partition
2. WHEN Adapter 检测到 ARN 中包含 `aws-cn` 分区标识时，THE Partition_Detector SHALL 将当前账户标记为 CN_Partition
3. WHEN Adapter 检测到 ARN 中包含 `aws` 分区标识时，THE Partition_Detector SHALL 将当前账户标记为 Global_Partition
4. IF STS 调用失败导致无法获取 ARN 信息，THEN THE Adapter SHALL 回退到基于配置的 `region_name` 前缀（`cn-`）进行分区判断

### 需求 2：ARN 分区动态构建

**用户故事：** 作为 OptScale 管理员，我希望使用 AssumeRole 连接中国区 AWS 账户时，系统能生成正确的 ARN，以便角色切换正常工作。

#### 验收标准

1. WHEN Adapter 执行 AssumeRole 操作时，THE Adapter SHALL 根据检测到的分区动态构建 RoleArn，CN_Partition 使用 `arn:aws-cn:iam::{account_id}:role/{role_name}` 格式，Global_Partition 使用 `arn:aws:iam::{account_id}:role/{role_name}` 格式
2. THE Adapter SHALL 不再硬编码 `arn:aws` 前缀，而是通过分区检测结果动态选择 `aws` 或 `aws-cn`
3. WHEN 使用 CN_Partition 的 AssumeRole 凭证时，THE Adapter SHALL 成功获取临时凭证并建立会话

### 需求 3：STS 端点自适应

**用户故事：** 作为 OptScale 管理员，我希望系统能自动选择正确的 STS 端点，以便中国区账户的身份验证正常工作。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter SHALL 使用 `https://sts.{region}.amazonaws.com.cn` 格式的 STS 端点（其中 region 为 `cn-north-1` 或 `cn-northwest-1`）
2. WHILE 当前账户属于 Global_Partition 时，THE Adapter SHALL 继续使用默认的 `https://sts.amazonaws.com` 端点
3. WHEN 用户在配置中显式指定了 `sts_endpoint_url` 时，THE Adapter SHALL 优先使用用户指定的端点，覆盖自动检测结果
4. THE Adapter 中的 `_sts_global` 属性 SHALL 根据分区自动选择正确的 STS 区域名称和端点 URL

### 需求 4：CUR 服务区域适配

**用户故事：** 作为 OptScale 管理员，我希望系统能在中国区正确访问 CUR 服务，以便获取中国区账户的成本报告。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter 的 `cur` 属性 SHALL 使用 `cn-northwest-1` 区域创建 CUR 客户端
2. WHILE 当前账户属于 Global_Partition 时，THE Adapter 的 `cur` 属性 SHALL 继续使用 `us-east-1` 区域创建 CUR 客户端
3. THE Adapter SHALL 不再将 CUR 客户端的区域硬编码为 `us-east-1`

### 需求 5：定价 API 替代方案

**用户故事：** 作为 OptScale 管理员，我希望系统在中国区无法使用 Pricing API 时能提供替代方案，以便中国区账户的定价查询功能不会导致系统错误。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter SHALL 不调用 Pricing API（因为中国区不提供该服务）
2. WHEN CN_Partition 账户调用 `get_pricing`、`get_similar_sku_prices`、`get_prices`、`get_pricing_score_base`、`get_oregon_sku_for_types` 或 `get_price_checking_skus` 方法时，THE Adapter SHALL 返回空结果或抛出明确的 `PricingNotAvailableException` 异常，而非产生未处理的连接错误
3. WHILE 当前账户属于 Global_Partition 时，THE Adapter SHALL 继续使用 `us-east-1` 区域的 Pricing API 正常工作
4. THE Adapter 的 `pricing` 属性 SHALL 在 CN_Partition 下不尝试创建 pricing 客户端

### 需求 6：控制台链接适配

**用户故事：** 作为 OptScale 用户，我希望系统生成的 AWS 控制台链接能正确指向中国区控制台，以便我能直接跳转到对应资源页面。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter 的 `_generate_cloud_link` 方法 SHALL 使用 `https://console.amazonaws.cn` 作为控制台基础 URL
2. WHILE 当前账户属于 Global_Partition 时，THE Adapter 的 `_generate_cloud_link` 方法 SHALL 继续使用 `https://console.aws.amazon.com` 作为控制台基础 URL
3. THE Adapter SHALL 不再将控制台基础 URL 硬编码为 `https://console.aws.amazon.com`
4. WHEN 生成 Bucket、Instance、Volume、Snapshot、IP Address 或 LoadBalancer 类型资源的控制台链接时，THE Adapter SHALL 使用与当前分区匹配的控制台基础 URL

### 需求 7：区域列表获取适配

**用户故事：** 作为 OptScale 管理员，我希望系统能正确获取中国区的可用区域列表，以便资源发现功能覆盖所有中国区区域。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter 的 `allowed_regions` 属性 SHALL 使用 `cn-north-1` 作为 EC2 客户端的区域来调用 `describe_regions`
2. WHILE 当前账户属于 Global_Partition 时，THE Adapter 的 `allowed_regions` 属性 SHALL 继续使用 `us-east-1` 作为 EC2 客户端的区域
3. THE Adapter SHALL 不再将 `describe_regions` 的 EC2 客户端区域硬编码为 `us-east-1`
4. WHEN CN_Partition 账户调用 `allowed_regions` 时，THE Adapter SHALL 仅返回中国区区域（`cn-north-1` 和 `cn-northwest-1`）

### 需求 8：SSM 参数路径适配

**用户故事：** 作为 OptScale 管理员，我希望系统在中国区能正确获取区域名称映射，以便区域显示名称正确。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter 的 `get_region_name_code_map` 方法 SHALL 使用中国区可用的 SSM 参数路径获取区域名称映射
2. IF CN_Partition 的 SSM 服务不支持全球基础设施参数路径，THEN THE Adapter SHALL 回退到使用 `_get_coordinates_map` 中的静态名称映射
3. WHILE 当前账户属于 Global_Partition 时，THE Adapter SHALL 继续使用 SSM 参数路径 `/aws/service/global-infrastructure/regions/{region}/longName` 获取区域名称

### 需求 9：默认区域配置适配

**用户故事：** 作为 OptScale 管理员，我希望中国区账户使用合理的默认区域，以便在未显式指定区域时系统仍能正常工作。

#### 验收标准

1. WHILE 当前账户属于 CN_Partition 时，THE Adapter SHALL 使用 `cn-northwest-1` 作为默认 S3 区域（替代 `eu-central-1`）
2. WHILE 当前账户属于 Global_Partition 时，THE Adapter SHALL 继续使用 `eu-central-1` 作为默认 S3 区域
3. WHEN 用户在配置中显式指定了 `region_name` 时，THE Adapter SHALL 优先使用用户指定的区域，覆盖默认值

### 需求 10：凭证验证适配

**用户故事：** 作为 OptScale 管理员，我希望中国区 AWS 凭证的验证流程能正常工作，以便我能成功添加中国区云账户。

#### 验收标准

1. WHEN 用户提供 CN_Partition 的 AWS 凭证时，THE Adapter 的 `validate_credentials` 方法 SHALL 成功完成验证并返回账户 ID
2. THE Adapter 的 `validate_credentials` 方法 SHALL 使用与当前分区匹配的 STS 端点进行身份验证
3. IF 用户提供的 `region_name` 不在 `_get_coordinates_map` 中，THEN THE Adapter SHALL 抛出 `InvalidParameterException` 异常并包含明确的错误信息
