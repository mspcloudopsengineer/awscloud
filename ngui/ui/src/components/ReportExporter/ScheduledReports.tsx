import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Switch, Chip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ScheduledReport } from './useReportExporter';

const SCHEDULE_LABELS = { daily: '每天', weekly: '每周', monthly: '每月' };

interface ScheduledReportsProps {
  schedules: ScheduledReport[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ScheduledReports: React.FC<ScheduledReportsProps> = ({ schedules, onToggle, onDelete }) => {
  if (schedules.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>定期报告</Typography>
        <Typography variant="body2" color="text.secondary">暂无定期报告计划</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>定期报告 ({schedules.length})</Typography>
      <List>
        {schedules.map((s) => (
          <ListItem key={s.id} sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 0.5 }}>
            <ListItemText
              primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{s.name} <Chip label={SCHEDULE_LABELS[s.schedule]} size="small" /> <Chip label={s.config.format.toUpperCase()} size="small" variant="outlined" /></Box>}
              secondary={`收件人: ${s.recipients.join(', ') || '无'}`}
            />
            <ListItemSecondaryAction>
              <Switch checked={s.enabled} onChange={() => onToggle(s.id)} size="small" />
              <IconButton size="small" onClick={() => onDelete(s.id)}><Delete /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ScheduledReports;
