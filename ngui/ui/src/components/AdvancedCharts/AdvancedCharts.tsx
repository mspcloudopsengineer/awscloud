import React, { useMemo } from "react";
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

interface SourceData {
  name: string;
  type: string;
  cost: number;
  forecast: number;
  resources: number;
  lastMonthCost: number;
}

interface ChartData {
  byProvider: Record<string, number>;
  perSource: SourceData[];
}

interface AdvancedChartsProps {
  chartData: ChartData;
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

const COLORS = ["#4AB4EE", "#FFC348", "#FF6B6B", "#51CF66", "#845EF7", "#FF922B", "#20C997", "#E64980"];

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ chartData, currency = "USD", isLoading }) => {
  const intl = useIntl();

  const formatCost = (value: number) =>
    intl.formatNumber(value, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const providerEntries = useMemo(() => {
    return Object.entries(chartData.byProvider)
      .map(([type, cost]) => ({ type, label: cloudTypeLabels[type] || type, cost }))
      .sort((a, b) => b.cost - a.cost);
  }, [chartData.byProvider]);

  const totalCost = useMemo(() => providerEntries.reduce((s, e) => s + e.cost, 0), [providerEntries]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (chartData.perSource.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            <FormattedMessage
              id="advancedCharts.noData"
              defaultMessage="No data sources connected. Connect a cloud account to see cost analytics."
            />
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Cost Distribution by Provider */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="advancedCharts.costByProvider" defaultMessage="Cost by Cloud Provider" />
          </Typography>
          <Grid container spacing={2}>
            {/* Bar visualization */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {providerEntries.map((entry, idx) => {
                  const pct = totalCost > 0 ? (entry.cost / totalCost) * 100 : 0;
                  return (
                    <Box key={entry.type}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2">{entry.label}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCost(entry.cost)} ({pct.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ width: "100%", bgcolor: "grey.200", borderRadius: 1, height: 20 }}>
                        <Box
                          sx={{
                            width: `${pct}%`,
                            bgcolor: COLORS[idx % COLORS.length],
                            borderRadius: 1,
                            height: "100%",
                            minWidth: pct > 0 ? 4 : 0,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
            {/* Summary */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="advancedCharts.totalCost" defaultMessage="Total Cost" />
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatCost(totalCost)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <FormattedMessage id="advancedCharts.providers" defaultMessage="Providers" />
                </Typography>
                <Typography variant="h6">{providerEntries.length}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  <FormattedMessage id="advancedCharts.dataSources" defaultMessage="Data Sources" />
                </Typography>
                <Typography variant="h6">{chartData.perSource.length}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Per-Source Detail Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="advancedCharts.sourceDetail" defaultMessage="Data Source Details" />
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><FormattedMessage id="name" defaultMessage="Name" /></TableCell>
                  <TableCell><FormattedMessage id="type" defaultMessage="Type" /></TableCell>
                  <TableCell align="right"><FormattedMessage id="cost" defaultMessage="Cost" /></TableCell>
                  <TableCell align="right"><FormattedMessage id="forecast" defaultMessage="Forecast" /></TableCell>
                  <TableCell align="right"><FormattedMessage id="lastMonth" defaultMessage="Last Month" /></TableCell>
                  <TableCell align="right"><FormattedMessage id="change" defaultMessage="Change" /></TableCell>
                  <TableCell align="right"><FormattedMessage id="resources" defaultMessage="Resources" /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chartData.perSource.map((src) => {
                  const change = src.lastMonthCost > 0 ? ((src.cost - src.lastMonthCost) / src.lastMonthCost) * 100 : 0;
                  return (
                    <TableRow key={src.name} hover>
                      <TableCell>{src.name}</TableCell>
                      <TableCell>
                        <Chip label={cloudTypeLabels[src.type] || src.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{formatCost(src.cost)}</TableCell>
                      <TableCell align="right">{formatCost(src.forecast)}</TableCell>
                      <TableCell align="right">{formatCost(src.lastMonthCost)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
                          color={change > 5 ? "error" : change < -5 ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">{src.resources}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvancedCharts;
