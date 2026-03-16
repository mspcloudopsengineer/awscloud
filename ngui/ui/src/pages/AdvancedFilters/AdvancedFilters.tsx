import React from 'react';
import { AdvancedFilterBuilderContainer } from 'containers/AdvancedFilterBuilderContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

export const AdvancedFiltersPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle dataTestId="lbl_advanced_filters">
        高级筛选
      </PageTitle>
      <AdvancedFilterBuilderContainer />
    </PageContentWrapper>
  );
};

export default AdvancedFiltersPage;
