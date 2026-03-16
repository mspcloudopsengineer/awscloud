import React, { useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography } from '@mui/material';
import { DashboardWidget, widgetSizes } from './DashboardWidget';

// Widget 类型定义
export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  settings?: Record<string, unknown>;
}

// 可用的 Widget 列表
const availableWidgets = [
  { id: 'cost-trend', title: '成本趋势', type: 'cost-trend', size: 'large' },
  { id: 'cloud-cost', title: '云成本分布', type: 'cloud-cost', size: 'medium' },
  { id: 'resource-count', title: '资源数量', type: 'resource-count', size: 'small' },
  { id: 'recommendations', title: '优化建议', type: 'recommendations', size: 'medium' },
  { id: 'budget', title: '预算使用', type: 'budget', size: 'small' },
  { id: 'anomalies', title: '异常检测', type: 'anomalies', size: 'medium' },
];

// 自定义仪表板构建器
export const DashboardBuilder: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);

  // 添加 Widget
  const handleAddWidget = useCallback((widget: WidgetConfig) => {
    setWidgets(prev => [...prev, { ...widget, id: `${widget.id}-${Date.now()}` }]);
  }, []);

  // 移除 Widget
  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  // 编辑 Widget
  const handleEditWidget = useCallback((widget: WidgetConfig) => {
    setSelectedWidget(widget);
    setOpen(true);
  }, []);

  // 保存 Widget 设置
  const handleSaveSettings = useCallback(() => {
    if (selectedWidget) {
      setWidgets(prev => 
        prev.map(w => w.id === selectedWidget.id ? selectedWidget : w)
      );
    }
    setOpen(false);
    setSelectedWidget(null);
  }, [selectedWidget]);

  return (
    <Box>
      {/* Widget 选择器 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          可用组件
        </Typography>
        <Grid container spacing={1}>
          {availableWidgets.map(widget => (
            <Grid item key={widget.id}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAddWidget(widget)}
              >
                {widget.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 仪表板网格 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          仪表板
        </Typography>
        <Grid container spacing={2}>
          {widgets.map(widget => (
            <Grid 
              item 
              key={widget.id} 
              xs={12} 
              sm={widgetSizes[widget.size].cols}
              md={widgetSizes[widget.size].cols}
            >
              <DashboardWidget
                title={widget.title}
                size={widget.size}
                onRemove={() => handleRemoveWidget(widget.id)}
                onEdit={() => handleEditWidget(widget)}
              >
                {/* Widget 内容占位符 */}
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  {widget.title} 内容
                </Box>
              </DashboardWidget>
            </Grid>
          ))}
          {widgets.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', border: '1px dashed #ccc' }}>
                拖拽或选择组件添加到仪表板
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* 保存按钮 */}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary">
          保存仪表板
        </Button>
      </Box>

      {/* Widget 设置对话框 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>编辑 {selectedWidget?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {selectedWidget?.title} 设置
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardBuilder;
