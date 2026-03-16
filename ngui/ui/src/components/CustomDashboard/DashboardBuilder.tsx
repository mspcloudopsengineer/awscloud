import React, { useState, useCallback, useMemo } from "react";
import { Box, Button, Grid, Typography, Card, CardContent, CircularProgress, Chip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { DashboardWidget } from "./DashboardWidget";

interface DataSourceDetail {
  cost?: number;
  forecast?: number;
  last_month_cost?: number;
  resources?: number;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  details?: DataSourceDetail;
}

interface DashboardBuilderProps {
  dataSources: DataSource[];
  expensesData: Record<string, unknown>;
  currency?: string;
  currencySymbol?: string;
  isLoading: boolean;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large";
}

const cloudTypeLabels: Record<string, string> = {
  aws_cnr: "AWS", azure_cnr: "Azure", azure_tenant: "Azure", gcp_cnr: "GCP",
  gcp_tenant: "GCP", alibaba_cnr: "Alibaba", nebius: "Nebius", databricks: "Databricks", kubernetes_cnr: "K8s",
};

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
  dataSources, expensesData, currency = "USD", currencySymbol = "$", isLoading,
}) => {
  const intl = useIntl();
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "total-cost", type: "total-cost", title: intl.formatMessage({ id: "dashboard.totalCost", defaultMessage: "Total Cost" }), size: "small" },
    { id: "forecast", type: "forecast", title: intl.formatMessage({ id: "dashboard.forecast", defaultMessage: "Forecast" }), size: "small" },
    { id: "resources", type: "resources", title: intl.formatMessage({ id: "dashboard.resources", defaultMessage: "Resources" }), size: "small" },
    { id: "data-sources", type: "data-sources", title: intl.formatMessage({ id: "dashboard.dataSources", defaultMessage: "Data Sources" }), size: "large" },
  ]);

  const totalCost = useMemo(() => dataSources.reduce((s, ds) => s + (ds.details?.cost ?? 0), 0), [dataSources]);
  const totalForecast = useMemo(() => dataSources.reduce((s, ds) => s + (ds.details?.forecast ?? 0), 0), [dataSources]);
  const totalResources = useMemo(() => dataSources.reduce((s, ds) => s + (ds.details?.resources ?? 0), 0), [dataSources]);

  const formatCost = (v: number) => intl.formatNumber(v, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const availableWidgets: WidgetConfig[] = [
    { id: "total-cost", type: "total-cost", title: intl.formatMessage({ id: "dashboard.totalCost", defaultMessage: "Total Cost" }), size: "small" },
    { id: "forecast", type: "forecast", title: intl.formatMessage({ id: "dashboard.forecast", defaultMessage: "Forecast" }), size: "small" },
    { id: "resources", type: "resources", title: intl.formatMessage({ id: "dashboard.resources", defaultMessage: "Resources" }), size: "small" },
    { id: "data-sources", type: "data-sources", title: intl.formatMessage({ id: "dashboard.dataSources", defaultMessage: "Data Sources" }), size: "large" },
    { id: "cost-by-provider", type: "cost-by-provider", title: intl.formatMessage({ id: "dashboard.costByProvider", defaultMessage: "Cost by Provider" }), size: "medium" },
  ];

  const handleAddWidget = useCallback((w: WidgetConfig) => {
    setWidgets((prev) => [...prev, { ...w, id: `${w.id}-${Date.now()}` }]);
  }, []);

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const renderWidgetContent = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "total-cost":
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" fontWeight="bold">{formatCost(totalCost)}</Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="dashboard.currentMonth" defaultMessage="Current Month" />
            </Typography>
          </Box>
        );
      case "forecast":
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" fontWeight="bold">{formatCost(totalForecast)}</Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="dashboard.monthEndForecast" defaultMessage="Month-End Forecast" />
            </Typography>
          </Box>
        );
      case "resources":
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" fontWeight="bold">{totalResources}</Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="dashboard.totalResources" defaultMessage="Total Resources" />
            </Typography>
          </Box>
        );
      case "data-sources":
        return (
          <Box>
            {dataSources.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                <FormattedMessage id="dashboard.noDataSources" defaultMessage="No data sources connected" />
              </Typography>
            ) : (
              dataSources.map((ds) => (
                <Box key={ds.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box>
                    <Typography variant="body2">{ds.name}</Typography>
                    <Chip label={cloudTypeLabels[ds.type] || ds.type} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">{formatCost(ds.details?.cost ?? 0)}</Typography>
                </Box>
              ))
            )}
          </Box>
        );
      case "cost-by-provider": {
        const byProvider: Record<string, number> = {};
        dataSources.forEach((ds) => { byProvider[ds.type] = (byProvider[ds.type] || 0) + (ds.details?.cost ?? 0); });
        return (
          <Box>
            {Object.entries(byProvider).sort(([, a], [, b]) => b - a).map(([type, cost]) => (
              <Box key={type} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                <Typography variant="body2">{cloudTypeLabels[type] || type}</Typography>
                <Typography variant="body2" fontWeight="bold">{formatCost(cost)}</Typography>
              </Box>
            ))}
          </Box>
        );
      }
      default:
        return <Typography color="text.secondary">{widget.title}</Typography>;
    }
  };

  if (isLoading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          <FormattedMessage id="dashboard.addWidgets" defaultMessage="Add Widgets" />
        </Typography>
        <Grid container spacing={1}>
          {availableWidgets.map((w) => (
            <Grid item key={w.id}>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => handleAddWidget(w)}>{w.title}</Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {widgets.map((widget) => (
          <Grid item key={widget.id} xs={12} sm={widget.size === "small" ? 4 : widget.size === "medium" ? 6 : 12}>
            <DashboardWidget title={widget.title} size={widget.size} onRemove={() => handleRemoveWidget(widget.id)}>
              {renderWidgetContent(widget)}
            </DashboardWidget>
          </Grid>
        ))}
        {widgets.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", border: "1px dashed", borderColor: "divider", borderRadius: 1 }}>
              <FormattedMessage id="dashboard.empty" defaultMessage="Add widgets to build your dashboard" />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardBuilder;
