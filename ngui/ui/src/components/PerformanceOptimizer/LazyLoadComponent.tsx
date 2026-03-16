import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyLoadComponentProps {
  children: React.ReactNode;
  height?: number | string;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}

export const LazyLoadComponent: React.FC<LazyLoadComponentProps> = ({
  children, height = 200, placeholder, rootMargin = '100px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Box ref={ref} sx={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible ? children : (placeholder || <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 1 }} />)}
    </Box>
  );
};

export default LazyLoadComponent;
