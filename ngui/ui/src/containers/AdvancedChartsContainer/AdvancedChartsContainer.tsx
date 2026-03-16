import React, { useMemo } from "react";
import { AdvancedCharts } from "components/AdvancedCharts";
import { useAllDataSources } from "hooks/coreData/useAllDataSources";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import ExpensesService from "services/ExpensesService";

export const AdvancedChartsContainer: React.FC = () => {
  const dataSources = useAllDataSources();
  const { currency, currencySymbol } = useOrganizationInfo();
  const { useGetOrganizationExpenses } = ExpensesService();
  const { isLoading, data: expensesData } = useGetOrganizationExpenses();

  const chartData = useMemo(() => {
    // Build cost-by-cloud-provider data from real data sources
    const byProvider: Record<string, number> = {};
    dataSources.forEach((ds) => {
      const type = ds.type || "unknown";
      byProvider[type] = (byProvider[type] || 0) + (ds.details?.cost ?? 0);
    });

    // Build cost-by-datasource for sankey/heatmap
    const perSource = dataSources.map((ds) => ({
      name: ds.name,
      type: ds.type,
      cost: ds.details?.cost ?? 0,
      forecast: ds.details?.forecast ?? 0,
      resources: ds.details?.resources ?? 0,
      lastMonthCost: ds.details?.last_month_cost ?? 0,
    }));

    return { byProvider, perSource };
  }, [dataSources]);

  return (
    <AdvancedCharts
      chartData={chartData}
      currency={currency}
      currencySymbol={currencySymbol}
      isLoading={isLoading}
    />
  );
};

export default AdvancedChartsContainer;
