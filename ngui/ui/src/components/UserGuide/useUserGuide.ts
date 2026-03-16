import { useState, useCallback } from 'react';

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector
  completed: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const STORAGE_KEY = 'user_guide_progress';

const DEFAULT_STEPS: GuideStep[] = [
  { id: 'welcome', title: '欢迎使用', description: '了解云管理平台的基本功能和导航', completed: false },
  { id: 'datasource', title: '连接云账户', description: '添加您的第一个云服务提供商账户', completed: false },
  { id: 'dashboard', title: '查看仪表板', description: '了解成本概览和关键指标', completed: false },
  { id: 'resources', title: '管理资源', description: '浏览和管理您的云资源', completed: false },
  { id: 'recommendations', title: '优化建议', description: '查看成本优化建议并采取行动', completed: false },
  { id: 'alerts', title: '设置告警', description: '配置成本告警和预算限制', completed: false },
];

const DEFAULT_FAQS: FAQ[] = [
  { id: '1', question: '如何添加新的云账户？', answer: '进入"数据源"页面，点击"连接云账户"按钮，选择云服务提供商并填写凭证信息。', category: '入门' },
  { id: '2', question: '成本数据多久更新一次？', answer: '成本数据通常每天更新一次，具体取决于云服务提供商的数据可用性。', category: '数据' },
  { id: '3', question: '如何设置成本预算？', answer: '进入"预算和配额"页面，创建新的组织约束来设置预算限制。', category: '预算' },
  { id: '4', question: '如何导出报告？', answer: '在各个数据页面中，使用导出功能可以将数据导出为 CSV 或 PDF 格式。', category: '报告' },
  { id: '5', question: '支持哪些云服务提供商？', answer: '目前支持 AWS、Azure、GCP、阿里云等主流云服务提供商。', category: '入门' },
];

export const useUserGuide = () => {
  const [steps, setSteps] = useState<GuideStep[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STEPS;
    } catch { return DEFAULT_STEPS; }
  });
  const [faqs] = useState<FAQ[]>(DEFAULT_FAQS);
  const [currentStep, setCurrentStep] = useState(0);

  const completeStep = useCallback((id: string) => {
    setSteps((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, completed: true } : s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const reset = DEFAULT_STEPS.map((s) => ({ ...s, completed: false }));
    setSteps(reset);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
  }, []);

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return { steps, faqs, currentStep, setCurrentStep, completeStep, resetProgress, progress, completedCount };
};

export default useUserGuide;
