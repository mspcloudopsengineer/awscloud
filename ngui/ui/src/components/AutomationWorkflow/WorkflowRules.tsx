import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Switch, Chip } from '@mui/material';
import { Delete, PlayArrow } from '@mui/icons-material';
import { Workflow } from './useWorkflowBuilder';

interface WorkflowRulesProps {
  workflows: Workflow[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
}

export const WorkflowRules: React.FC<WorkflowRulesProps> = ({ workflows, onToggle, onDelete, onRun }) => {
  if (workflows.length === 0) {
    return <Typography variant="body2" color="text.secondary">暂无工作流规则</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>工作流规则 ({workflows.length})</Typography>
      <List>
        {workflows.map((wf) => (
          <ListItem key={wf.id} sx={{ bgcolor: 'background.default', borderRadius: 1, mb: 1 }}>
            <ListItemText
              primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{wf.name} <Chip label={wf.enabled ? '启用' : '禁用'} size="small" color={wf.enabled ? 'success' : 'default'} /></Box>}
              secondary={`${wf.description} · ${wf.triggers.length} 个触发器 · ${wf.actions.length} 个动作`}
            />
            <ListItemSecondaryAction>
              <Switch checked={wf.enabled} onChange={() => onToggle(wf.id)} size="small" />
              <IconButton size="small" onClick={() => onRun(wf.id)} aria-label="Run"><PlayArrow /></IconButton>
              <IconButton size="small" onClick={() => onDelete(wf.id)} aria-label="Delete"><Delete /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WorkflowRules;
