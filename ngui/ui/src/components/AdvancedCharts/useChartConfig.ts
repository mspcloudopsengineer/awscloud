import { useState, useCallback } from 'react';

export type ChartType = 'sankey' | 'heatmap' | 'timeseries';

export interface ChartConfig {
  type: ChartType;
  title: string;
  colorScheme: string;
  showLegend: boolean;
  showTooltip: boolean;
  animate: boolean;
}

const DEFAULT_CONFIG: ChartConfig = {
  type: 'sankey',
  title: '成本流向分析',
  colorScheme: 'default',
  showLegend: true,
  showTooltip: true,
  animate: true,
};

export const COLOR_SCHEMES = [
  { value: 'default', label: '默认', colors: ['#4AB4EE', '#FFC348', '#FF6B6B', '#51CF66', '#845EF7'] },
  { value: 'warm', label: '暖色', colors: ['#FF6B6B', '#FFA94D', '#FFD43B', '#FF922B', '#E64980'] },
  { value: 'cool', label: '冷色', colors: ['#4AB4EE', '#339AF0', '#5C7CFA', '#845EF7', '#20C997'] },
  { value: 'mono', label: '单色', colors: ['#212529', '#495057', '#868E96', '#ADB5BD', '#DEE2E6'] },
];

export const useChartConfig = () => {
  const [config, setConfig] = useState<ChartConfig>(DEFAULT_CONFIG);

  const updateConfig = useCallback((updates: Partial<ChartConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  return { config, updateConfig, resetConfig, colorSchemes: COLOR_SCHEMES };
};

export default useChartConfig;
