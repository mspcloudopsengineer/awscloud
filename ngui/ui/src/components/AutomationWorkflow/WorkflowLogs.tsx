import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { WorkflowLog } from './useWorkflowBuilder';

interface WorkflowLogsProps {
  logs: WorkflowLog[];
}

const STATUS_MAP = {
  success: { label: '成功', color: 'success' as const },
  failed: { label: '失败', color: 'error' as const },
  running: { label: '运行中', color: 'info' as const },
};

export const WorkflowLogs: React.FC<WorkflowLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
    return <Typography variant="body2" color="text.secondary">暂无执行日志</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>执行日志</Typography>
      <List dense>
        {logs.slice(0, 20).map((log) => (
          <ListItem key={log.id} sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 0.5 }}>
            <ListItemText
              primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Chip label={STATUS_MAP[log.status].label} size="small" color={STATUS_MAP[log.status].color} /> {log.message}</Box>}
              secondary={new Date(log.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WorkflowLogs;
