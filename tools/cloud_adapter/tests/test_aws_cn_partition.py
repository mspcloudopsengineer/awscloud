"""Unit tests for AWS CN partition support in the Aws adapter."""
import unittest
from unittest.mock import patch, MagicMock, PropertyMock

from tools.cloud_adapter.clouds.aws import Aws, PARTITION_CONFIG
from tools.cloud_adapter.model import (
    InstanceResource, VolumeResource, SnapshotResource,
    BucketResource, IpAddressResource, LoadBalancerResource,
)


def _make_adapter(config=None, partition_override=None):
    """Create an Aws adapter with mocked session to avoid real AWS calls."""
    cfg = config or {
        'access_key_id': 'AKIAIOSFODNN7EXAMPLE',
        'secret_access_key': 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    }
    adapter = Aws(cfg)
    if partition_override:
        adapter._partition = partition_override
    return adapter


class TestPartitionDetection(unittest.TestCase):
    """Task 2: Partition auto-detection tests."""

    @patch.object(Aws, '_base_session')
    def test_detect_global_partition_from_arn(self, mock_base):
        sts = MagicMock()
        sts.get_caller_identity.return_value = {
            'Arn': 'arn:aws:iam::123456789012:user/testuser'
        }
        session = MagicMock()
        session.client.return_value = sts
        mock_base.return_value = session

        adapter = _make_adapter()
        result = adapter._detect_partition()
        self.assertEqual(result, 'aws')

    @patch.object(Aws, '_base_session')
    def test_detect_cn_partition_from_arn(self, mock_base):
        sts = MagicMock()
        sts.get_caller_identity.return_value = {
            'Arn': 'arn:aws-cn:iam::123456789012:user/testuser'
        }
        session = MagicMock()
        session.client.return_value = sts
        mock_base.return_value = session

        adapter = _make_adapter()
        result = adapter._detect_partition()
        self.assertEqual(result, 'aws-cn')

    @patch.object(Aws, '_base_session')
    def test_detect_partition_fallback_cn_region(self, mock_base):
        mock_base.side_effect = Exception('connection error')
        adapter = _make_adapter({'access_key_id': 'AK', 'secret_access_key': 'SK',
                                 'region_name': 'cn-north-1'})
        result = adapter._detect_partition()
        self.assertEqual(result, 'aws-cn')

    @patch.object(Aws, '_base_session')
    def test_detect_partition_fallback_global_region(self, mock_base):
        mock_base.side_effect = Exception('connection error')
        adapter = _make_adapter({'access_key_id': 'AK', 'secret_access_key': 'SK',
                                 'region_name': 'us-east-1'})
        result = adapter._detect_partition()
        self.assertEqual(result, 'aws')

    @patch.object(Aws, '_base_session')
    def test_detect_partition_fallback_no_region(self, mock_base):
        mock_base.side_effect = Exception('connection error')
        adapter = _make_adapter({'access_key_id': 'AK', 'secret_access_key': 'SK'})
        result = adapter._detect_partition()
        self.assertEqual(result, 'aws')

    def test_partition_property_caches(self):
        adapter = _make_adapter(partition_override='aws-cn')
        self.assertEqual(adapter.partition, 'aws-cn')
        # Calling again returns cached value
        self.assertEqual(adapter.partition, 'aws-cn')


class TestPartitionHelperProperties(unittest.TestCase):
    """Task 2.4: Helper properties driven by partition config."""

    def test_global_partition_properties(self):
        adapter = _make_adapter(partition_override='aws')
        self.assertFalse(adapter._is_cn_partition)
        self.assertEqual(adapter._console_base_url, 'https://console.aws.amazon.com')
        self.assertEqual(adapter._cur_region, 'us-east-1')
        self.assertEqual(adapter._ec2_default_region, 'us-east-1')
        self.assertEqual(adapter._arn_prefix, 'arn:aws')
        self.assertTrue(adapter._pricing_available)
        self.assertEqual(adapter._ssm_region, 'us-east-1')
        self.assertEqual(adapter._default_s3_region, 'eu-central-1')

    def test_cn_partition_properties(self):
        adapter = _make_adapter(partition_override='aws-cn')
        self.assertTrue(adapter._is_cn_partition)
        self.assertEqual(adapter._console_base_url, 'https://console.amazonaws.cn')
        self.assertEqual(adapter._cur_region, 'cn-northwest-1')
        self.assertEqual(adapter._ec2_default_region, 'cn-north-1')
        self.assertEqual(adapter._arn_prefix, 'arn:aws-cn')
        self.assertFalse(adapter._pricing_available)
        self.assertEqual(adapter._ssm_region, 'cn-north-1')
        self.assertEqual(adapter._default_s3_region, 'cn-northwest-1')


