import { useState, useCallback } from 'react';

export type ExportFormat = 'pdf' | 'excel' | 'csv';
export type ReportTemplate = 'cost-summary' | 'resource-inventory' | 'optimization' | 'custom';

export interface ReportConfig {
  format: ExportFormat;
  template: ReportTemplate;
  title: string;
  dateRange: { start: string; end: string };
  includeCharts: boolean;
  includeSummary: boolean;
}

export interface ScheduledReport {
  id: string;
  name: string;
  config: ReportConfig;
  schedule: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  enabled: boolean;
  lastSent?: string;
}

export interface ReportHistory {
  id: string;
  name: string;
  format: ExportFormat;
  createdAt: string;
  size: string;
  status: 'completed' | 'failed' | 'generating';
}

const STORAGE_KEY = 'report_schedules';

export const useReportExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [schedules, setSchedules] = useState<ScheduledReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [history, setHistory] = useState<ReportHistory[]>([]);

  const exportReport = useCallback(async (config: ReportConfig) => {
    setIsExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const entry: ReportHistory = {
      id: `report-${Date.now()}`,
      name: config.title || `${config.template}-${config.format}`,
      format: config.format,
      createdAt: new Date().toISOString(),
      size: `${Math.round(Math.random() * 500 + 100)} KB`,
      status: 'completed',
    };
    setHistory((prev) => [entry, ...prev]);
    setIsExporting(false);
    return entry;
  }, []);

  const addSchedule = useCallback((name: string, config: ReportConfig, schedule: 'daily' | 'weekly' | 'monthly', recipients: string[]) => {
    const newSchedule: ScheduledReport = { id: `sched-${Date.now()}`, name, config, schedule, recipients, enabled: true };
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [schedules]);

  const deleteSchedule = useCallback((id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [schedules]);

  const toggleSchedule = useCallback((id: string) => {
    const updated = schedules.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setSchedules(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [schedules]);

  return { isExporting, history, schedules, exportReport, addSchedule, deleteSchedule, toggleSchedule };
};

export default useReportExporter;
