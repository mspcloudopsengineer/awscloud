import React from 'react';
import { AutomationWorkflowContainer } from 'containers/AutomationWorkflowContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

export const AutomationWorkflowPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle dataTestId="lbl_automation_workflow">
        工作流自动化
      </PageTitle>
      <AutomationWorkflowContainer />
    </PageContentWrapper>
  );
};

export default AutomationWorkflowPage;
