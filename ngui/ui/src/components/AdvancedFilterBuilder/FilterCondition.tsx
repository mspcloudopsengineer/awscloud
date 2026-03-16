import React from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

export interface FilterConditionData {
  id: string;
  field: string;
  operator: string;
  value: string | number | string[];
}

interface FilterConditionProps {
  condition: FilterConditionData;
  fieldLabel: string;
  operatorLabel: string;
  onRemove: (id: string) => void;
}

export const FilterCondition: React.FC<FilterConditionProps> = ({
  condition,
  fieldLabel,
  operatorLabel,
  onRemove,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
    <Chip label={fieldLabel} size="small" color="primary" />
    <Typography variant="body2" color="text.secondary">{operatorLabel}</Typography>
    <Chip label={Array.isArray(condition.value) ? condition.value.join(', ') : String(condition.value)} size="small" />
    <IconButton size="small" onClick={() => onRemove(condition.id)} aria-label="Remove condition">
      <Delete fontSize="small" />
    </IconButton>
  </Box>
);

export default FilterCondition;
