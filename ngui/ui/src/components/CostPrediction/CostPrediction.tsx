import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpensesData } from 'hooks/useExpensesData';
import { FormattedMessage } from 'react-intl';

// 预测成本数据类型
interface PredictedCostData {
  date: string;
  actualCost: number;
  predictedCost: number;
  lowerBound: number;
  upperBound: number;
}

// 成本预测组件
export const CostPrediction: React.FC = () => {
  const [dataSourceId, setDataSourceId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('30');
  const [predictionData, setPredictionData] = useState<PredictedCostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取费用数据
  const { data: expensesData, loading: expensesLoading } = useExpensesData({
    dataSourceId,
    startDate: new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // 简单的线性回归预测算法
  const predictCosts = (data: any[]): PredictedCostData[] => {
    if (!data || data.length < 2) return [];

    // 按日期排序
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    // 提取数据点
    const points = sortedData.map((item, index) => ({
      x: index,
      y: item.cost || 0,
      date: item.date,
    }));

    // 线性回归计算
    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 预测未来7天的成本
    const predictions: PredictedCostData[] = [];
    
    // 添加历史数据
    points.forEach((point) => {
      predictions.push({
        date: point.date,
        actualCost: point.y,
        predictedCost: point.y,
        lowerBound: point.y * 0.8,
        upperBound: point.y * 1.2,
      });
    });

    // 添加预测数据
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      
      const predictedValue = slope * (n + i - 1) + intercept;
      const confidenceInterval = predictedValue * 0.15; // 15% 置信区间

      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        actualCost: 0, // 未来没有实际数据
        predictedCost: Math.max(0, predictedValue),
        lowerBound: Math.max(0, predictedValue - confidenceInterval),
        upperBound: predictedValue + confidenceInterval,
      });
    }

    return predictions;
  };

  // 当费用数据加载完成时进行预测
  useEffect(() => {
    if (expensesData && expensesData.length > 0) {
      setLoading(true);
      // 模拟预测计算
      setTimeout(() => {
        const predictions = predictCosts(expensesData);
        setPredictionData(predictions);
        setLoading(false);
      }, 500);
    }
  }, [expensesData]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="costPrediction.title" defaultMessage="成本预测" />
        </Typography>

        {/* 筛选器 */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="costPrediction.dataSource" defaultMessage="数据源" />
              </InputLabel>
              <Select
                value={dataSourceId}
                label={<FormattedMessage id="costPrediction.dataSource" defaultMessage="数据源" />}
                onChange={(e) => setDataSourceId(e.target.value)}
              >
                <MenuItem value="">
                  <FormattedMessage id="costPrediction.allDataSources" defaultMessage="全部数据源" />
                </MenuItem>
                {/* 这里应该从 API 获取数据源列表 */}
                <MenuItem value="aws-1">AWS 账户 1</MenuItem>
                <MenuItem value="azure-1">Azure 订阅 1</MenuItem>
                <MenuItem value="gcp-1">GCP 项目 1</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>
                <FormattedMessage id="costPrediction.timeRange" defaultMessage="时间范围" />
              </InputLabel>
              <Select
                value={timeRange}
                label={<FormattedMessage id="costPrediction.timeRange" defaultMessage="时间范围" />}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7">最近 7 天</MenuItem>
                <MenuItem value="30">最近 30 天</MenuItem>
                <MenuItem value="90">最近 90 天</MenuItem>
                <MenuItem value="180">最近 180 天</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* 预测图表 */}
        <Box sx={{ height: 400, width: '100%' }}>
          {loading ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 10 }}>
              <FormattedMessage id="costPrediction.loading" defaultMessage="正在计算预测..." />
            </Typography>
          ) : predictionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <Tooltip
                  formatter={(value) => `$${(value as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  labelFormatter={(label) => `日期: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actualCost"
                  name={<FormattedMessage id="costPrediction.actual" defaultMessage="实际成本" />}
                  stroke="#4AB4EE"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="predictedCost"
                  name={<FormattedMessage id="costPrediction.predicted" defaultMessage="预测成本" />}
                  stroke="#FFC348"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lowerBound"
                  name={<FormattedMessage id="costPrediction.lowerBound" defaultMessage="下限" />}
                  stroke="#999"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="upperBound"
                  name={<FormattedMessage id="costPrediction.upperBound" defaultMessage="上限" />}
                  stroke="#999"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 10 }}>
              <FormattedMessage id="costPrediction.noData" defaultMessage="暂无数据，请选择数据源和时间范围" />
            </Typography>
          )}
        </Box>

        {/* 预测摘要 */}
        {predictionData.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              <FormattedMessage id="costPrediction.summary" defaultMessage="预测摘要" />
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="costPrediction.currentMonthPredicted" defaultMessage="本月预测成本" />
                </Typography>
                <Typography variant="h6" color="primary">
                  ${predictionData.slice(-7).reduce((sum, item) => sum + item.predictedCost, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="costPrediction.confidenceInterval" defaultMessage="置信区间" />
                </Typography>
                <Typography variant="h6" color="success.main">
                  ±15%
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="costPrediction.trend" defaultMessage="成本趋势" />
                </Typography>
                <Typography variant="h6" color={
                  predictionData[predictionData.length - 1].predictedCost > predictionData[predictionData.length - 8]?.predictedCost 
                    ? 'error.main' 
                    : 'success.main'
                }>
                  {predictionData[predictionData.length - 1].predictedCost > predictionData[predictionData.length - 8]?.predictedCost 
                    ? '↑ 上升' 
                    : '↓ 下降'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="costPrediction.daysAhead" defaultMessage="预测天数" />
                </Typography>
                <Typography variant="h6">
                  7 天
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CostPrediction;
