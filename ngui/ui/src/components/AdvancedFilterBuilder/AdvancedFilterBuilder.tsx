import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, TextField, ToggleButtonGroup, ToggleButton, Divider } from '@mui/material';
import { Add, Delete, FilterList } from '@mui/icons-material';
import { FilterCondition } from './FilterCondition';
import { FilterPreview } from './FilterPreview';
import { SavedFilters } from './SavedFilters';
import { useFilterBuilder } from './useFilterBuilder';

const AVAILABLE_FIELDS = [
  { label: '云账户', value: 'cloudAccount' },
  { label: '资源类型', value: 'resourceType' },
  { label: '资源名称', value: 'resourceName' },
  { label: '所有者', value: 'owner' },
  { label: '标签', value: 'tags' },
  { label: '区域', value: 'region' },
  { label: '成本', value: 'cost' },
  { label: '服务', value: 'service' },
  { label: '状态', value: 'status' },
];

const OPERATORS = [
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'notEquals' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'notContains' },
  { label: '大于', value: 'greaterThan' },
  { label: '小于', value: 'lessThan' },
  { label: '在范围内', value: 'inRange' },
];

const fieldLabels = Object.fromEntries(AVAILABLE_FIELDS.map((f) => [f.value, f.label]));
const operatorLabels = Object.fromEntries(OPERATORS.map((o) => [o.value, o.label]));

export const AdvancedFilterBuilder: React.FC = () => {
  const { conditions, logic, setLogic, addCondition, removeCondition, clearAll, savedFilters, saveFilter, deleteFilter, applyFilter } = useFilterBuilder();
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('equals');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    addCondition(field, operator, value);
    setValue('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} /> 高级筛选
        </Typography>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>字段</InputLabel>
                <Select value={field} label="字段" onChange={(e) => setField(e.target.value)}>
                  {AVAILABLE_FIELDS.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>操作符</InputLabel>
                <Select value={operator} label="操作符" onChange={(e) => setOperator(e.target.value)}>
                  {OPERATORS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth size="small" label="值 (多个值用逗号分隔)" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd} fullWidth disabled={!field || !value}>添加</Button>
            </Grid>
          </Grid>
        </Box>

        {conditions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="subtitle2">条件 ({conditions.length})</Typography>
              <ToggleButtonGroup size="small" value={logic} exclusive onChange={(_, v) => v && setLogic(v)}>
                <ToggleButton value="AND">AND</ToggleButton>
                <ToggleButton value="OR">OR</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {conditions.map((c) => (
              <FilterCondition key={c.id} condition={c} fieldLabel={fieldLabels[c.field] || c.field} operatorLabel={operatorLabels[c.operator] || c.operator} onRemove={removeCondition} />
            ))}
            <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={clearAll} sx={{ mt: 1 }}>清除所有</Button>
          </Box>
        )}

        <FilterPreview conditions={conditions} logic={logic} fieldLabels={fieldLabels} operatorLabels={operatorLabels} />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" color="primary" disabled={conditions.length === 0}>应用筛选</Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <SavedFilters filters={savedFilters} onApply={applyFilter} onDelete={deleteFilter} onSave={saveFilter} />
      </CardContent>
    </Card>
  );
};

export default AdvancedFilterBuilder;
