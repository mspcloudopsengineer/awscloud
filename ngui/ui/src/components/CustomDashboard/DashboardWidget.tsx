import React from 'react';
import { Box, Card, CardContent, Typography, CardHeader, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

// Widget 类型
export interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  onEdit?: () => void;
  size?: 'small' | 'medium' | 'large';
}

// Widget 大小配置
export const widgetSizes = {
  small: { cols: 2, rows: 2 },
  medium: { cols: 4, rows: 2 },
  large: { cols: 4, rows: 4 },
};

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  onRemove,
  onEdit,
  size = 'medium',
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={<Typography variant="subtitle1">{title}</Typography>}
        action={
          <Box>
            {onEdit && (
              <IconButton size="small" onClick={onEdit} title="编辑">
                {/* Edit icon placeholder */}
                <span style={{ fontSize: '16px' }}>✎</span>
              </IconButton>
            )}
            {onRemove && (
              <IconButton size="small" onClick={onRemove} title="移除">
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
