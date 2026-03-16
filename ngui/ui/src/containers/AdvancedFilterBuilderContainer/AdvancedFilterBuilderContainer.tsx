import React, { useMemo } from "react";
import { AdvancedFilterBuilder } from "components/AdvancedFilterBuilder";
import AvailableFiltersService from "services/AvailableFiltersService";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import { START_DATE_FILTER, END_DATE_FILTER } from "utils/constants";

export const AdvancedFilterBuilderContainer: React.FC = () => {
  const { organizationId } = useOrganizationInfo();

  // Get last 30 days range
  const params = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    return { [START_DATE_FILTER]: thirtyDaysAgo, [END_DATE_FILTER]: now };
  }, []);

  const { useGet } = AvailableFiltersService();
  const { isLoading, filters } = useGet(params);

  return <AdvancedFilterBuilder availableFilters={filters} isLoading={isLoading} />;
};

export default AdvancedFilterBuilderContainer;
