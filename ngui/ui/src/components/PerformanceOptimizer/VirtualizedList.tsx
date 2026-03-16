import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items, itemHeight, containerHeight, renderItem, overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan);
  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        显示 {startIndex + 1}-{endIndex} / {items.length} 项
      </Typography>
      <Box ref={containerRef} onScroll={handleScroll}
        sx={{ height: containerHeight, overflow: 'auto', position: 'relative', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Box sx={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item, i) => (
            <Box key={startIndex + i} sx={{ position: 'absolute', top: (startIndex + i) * itemHeight, height: itemHeight, width: '100%' }}>
              {renderItem(item, startIndex + i)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VirtualizedList;
