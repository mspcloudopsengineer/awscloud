import { useState, useCallback } from 'react';

export type TriggerType = 'resource-created' | 'cost-threshold' | 'schedule' | 'tag-missing';
export type ActionType = 'add-tag' | 'send-notification' | 'assign-owner' | 'move-pool' | 'create-ticket';

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, string | number>;
}

export interface WorkflowAction {
  type: ActionType;
  config: Record<string, string | number>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  createdAt: string;
  lastRun?: string;
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  message: string;
  timestamp: string;
}

const STORAGE_KEY = 'automation_workflows';

export const useWorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [logs, setLogs] = useState<WorkflowLog[]>([]);

  const saveToStorage = (data: Workflow[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addWorkflow = useCallback((name: string, description: string, triggers: WorkflowTrigger[], actions: WorkflowAction[]) => {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name,
      description,
      enabled: true,
      triggers,
      actions,
      createdAt: new Date().toISOString(),
    };
    const updated = [...workflows, newWorkflow];
    setWorkflows(updated);
    saveToStorage(updated);
    return newWorkflow;
  }, [workflows]);

  const deleteWorkflow = useCallback((id: string) => {
    const updated = workflows.filter((w) => w.id !== id);
    setWorkflows(updated);
    saveToStorage(updated);
  }, [workflows]);

  const toggleWorkflow = useCallback((id: string) => {
    const updated = workflows.map((w) => w.id === id ? { ...w, enabled: !w.enabled } : w);
    setWorkflows(updated);
    saveToStorage(updated);
  }, [workflows]);

  const simulateRun = useCallback((id: string) => {
    const log: WorkflowLog = {
      id: `log-${Date.now()}`,
      workflowId: id,
      status: Math.random() > 0.2 ? 'success' : 'failed',
      message: Math.random() > 0.2 ? '工作流执行成功' : '执行失败: 权限不足',
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [log, ...prev]);
    return log;
  }, []);

  return { workflows, logs, addWorkflow, deleteWorkflow, toggleWorkflow, simulateRun };
};

export default useWorkflowBuilder;
