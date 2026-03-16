import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

interface PredictedCostData {
  date: string;
  actualCost: number;
  predictedCost: number;
  lowerBound: number;
  upperBound: number;
}

interface CostPredictionProps {
  predictionData?: PredictedCostData[];
  isLoading?: boolean;
  currency?: string;
}

export const CostPrediction: React.FC<CostPredictionProps> = ({
  predictionData = [],
  isLoading = false,
  currency = "USD",
}) => {
  const intl = useIntl();

  const formatCost = (value: number) =>
    intl.formatNumber(value, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const futurePredictions = useMemo(
    () => predictionData.filter((d) => d.actualCost === 0),
    [predictionData]
  );

  const historicalData = useMemo(
    () => predictionData.filter((d) => d.actualCost > 0),
    [predictionData]
  );

  const totalPredictedCost = useMemo(
    () => futurePredictions.reduce((sum, item) => sum + item.predictedCost, 0),
    [futurePredictions]
  );

  const trend = useMemo(() => {
    if (predictionData.length < 2) return 0;
    const last = predictionData[predictionData.length - 1]?.predictedCost ?? 0;
    const first = historicalData[0]?.predictedCost ?? 0;
    return first > 0 ? ((last - first) / first) * 100 : 0;
  }, [predictionData, historicalData]);

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
                <FormattedMessage id="costPrediction.totalPredicted" defaultMessage="Predicted Cost (7d)" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {formatCost(totalPredictedCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="costPrediction.confidenceInterval" defaultMessage="Confidence Interval" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                ±15%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="costPrediction.trend" defaultMessage="Cost Trend" />
              </Typography>
              <Chip
                label={`${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`}
                color={trend > 0 ? "error" : "success"}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage id="costPrediction.daysAhead" defaultMessage="Prediction Days" />
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
                {futurePredictions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Prediction Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FormattedMessage id="costPrediction.title" defaultMessage="Cost Prediction" />
          </Typography>
          {predictionData.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              <FormattedMessage
                id="costPrediction.noData"
                defaultMessage="No prediction data available. Select a data source and time range to generate predictions."
              />
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormattedMessage id="costPrediction.date" defaultMessage="Date" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="costPrediction.actual" defaultMessage="Actual Cost" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="costPrediction.predicted" defaultMessage="Predicted Cost" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="costPrediction.lowerBound" defaultMessage="Lower Bound" />
                    </TableCell>
                    <TableCell align="right">
                      <FormattedMessage id="costPrediction.upperBound" defaultMessage="Upper Bound" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictionData.map((row) => (
                    <TableRow key={row.date} hover>
                      <TableCell>{row.date}</TableCell>
                      <TableCell align="right">
                        {row.actualCost > 0 ? formatCost(row.actualCost) : "—"}
                      </TableCell>
                      <TableCell align="right">{formatCost(row.predictedCost)}</TableCell>
                      <TableCell align="right">{formatCost(row.lowerBound)}</TableCell>
                      <TableCell align="right">{formatCost(row.upperBound)}</TableCell>
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

export default CostPrediction;
