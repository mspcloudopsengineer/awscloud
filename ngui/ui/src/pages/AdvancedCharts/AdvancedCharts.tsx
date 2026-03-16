import React from 'react';
import { AdvancedChartsContainer } from 'containers/AdvancedChartsContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

export const AdvancedChartsPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle dataTestId="lbl_advanced_charts">
        数据可视化
      </PageTitle>
      <AdvancedChartsContainer />
    </PageContentWrapper>
  );
};

export default AdvancedChartsPage;
