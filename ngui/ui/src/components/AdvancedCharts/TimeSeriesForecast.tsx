import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TimeSeriesForecastProps {
  title?: string;
  colors?: string[];
}

const generateDemoData = () => {
  const data = [];
  const now = new Date();
  for (let i = -30; i <= 14; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const base = 1000 + Math.sin(i / 7) * 200 + i * 5;
    const isFuture = i > 0;
    data.push({
      date: date.toISOString().split('T')[0],
      actual: isFuture ? null : Math.round(base + Math.random() * 100),
      predicted: Math.round(base + (isFuture ? Math.random() * 50 : 0)),
      upper: Math.round(base * 1.15),
      lower: Math.round(base * 0.85),
    });
  }
  return data;
};

export const TimeSeriesForecast: React.FC<TimeSeriesForecastProps> = ({ title = '时间序列预测' }) => {
  const data = useMemo(() => generateDemoData(), []);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <Box sx={{ height: 350, width: '100%' }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#e3f2fd" name="上限" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#fff" name="下限" />
            <Area type="monotone" dataKey="actual" stroke="#4AB4EE" fill="#4AB4EE" fillOpacity={0.3} name="实际成本" />
            <Area type="monotone" dataKey="predicted" stroke="#FFC348" fill="#FFC348" fillOpacity={0.2} strokeDasharray="5 5" name="预测成本" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default TimeSeriesForecast;
