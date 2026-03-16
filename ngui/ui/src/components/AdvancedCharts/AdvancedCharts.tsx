import React from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, Grid, Switch, FormControlLabel } from '@mui/material';
import { BarChart as ChartIcon } from '@mui/icons-material';
import { SankeyChart } from './SankeyChart';
import { HeatmapChart } from './HeatmapChart';
import { TimeSeriesForecast } from './TimeSeriesForecast';
import { useChartConfig, ChartType } from './useChartConfig';

const CHART_TABS: { value: ChartType; label: string }[] = [
  { value: 'sankey', label: '成本流向 (桑基图)' },
  { value: 'heatmap', label: '成本分布 (热力图)' },
  { value: 'timeseries', label: '时间序列预测' },
];

export const AdvancedCharts: React.FC = () => {
  const { config, updateConfig, colorSchemes } = useChartConfig();

  const currentColors = colorSchemes.find((s) => s.value === config.colorScheme)?.colors;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ChartIcon sx={{ mr: 1 }} /> 数据可视化增强
        </Typography>

        <Tabs value={config.type} onChange={(_, v) => updateConfig({ type: v })} sx={{ mb: 2 }}>
          {CHART_TABS.map((t) => <Tab key={t.value} value={t.value} label={t.label} />)}
        </Tabs>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>配色方案</InputLabel>
              <Select value={config.colorScheme} label="配色方案" onChange={(e) => updateConfig({ colorScheme: e.target.value })}>
                {colorSchemes.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel control={<Switch checked={config.showLegend} onChange={(e) => updateConfig({ showLegend: e.target.checked })} />} label="显示图例" />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel control={<Switch checked={config.showTooltip} onChange={(e) => updateConfig({ showTooltip: e.target.checked })} />} label="显示提示" />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel control={<Switch checked={config.animate} onChange={(e) => updateConfig({ animate: e.target.checked })} />} label="动画效果" />
          </Grid>
        </Grid>

        <Box sx={{ minHeight: 400 }}>
          {config.type === 'sankey' && <SankeyChart colors={currentColors} />}
          {config.type === 'heatmap' && <HeatmapChart colors={currentColors} />}
          {config.type === 'timeseries' && <TimeSeriesForecast colors={currentColors} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedCharts;
