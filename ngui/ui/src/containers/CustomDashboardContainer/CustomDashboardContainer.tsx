import React from "react";
import { DashboardBuilder } from "components/CustomDashboard";
import { useAllDataSources } from "hooks/coreData/useAllDataSources";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import ExpensesService from "services/ExpensesService";

export const CustomDashboardContainer: React.FC = () => {
  const dataSources = useAllDataSources();
  const { currency, currencySymbol, organizationId } = useOrganizationInfo();
  const { useGetOrganizationExpenses } = ExpensesService();
  const { isLoading, data: expensesData } = useGetOrganizationExpenses();

  return (
    <DashboardBuilder
      dataSources={dataSources}
      expensesData={expensesData}
      currency={currency}
      currencySymbol={currencySymbol}
      isLoading={isLoading}
    />
  );
};

export default CustomDashboardContainer;
