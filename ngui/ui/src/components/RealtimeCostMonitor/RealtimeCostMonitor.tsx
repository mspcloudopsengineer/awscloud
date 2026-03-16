import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FormattedMessage, useIntl } from 'react-intl';

// 实时成本数据类型
interface RealtimeCostData {
  timestamp: string;
  cost: number;
  resourcesCount: number;
  cloudType: string;
}

// 实时成本监控组件
export const RealtimeCostMonitor: React.FC = () => {
  const [data, setData] = useState<RealtimeCostData[]>([]);
  const [currentCost, setCurrentCost] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30秒

  const intl = useIntl();

  // WebSocket 连接
  const connectWebSocket = useCallback(() => {
    try {
      // 模拟 WebSocket 连接
      // 实际应该使用 WebSocket API
      const ws = new WebSocket('ws://localhost:8080/cost-realtime');
      
      ws.onopen = () => {
        setConnected(true);
        setError(null);
        console.log('WebSocket connected for cost monitoring');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleNewData(message);
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket disconnected');
        // 3秒后重连
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        setConnected(false);
        console.error('WebSocket error:', error);
      };

      return ws;
    } catch (err) {
      setError('Failed to connect to WebSocket');
      setConnected(false);
      return null;
    }
  }, []);

  // 处理新数据
  const handleNewData = useCallback((newData: RealtimeCostData) => {
    setData(prevData => {
      const updatedData = [...prevData, newData];
      // 保持最近 100 条数据
      if (updatedData.length > 100) {
        return updatedData.slice(-100);
      }
      return updatedData;
    });
    setCurrentCost(prev => prev + newData.cost);
  }, []);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // 模拟获取最新数据
      const mockData: RealtimeCostData = {
        timestamp: new Date().toISOString(),
        cost: Math.random() * 10 + 5, // 随机成本
        resourcesCount: Math.floor(Math.random() * 10) + 1,
        cloudType: 'AWS',
      };
      handleNewData(mockData);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleNewData]);

  // 初始化 WebSocket 连接
  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // 格式化成本
  const formatCost = (cost: number) => {
    return cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            <FormattedMessage id="realtimeCostMonitor.title" defaultMessage="实时成本监控" />
          </Typography>
          <Box>
            <Chip 
              label={connected ? '已连接' : '未连接'} 
              color={connected ? 'success' : 'error'}
              size="small"
            />
            <Chip 
              label={autoRefresh ? '自动刷新' : '手动刷新'} 
              variant="outlined" 
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 当前成本卡片 */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              borderRadius: 1, 
              color: 'primary.contrastText',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <FormattedMessage id="realtimeCostMonitor.currentCost" defaultMessage="当前成本" />
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${formatCost(currentCost)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'info.main', 
              borderRadius: 1, 
              color: 'info.contrastText',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <FormattedMessage id="realtimeCostMonitor.resources" defaultMessage="监控资源" />
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {data.length > 0 ? data[data.length - 1].resourcesCount : 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'secondary.main', 
              borderRadius: 1, 
              color: 'secondary.contrastText',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                <FormattedMessage id="realtimeCostMonitor.refreshRate" defaultMessage="刷新频率" />
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {refreshInterval / 1000}s
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 设置面板 */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <FormattedMessage id="realtimeCostMonitor.autoRefresh" defaultMessage="自动刷新" />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">30s</Typography>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={refreshInterval / 1000}
                  onChange={(e) => setRefreshInterval(Number(e.target.value) * 1000)}
                  style={{ flex: 1 }}
                />
                <Typography variant="body2">120s</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                <Typography variant="body2">
                  <FormattedMessage id="realtimeCostMonitor.enableAutoRefresh" defaultMessage="启用自动刷新" />
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* 成本趋势图表 */}
        <Box sx={{ height: 300, width: '100%' }}>
          {data.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 10 }}>
              <FormattedMessage id="realtimeCostMonitor.noData" defaultMessage="等待实时数据..." />
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="timestamp"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => formatTime(value)}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Tooltip
                  formatter={(value) => `$${(value as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  labelFormatter={(label) => `时间: ${formatTime(label)}`}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name={<FormattedMessage id="realtimeCostMonitor.cost" defaultMessage="成本" />}
                  stroke="#4AB4EE"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* 最新数据列表 */}
        {data.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              <FormattedMessage id="realtimeCostMonitor.latestData" defaultMessage="最新数据" />
            </Typography>
            <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
              {data.slice(-10).reverse().map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 1, 
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(item.timestamp)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ${formatCost(item.cost)}
                  </Typography>
                  <Chip 
                    label={item.cloudType} 
                    size="small" 
                    color="info"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeCostMonitor;
