import React from "react";
import { UserGuide } from "components/UserGuide";
import { useAllDataSources } from "hooks/coreData/useAllDataSources";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";

export const UserGuideContainer: React.FC = () => {
  const dataSources = useAllDataSources();
  const { organizationId, name: orgName } = useOrganizationInfo();

  return (
    <UserGuide
      dataSourceCount={dataSources.length}
      organizationId={organizationId}
      organizationName={orgName}
    />
  );
};

export default UserGuideContainer;
