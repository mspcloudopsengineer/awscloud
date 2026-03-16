import React from 'react';
import { CustomDashboardContainer } from 'containers/CustomDashboardContainer';
import { PageContentWrapper } from 'components/PageContentWrapper';
import { PageTitle } from 'components/PageTitle';

export const CustomDashboardPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle>
        自定义仪表板
      </PageTitle>
      <CustomDashboardContainer />
    </PageContentWrapper>
  );
};

export default CustomDashboardPage;
