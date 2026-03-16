import React from 'react';
import { RealtimeCostMonitorContainer } from 'containers/RealtimeCostMonitorContainer';
import { PageContentWrapper } from 'components/PageContentWrapper';
import { PageTitle } from 'components/PageTitle';

export const RealtimeCostMonitorPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle>
        实时成本监控
      </PageTitle>
      <RealtimeCostMonitorContainer />
    </PageContentWrapper>
  );
};

export default RealtimeCostMonitorPage;