class TestConsoleLinks(unittest.TestCase):
    """Task 5.1: Console link generation with partition-aware base URL."""

    def test_global_instance_link(self):
        adapter = _make_adapter(partition_override='aws')
        link = adapter._generate_cloud_link(
            InstanceResource, 'us-east-1', 'i-12345')
        self.assertIn('https://console.aws.amazon.com', link)
        self.assertIn('us-east-1', link)
        self.assertIn('i-12345', link)

    def test_cn_instance_link(self):
        adapter = _make_adapter(partition_override='aws-cn')
        link = adapter._generate_cloud_link(
            InstanceResource, 'cn-north-1', 'i-12345')
        self.assertIn('https://console.amazonaws.cn', link)
        self.assertIn('cn-north-1', link)

    def test_cn_bucket_link(self):
        adapter = _make_adapter(partition_override='aws-cn')
        link = adapter._generate_cloud_link(
            BucketResource, 'cn-north-1', 'my-bucket')
        self.assertIn('https://console.amazonaws.cn', link)
        self.assertIn('my-bucket', link)

    def test_all_resource_types_have_links(self):
        adapter = _make_adapter(partition_override='aws')
        for res_type in [InstanceResource, VolumeResource, SnapshotResource,
                         BucketResource, IpAddressResource, LoadBalancerResource]:
            link = adapter._generate_cloud_link(res_type, 'us-east-1', 'test-id')
            self.assertIsNotNone(link, f"No link for {res_type}")


class TestPricingCNDisabled(unittest.TestCase):
    """Task 4.2: Pricing API disabled for CN partition."""

    def test_pricing_property_returns_none_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        self.assertIsNone(adapter.pricing)

    def test_get_pricing_returns_empty_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_pricing({'instanceType': 't2.micro'})
        self.assertEqual(result, [])

    def test_get_similar_sku_prices_returns_empty_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_similar_sku_prices('sku123')
        self.assertEqual(result, [])

    def test_get_prices_returns_empty_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_prices({'instanceType': 't2.micro'})
        self.assertEqual(result, [])

    def test_get_pricing_score_base_returns_zeros_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        regions = ['cn-north-1', 'cn-northwest-1']
        result = adapter.get_pricing_score_base(regions, ['sku1'])
        self.assertEqual(result, {'cn-north-1': 0, 'cn-northwest-1': 0})

    def test_get_oregon_sku_returns_empty_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_oregon_sku_for_types(['t2.micro'])
        self.assertEqual(result, [])

    def test_get_price_checking_skus_returns_empty_for_cn(self):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_price_checking_skus()
        self.assertEqual(result, [])


class TestSSMRegionMap(unittest.TestCase):
    """Task 4.5: SSM region name map fallback for CN."""

    @patch.object(Aws, 'list_regions', return_value=['cn-north-1', 'cn-northwest-1'])
    def test_cn_region_map_uses_static_coordinates(self, _):
        adapter = _make_adapter(partition_override='aws-cn')
        result = adapter.get_region_name_code_map()
        self.assertIn('China (Beijing)', result)
        self.assertIn('China (Ningxia)', result)
        self.assertEqual(result['China (Beijing)'], 'cn-north-1')
        self.assertEqual(result['China (Ningxia)'], 'cn-northwest-1')
        # Should only contain CN regions
        for code in result.values():
            self.assertTrue(code.startswith('cn-'))


class TestPartitionConfig(unittest.TestCase):
    """Verify PARTITION_CONFIG completeness."""

    def test_both_partitions_have_all_keys(self):
        expected_keys = {'arn_prefix', 'sts_endpoint', 'sts_region',
                         'cur_region', 'console_url', 'ec2_region',
                         'default_s3_region', 'ssm_region', 'pricing_available'}
        for partition in ['aws', 'aws-cn']:
            self.assertTrue(partition in PARTITION_CONFIG)
            actual_keys = set(PARTITION_CONFIG[partition].keys())
            self.assertTrue(expected_keys.issubset(actual_keys),
                            f"Missing keys in {partition}: {expected_keys - actual_keys}")

    def test_aws_config_values(self):
        cfg = PARTITION_CONFIG['aws']
        self.assertEqual(cfg['arn_prefix'], 'arn:aws')
        self.assertEqual(cfg['cur_region'], 'us-east-1')
        self.assertEqual(cfg['default_s3_region'], 'eu-central-1')
        self.assertTrue(cfg['pricing_available'])

    def test_aws_cn_config_values(self):
        cfg = PARTITION_CONFIG['aws-cn']
        self.assertEqual(cfg['arn_prefix'], 'arn:aws-cn')
        self.assertEqual(cfg['cur_region'], 'cn-northwest-1')
        self.assertEqual(cfg['default_s3_region'], 'cn-northwest-1')
        self.assertFalse(cfg['pricing_available'])


if __name__ == '__main__':
    unittest.main()
