import React from 'react';
import { LanguageSelectorContainer } from 'containers/LanguageSelectorContainer';
import PageContentWrapper from 'components/PageContentWrapper';
import PageTitle from 'components/PageTitle';

export const LanguageSettingsPage: React.FC = () => {
  return (
    <PageContentWrapper>
      <PageTitle dataTestId="lbl_language_settings">
        语言设置
      </PageTitle>
      <LanguageSelectorContainer />
    </PageContentWrapper>
  );
};

export default LanguageSettingsPage;
