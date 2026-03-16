import React from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { WorkflowBuilder } from './WorkflowBuilder';
import { WorkflowRules } from './WorkflowRules';
import { WorkflowLogs } from './WorkflowLogs';
import { useWorkflowBuilder } from './useWorkflowBuilder';

export const AutomationWorkflow: React.FC = () => {
  const { workflows, logs, addWorkflow, deleteWorkflow, toggleWorkflow, simulateRun } = useWorkflowBuilder();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Settings sx={{ mr: 1 }} /> 工作流自动化
        </Typography>
        <WorkflowBuilder onAdd={addWorkflow} />
        <Divider sx={{ my: 2 }} />
        <WorkflowRules workflows={workflows} onToggle={toggleWorkflow} onDelete={deleteWorkflow} onRun={simulateRun} />
        <Divider sx={{ my: 2 }} />
        <WorkflowLogs logs={logs} />
      </CardContent>
    </Card>
  );
};

export default AutomationWorkflow;
