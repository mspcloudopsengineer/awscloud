import React from 'react';
import { Box, Typography, Tooltip as MuiTooltip } from '@mui/material';

interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

interface HeatmapChartProps {
  title?: string;
  colors?: string[];
}

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// 生成示例热力图数据
const generateDemoData = (): HeatmapCell[] => {
  const data: HeatmapCell[] = [];
  DAYS.forEach((day) => {
    HOURS.forEach((hour) => {
      data.push({ day, hour, value: Math.round(Math.random() * 100 + (hour >= 9 && hour <= 18 ? 50 : 0)) });
    });
  });
  return data;
};

const getColor = (value: number, max: number): string => {
  const ratio = value / max;
  if (ratio < 0.25) return '#e8f5e9';
  if (ratio < 0.5) return '#a5d6a7';
  if (ratio < 0.75) return '#ffa726';
  return '#ef5350';
};

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ title = '成本分布热力图' }) => {
  const data = React.useMemo(() => generateDemoData(), []);
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: `80px repeat(24, 1fr)`, gap: '2px', minWidth: 600 }}>
          <Box />
          {HOURS.map((h) => (
            <Typography key={h} variant="caption" align="center" sx={{ fontSize: 10 }}>{`${h}:00`}</Typography>
          ))}
          {DAYS.map((day) => (
            <React.Fragment key={day}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>{day}</Typography>
              {HOURS.map((hour) => {
                const cell = data.find((d) => d.day === day && d.hour === hour);
                const val = cell?.value || 0;
                return (
                  <MuiTooltip key={`${day}-${hour}`} title={`${day} ${hour}:00 - $${val}`}>
                    <Box sx={{ bgcolor: getColor(val, maxValue), borderRadius: '2px', height: 24, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} />
                  </MuiTooltip>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
          <Typography variant="caption">低</Typography>
          {['#e8f5e9', '#a5d6a7', '#ffa726', '#ef5350'].map((c) => (
            <Box key={c} sx={{ width: 20, height: 12, bgcolor: c, borderRadius: '2px' }} />
          ))}
          <Typography variant="caption">高</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HeatmapChart;
