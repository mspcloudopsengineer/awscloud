import React from 'react';
import { ReportExporterContainer } from 'containers/ReportExporterContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

const ReportExportPage: React.FC = () => (
  <PageContentWrapper>
    <PageTitle dataTestId="lbl_report_export">导出和报告</PageTitle>
    <ReportExporterContainer />
  </PageContentWrapper>
);

export default ReportExportPage;
