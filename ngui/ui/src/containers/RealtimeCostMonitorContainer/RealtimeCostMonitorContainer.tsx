import React from "react";
import { RealtimeCostMonitor } from "components/RealtimeCostMonitor";
import ExpensesService from "services/ExpensesService";
import { useAllDataSources } from "hooks/coreData/useAllDataSources";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";

export const RealtimeCostMonitorContainer: React.FC = () => {
  const { useGetOrganizationExpenses } = ExpensesService();
  const { isLoading: isExpensesLoading, data: expensesData } = useGetOrganizationExpenses();
  const dataSources = useAllDataSources();
  const { currency, currencySymbol } = useOrganizationInfo();

  return (
    <RealtimeCostMonitor
      expensesData={expensesData}
      dataSources={dataSources}
      currency={currency}
      currencySymbol={currencySymbol}
      isLoading={isExpensesLoading}
    />
  );
};

export default RealtimeCostMonitorContainer;
