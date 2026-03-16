import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete, PlayArrow, Save } from '@mui/icons-material';

export interface SavedFilter {
  id: string;
  name: string;
  conditions: Array<{ field: string; operator: string; value: string | number | string[] }>;
  logic: 'AND' | 'OR';
  createdAt: string;
}

interface SavedFiltersProps {
  filters: SavedFilter[];
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
}

export const SavedFilters: React.FC<SavedFiltersProps> = ({ filters, onApply, onDelete, onSave }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleSave = () => {
    if (filterName.trim()) {
      onSave(filterName.trim());
      setFilterName('');
      setDialogOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">已保存的筛选器</Typography>
        <Button size="small" startIcon={<Save />} onClick={() => setDialogOpen(true)}>保存当前</Button>
      </Box>
      {filters.length === 0 ? (
        <Typography variant="body2" color="text.secondary">暂无保存的筛选器</Typography>
      ) : (
        <List dense>
          {filters.map((filter) => (
            <ListItem key={filter.id} sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 0.5 }}>
              <ListItemText primary={filter.name} secondary={`${filter.conditions.length} 个条件 · ${filter.logic}`} />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={() => onApply(filter)} aria-label="Apply filter"><PlayArrow fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => onDelete(filter.id)} aria-label="Delete filter"><Delete fontSize="small" /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>保存筛选器</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="筛选器名称" fullWidth value={filterName} onChange={(e) => setFilterName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedFilters;
