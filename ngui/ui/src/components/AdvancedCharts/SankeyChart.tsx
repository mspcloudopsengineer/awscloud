import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, Sankey, Tooltip, Layer, Rectangle } from 'recharts';

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyChartProps {
  title?: string;
  colors?: string[];
}

// 示例成本流向数据
const DEMO_DATA = {
  nodes: [
    { name: 'AWS' }, { name: 'Azure' }, { name: 'GCP' },
    { name: '计算' }, { name: '存储' }, { name: '网络' }, { name: '数据库' },
    { name: '生产环境' }, { name: '开发环境' }, { name: '测试环境' },
  ] as SankeyNode[],
  links: [
    { source: 0, target: 3, value: 5000 }, { source: 0, target: 4, value: 3000 },
    { source: 0, target: 5, value: 2000 }, { source: 1, target: 3, value: 4000 },
    { source: 1, target: 6, value: 3500 }, { source: 2, target: 4, value: 2500 },
    { source: 2, target: 5, value: 1500 }, { source: 3, target: 7, value: 6000 },
    { source: 3, target: 8, value: 2000 }, { source: 3, target: 9, value: 1000 },
    { source: 4, target: 7, value: 3500 }, { source: 4, target: 8, value: 2000 },
    { source: 5, target: 7, value: 2000 }, { source: 5, target: 9, value: 1500 },
    { source: 6, target: 7, value: 2500 }, { source: 6, target: 8, value: 1000 },
  ] as SankeyLink[],
};

export const SankeyChart: React.FC<SankeyChartProps> = ({ title = '成本流向分析', colors }) => {
  const defaultColors = colors || ['#4AB4EE', '#FFC348', '#FF6B6B', '#51CF66', '#845EF7'];

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          <Sankey data={DEMO_DATA} nodePadding={30} margin={{ top: 10, right: 10, bottom: 10, left: 10 }} link={{ stroke: '#77c0d8' }}>
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SankeyChart;
