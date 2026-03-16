import React, { useState, useEffect, useMemo } from "react";
import { Box, Card, CardContent, Typography, Grid, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

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
  last_import_at?: number;
  details?: DataSourceDetail;
}

interface ExpensesData {
  total?: number;
  previous_total?: number;
  id?: string;
  [key: string]: unknown;
}

interface RealtimeCostMonitorProps {
  expensesData: ExpensesData;
  dataSources: DataSource[];
  currency?: string;
  currencySymbol?: string;
  isLoading: boolean;
}

const cloudTypeLabels: Record<string, string> = {
  aws_cnr: "AWS",
  azure_cnr: "Azure",
  azure_tenant: "Azure",
  gcp_cnr: "GCP",
  gcp_tenant: "GCP",
  alibaba_cnr: "Alibaba",
  nebius: "Nebius",
  databricks: "Databricks",
  kubernetes_cnr: "K8s",
};

export const RealtimeCostMonitor: React.FC<RealtimeCostMonitorProps> = ({
  expensesData,
  dataSources,
  currency = "USD",
  currencySymbol = "$",
  isLoading,
}) => {
  const intl = useIntl();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (!isLoading) {
      setLastRefresh(new Date());
    }
  }, [isLoading, expensesData]);

  const totalCurrentCost = useMemo(() => {
    return dataSources.reduce((sum, ds) => sum + (ds.details?.cost ?? 0), 0);
  }, [dataSources]);

  const totalForecast = useMemo(() => {
    return dataSources.reduce((sum, ds) => sum + (ds.details?.forecast ?? 0), 0);
  }, [dataSources]);

  const totalLastMonth = useMemo(() => {
    return dataSources.reduce((sum, ds) => sum + (ds.details?.last_month_cost ?? 0), 0);
  }, [dataSources]);

  const totalResources = useMemo(() => {
    return dataSources.reduce((sum, ds) => sum + (ds.details?.resources ?? 0), 0);
  }, [dataSources]);

  const costChange = totalLastMonth > 0 ? ((totalCurrentCost - totalLastMonth) / totalLastMonth) * 100 : 0;

  const formatCost = (value: number) =>
    intl.formatNumber(value, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="realtimeCostMonitor.currentMonthCost" defaultMessage="Current Month Cost" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {formatCost(totalCurrentCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="realtimeCostMonitor.forecast" defaultMessage="Forecast" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {formatCost(totalForecast)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="realtimeCostMonitor.lastMonth" defaultMessage="Last Month" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {formatCost(totalLastMonth)}
              </Typography>
              <Chip
                label={`${costChange >= 0 ? "+" : ""}${costChange.toFixed(1)}%`}
                color={costChange > 0 ? "error" : "success"}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="realtimeCostMonitor.totalResources" defaultMessage="Total Resources" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                <FormattedNumber value={totalResources} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Sources Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              <FormattedMessage id="realtimeCostMonitor.dataSources" defaultMessage="Cloud Data Sources" />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="realtimeCostMonitor.lastRefresh" defaultMessage="Last refresh" />:{" "}
              {lastRefresh.toLocaleTimeString()}
            </Typography>
          </Box>
          {dataSources.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              <FormattedMessage
                id="realtimeCostMonitor.noDataSources"
                defaultMessage="No cloud data sources connected. Add a data source to see real-time cost data."
              />
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="name" defaultMessage="Name" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="type" defaultMessage="Type" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="cost" defaultMessage="Cost" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="forecast" defaultMessage="Forecast" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="resources" defaultMessage="Resources" />
                    </TableCell>
                    <TableCell>
                      <FormattedMessage id="lastImport" defaultMessage="Last Import" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSources.map((ds) => (
                    <TableRow key={ds.id} hover>
                      <TableCell>{ds.name}</TableCell>
                      <TableCell>
                        <Chip label={cloudTypeLabels[ds.type] || ds.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{formatCost(ds.details?.cost ?? 0)}</TableCell>
                      <TableCell align="right">{formatCost(ds.details?.forecast ?? 0)}</TableCell>
                      <TableCell align="right">{ds.details?.resources ?? 0}</TableCell>
                      <TableCell>
                        {ds.last_import_at
                          ? new Date(ds.last_import_at * 1000).toLocaleString()
                          : intl.formatMessage({ id: "never", defaultMessage: "Never" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RealtimeCostMonitor;
