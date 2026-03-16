import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface FilterPreviewProps {
  conditions: Array<{ field: string; operator: string; value: string | number | string[] }>;
  logic: 'AND' | 'OR';
  fieldLabels: Record<string, string>;
  operatorLabels: Record<string, string>;
}

export const FilterPreview: React.FC<FilterPreviewProps> = ({ conditions, logic, fieldLabels, operatorLabels }) => {
  if (conditions.length === 0) return null;

  return (
    <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #c0d8f0' }}>
      <Typography variant="subtitle2" gutterBottom>筛选预览</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        {conditions.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Chip label={logic} size="small" color="secondary" variant="outlined" />}
            <Chip
              label={`${fieldLabels[c.field] || c.field} ${operatorLabels[c.operator] || c.operator} ${Array.isArray(c.value) ? c.value.join(', ') : c.value}`}
              size="small"
              variant="outlined"
            />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default FilterPreview;
