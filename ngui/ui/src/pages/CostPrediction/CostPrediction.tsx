import React from 'react';
import { CostPredictionContainer } from 'containers/CostPredictionContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import { PageTitle } from 'components/PageTitle';

export const CostPredictionPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle>
        成本预测
      </PageTitle>
      <CostPredictionContainer />
    </PageContentWrapper>
  );
};

export default CostPredictionPage;
