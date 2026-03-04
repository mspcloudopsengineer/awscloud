# 实施任务：AWS CN（中国区）支持

## 任务 1: 新增分区配置常量和异常类
- [x] 1.1 在 `tools/cloud_adapter/exceptions.py` 中新增 `PricingNotAvailableException` 异常类
- [x] 1.2 在 `tools/cloud_adapter/clouds/aws.py` 顶部新增 `PARTITION_CONFIG` 字典常量，包含 `'aws'` 和 `'aws-cn'` 两个分区的完整配置（arn_prefix、sts_endpoint、sts_region、cur_region、console_url、ec2_region、default_s3_region、ssm_region、pricing_available）

## 任务 2: 实现分区自动检测
- [x] 2.1 在 `Aws` 类中新增 `_detect_partition` 方法：通过 `_base_session` 创建 STS 客户端，调用 `get_caller_identity`，解析返回 ARN 的第二个冒号分隔字段作为分区值
- [x] 2.2 在 `_detect_partition` 中实现回退逻辑：当 STS 调用抛出任何异常时，检查 `self.config.get('region_name')` 是否以 `cn-` 开头，是则返回 `'aws-cn'`，否则返回 `'aws'`
- [x] 2.3 新增 `partition` 懒加载属性，缓存 `_detect_partition` 的结果到 `_partition` 实例变量
- [x] 2.4 新增辅助属性：`_is_cn_partition`、`_console_base_url`、`_cur_region`、`_ec2_default_region`、`_arn_prefix`、`_pricing_available`，均从 `PARTITION_CONFIG[self.partition]` 读取对应值

## 任务 3: 适配 STS 端点和 AssumeRole ARN
- [x] 3.1 修改 `_sts_global` 属性：当无用户配置覆盖时，CN 分区使用 `https://sts.{region}.amazonaws.com.cn` 格式端点和 `cn-north-1` 区域，全球分区保持原有默认值
- [x] 3.2 修改 `get_session` 方法中的 AssumeRole 逻辑：将硬编码的 `arn:aws:iam::` 替换为 `f'{self._arn_prefix}:iam::'`，并确保 STS 客户端使用分区感知的端点

## 任务 4: 适配 CUR、Pricing、SSM 和区域相关方法
- [x] 4.1 修改 `cur` 属性：将硬编码的 `'us-east-1'` 替换为 `self._cur_region`
- [x] 4.2 修改 `pricing` 属性：CN 分区返回 `None`；修改 `get_pricing`、`get_similar_sku_prices`、`get_prices`、`get_pricing_score_base`、`get_oregon_sku_for_types`、`get_price_checking_skus` 方法，在 CN 分区下返回空结果
- [x] 4.3 修改 `allowed_regions` 属性：将硬编码的 `'us-east-1'` 替换为 `self._ec2_default_region`
- [x] 4.4 修改 `ssm` 属性：将硬编码的 `'us-east-1'` 替换为分区对应的 SSM 区域
- [x] 4.5 修改 `get_region_name_code_map` 方法：CN 分区直接从 `_get_coordinates_map` 过滤 `cn-` 前缀区域构建映射，不调用 SSM

## 任务 5: 适配控制台链接和默认区域
- [x] 5.1 将 `_generate_cloud_link` 从 `@staticmethod` 改为实例方法，将 `DEFAULT_BASE_URL` 替换为 `self._console_base_url`，同步更新 `_set_cloud_link` 的调用方式
- [x] 5.2 覆盖 `DEFAULT_S3_REGION_NAME`：在 `Aws` 类的 `session` 属性或相关位置，根据分区动态设置默认 S3 区域（CN 分区为 `cn-northwest-1`，全球分区保持 `eu-central-1`）

## 任务 6: 编写单元测试
- [x] 6.1 创建 `tools/cloud_adapter/tests/test_aws_cn_partition.py`，编写单元测试覆盖：分区检测（具体 ARN 示例）、STS 端点选择、CUR 区域选择、Pricing API 禁用、控制台链接生成、SSM 回退、无效区域验证、用户配置覆盖优先级

## 任务 7: 编写属性测试
- [ ] 7.1 创建 `tools/cloud_adapter/tests/test_aws_cn_partition_props.py`，使用 Hypothesis 库实现 8 个正确性属性的属性测试，每个测试至少 100 次迭代，注释引用对应的 Property 编号
