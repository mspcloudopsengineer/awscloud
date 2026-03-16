import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';
import { Speed } from '@mui/icons-material';
import { usePerformance } from './usePerformance';
import { VirtualizedList } from './VirtualizedList';
import { LazyLoadComponent } from './LazyLoadComponent';

const MetricCard: React.FC<{ label: string; value: string | number; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, textAlign: 'center' }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="h5" sx={{ color, fontWeight: 'bold' }}>{value}</Typography>
    <Typography variant="caption" color="text.secondary">{unit}</Typography>
  </Box>
);

// 生成示例数据
const generateItems = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i, name: `资源 ${i + 1}`, cost: Math.round(Math.random() * 1000 * 100) / 100, type: ['EC2', 'S3', 'RDS', 'Lambda'][i % 4],
}));

export const PerformanceOptimizer: React.FC = () => {
  const { metrics } = usePerformance();
  const items = useMemo(() => generateItems(10000), []);

  const fpsColor = metrics.fps >= 50 ? '#51CF66' : metrics.fps >= 30 ? '#FFC348' : '#FF6B6B';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Speed sx={{ mr: 1 }} /> 性能监控与优化
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}><MetricCard label="页面加载" value={metrics.loadTime} unit="ms" color="#4AB4EE" /></Grid>
          <Grid item xs={6} md={3}><MetricCard label="FPS" value={metrics.fps} unit="帧/秒" color={fpsColor} /></Grid>
          <Grid item xs={6} md={3}><MetricCard label="内存使用" value={metrics.memoryUsage} unit="MB" color="#845EF7" /></Grid>
          <Grid item xs={6} md={3}><MetricCard label="渲染时间" value={metrics.renderTime} unit="ms" color="#FFC348" /></Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom>虚拟滚动演示 (10,000 项)</Typography>
        <VirtualizedList
          items={items}
          itemHeight={48}
          containerHeight={400}
          renderItem={(item, index) => (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, height: '100%', borderBottom: '1px solid', borderColor: 'divider', bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default' }}>
              <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
              <Typography variant="body2" sx={{ width: 80 }}>{item.type}</Typography>
              <Typography variant="body2" sx={{ width: 100, textAlign: 'right' }}>${item.cost}</Typography>
            </Box>
          )}
        />

        <Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>懒加载演示</Typography>
        {[1, 2, 3].map((i) => (
          <LazyLoadComponent key={i} height={100}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 1 }}>
              <Typography variant="body1">懒加载内容块 #{i}</Typography>
              <Typography variant="body2" color="text.secondary">此内容在滚动到可视区域时才会加载渲染</Typography>
            </Box>
          </LazyLoadComponent>
        ))}
      </CardContent>
    </Card>
  );
};

export default PerformanceOptimizer;
