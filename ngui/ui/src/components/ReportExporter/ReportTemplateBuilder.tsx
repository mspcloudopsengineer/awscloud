import React, { useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import { ExportFormat, ReportTemplate, ReportConfig } from './useReportExporter';

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'pdf', label: 'PDF 报告' },
  { value: 'excel', label: 'Excel 表格' },
  { value: 'csv', label: 'CSV 数据' },
];

const TEMPLATE_OPTIONS: { value: ReportTemplate; label: string }[] = [
  { value: 'cost-summary', label: '成本摘要' },
  { value: 'resource-inventory', label: '资源清单' },
  { value: 'optimization', label: '优化建议' },
  { value: 'custom', label: '自定义报告' },
];

interface ReportTemplateBuilderProps {
  onExport: (config: ReportConfig) => void;
  isExporting: boolean;
}

export const ReportTemplateBuilder: React.FC<ReportTemplateBuilderProps> = ({ onExport, isExporting }) => {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [template, setTemplate] = useState<ReportTemplate>('cost-summary');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const handleExport = () => {
    onExport({ format, template, title: title || TEMPLATE_OPTIONS.find((t) => t.value === template)?.label || '', dateRange: { start: startDate, end: endDate }, includeCharts, includeSummary });
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>导出报告</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>导出格式</InputLabel>
            <Select value={format} label="导出格式" onChange={(e) => setFormat(e.target.value as ExportFormat)}>
              {FORMAT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>报告模板</InputLabel>
            <Select value={template} label="报告模板" onChange={(e) => setTemplate(e.target.value as ReportTemplate)}>
              {TEMPLATE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth size="small" label="报告标题 (可选)" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth size="small" type="date" label="开始日期" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth size="small" type="date" label="结束日期" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControlLabel control={<Switch checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} />} label="包含图表" />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControlLabel control={<Switch checked={includeSummary} onChange={(e) => setIncludeSummary(e.target.checked)} />} label="包含摘要" />
        </Grid>
      </Grid>
      <Button variant="contained" startIcon={isExporting ? <CircularProgress size={16} /> : <Download />} onClick={handleExport} disabled={isExporting} sx={{ mt: 2 }}>
        {isExporting ? '导出中...' : '导出报告'}
      </Button>
    </Box>
  );
};

export default ReportTemplateBuilder;
