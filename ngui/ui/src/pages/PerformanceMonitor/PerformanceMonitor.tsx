import React from 'react';
import { PerformanceOptimizerContainer } from 'containers/PerformanceOptimizerContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

export const PerformanceMonitorPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle dataTestId="lbl_performance_monitor">
        性能监控
      </PageTitle>
      <PerformanceOptimizerContainer />
    </PageContentWrapper>
  );
};

export default PerformanceMonitorPage;
