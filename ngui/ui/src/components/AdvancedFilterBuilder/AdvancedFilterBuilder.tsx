import React, { useState, useMemo } from "react";
import {
  Box, Card, CardContent, Typography, Grid, Button, FormControl, InputLabel, Select,
  MenuItem, TextField, ToggleButtonGroup, ToggleButton, Divider, CircularProgress, Chip,
} from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { FilterCondition } from "./FilterCondition";
import { FilterPreview } from "./FilterPreview";
import { SavedFilters } from "./SavedFilters";
import { useFilterBuilder } from "./useFilterBuilder";

const OPERATORS = [
  { label: "equals", value: "equals" },
  { label: "not equals", value: "notEquals" },
  { label: "contains", value: "contains" },
  { label: "greater than", value: "greaterThan" },
  { label: "less than", value: "lessThan" },
];

const operatorLabels = Object.fromEntries(OPERATORS.map((o) => [o.value, o.label]));

interface AvailableFilters {
  cloud_account?: Array<{ id: string; name: string }>;
  owner?: Array<{ id: string; name: string }>;
  region?: Array<{ name: string }>;
  service_name?: Array<{ name: string }>;
  resource_type?: Array<{ name: string; type?: string }>;
  pool?: Array<{ id: string; name: string }>;
  k8s_node?: Array<{ name: string }>;
  k8s_namespace?: Array<{ name: string }>;
  k8s_service?: Array<{ name: string }>;
  [key: string]: unknown;
}

interface AdvancedFilterBuilderProps {
  availableFilters: AvailableFilters;
  isLoading: boolean;
}

export const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({ availableFilters, isLoading }) => {
  const intl = useIntl();
  const { conditions, logic, setLogic, addCondition, removeCondition, clearAll, savedFilters, saveFilter, deleteFilter, applyFilter } = useFilterBuilder();
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");

  // Build available fields from real API filter data
  const availableFields = useMemo(() => {
    const fields: Array<{ label: string; value: string }> = [];
    if (availableFilters.cloud_account?.length) fields.push({ label: intl.formatMessage({ id: "dataSource", defaultMessage: "Data Source" }), value: "cloud_account" });
    if (availableFilters.owner?.length) fields.push({ label: intl.formatMessage({ id: "owner", defaultMessage: "Owner" }), value: "owner" });
    if (availableFilters.region?.length) fields.push({ label: intl.formatMessage({ id: "region", defaultMessage: "Region" }), value: "region" });
    if (availableFilters.service_name?.length) fields.push({ label: intl.formatMessage({ id: "service", defaultMessage: "Service" }), value: "service_name" });
    if (availableFilters.resource_type?.length) fields.push({ label: intl.formatMessage({ id: "resourceType", defaultMessage: "Resource Type" }), value: "resource_type" });
    if (availableFilters.pool?.length) fields.push({ label: intl.formatMessage({ id: "pool", defaultMessage: "Pool" }), value: "pool" });
    if (availableFilters.k8s_node?.length) fields.push({ label: "K8s Node", value: "k8s_node" });
    if (availableFilters.k8s_namespace?.length) fields.push({ label: "K8s Namespace", value: "k8s_namespace" });
    if (availableFilters.k8s_service?.length) fields.push({ label: "K8s Service", value: "k8s_service" });
    // Always allow these even if empty
    if (!fields.find((f) => f.value === "cloud_account")) fields.push({ label: intl.formatMessage({ id: "dataSource", defaultMessage: "Data Source" }), value: "cloud_account" });
    if (!fields.find((f) => f.value === "region")) fields.push({ label: intl.formatMessage({ id: "region", defaultMessage: "Region" }), value: "region" });
    if (!fields.find((f) => f.value === "service_name")) fields.push({ label: intl.formatMessage({ id: "service", defaultMessage: "Service" }), value: "service_name" });
    return fields;
  }, [availableFilters, intl]);

  const fieldLabels = useMemo(() => Object.fromEntries(availableFields.map((f) => [f.value, f.label])), [availableFields]);

  // Get value options for selected field
  const valueOptions = useMemo(() => {
    if (!field) return [];
    const filterData = availableFilters[field];
    if (!Array.isArray(filterData)) return [];
    return filterData.map((item: { name?: string; id?: string }) => item.name || item.id || String(item));
  }, [field, availableFilters]);

  const handleAdd = () => {
    addCondition(field, operator, value);
    setValue("");
  };

  if (isLoading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
          <FilterList sx={{ mr: 1 }} />
          <FormattedMessage id="advancedFilters.title" defaultMessage="Advanced Filters" />
        </Typography>

        {/* Filter count from API */}
        <Box sx={{ mb: 2 }}>
          {Object.entries(availableFilters).map(([key, values]) => (
            Array.isArray(values) && values.length > 0 ? (
              <Chip key={key} label={`${fieldLabels[key] || key}: ${values.length}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} variant="outlined" />
            ) : null
          ))}
        </Box>

        <Box sx={{ mb: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel><FormattedMessage id="field" defaultMessage="Field" /></InputLabel>
                <Select value={field} label="Field" onChange={(e) => { setField(e.target.value); setValue(""); }}>
                  {availableFields.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel><FormattedMessage id="operator" defaultMessage="Operator" /></InputLabel>
                <Select value={operator} label="Operator" onChange={(e) => setOperator(e.target.value)}>
                  {OPERATORS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              {valueOptions.length > 0 ? (
                <FormControl fullWidth size="small">
                  <InputLabel><FormattedMessage id="value" defaultMessage="Value" /></InputLabel>
                  <Select value={value} label="Value" onChange={(e) => setValue(e.target.value)}>
                    {valueOptions.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <TextField fullWidth size="small" label={intl.formatMessage({ id: "value", defaultMessage: "Value" })} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
              )}
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAdd} fullWidth disabled={!field || !value}>
                <FormattedMessage id="add" defaultMessage="Add" />
              </Button>
            </Grid>
          </Grid>
        </Box>

        {conditions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="subtitle2">
                <FormattedMessage id="advancedFilters.conditions" defaultMessage="Conditions" /> ({conditions.length})
              </Typography>
              <ToggleButtonGroup size="small" value={logic} exclusive onChange={(_, v) => v && setLogic(v)}>
                <ToggleButton value="AND">AND</ToggleButton>
                <ToggleButton value="OR">OR</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {conditions.map((c) => (
              <FilterCondition key={c.id} condition={c} fieldLabel={fieldLabels[c.field] || c.field} operatorLabel={operatorLabels[c.operator] || c.operator} onRemove={removeCondition} />
            ))}
            <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={clearAll} sx={{ mt: 1 }}>
              <FormattedMessage id="clearAll" defaultMessage="Clear All" />
            </Button>
          </Box>
        )}

        <FilterPreview conditions={conditions} logic={logic} fieldLabels={fieldLabels} operatorLabels={operatorLabels} />
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button variant="contained" color="primary" disabled={conditions.length === 0}>
            <FormattedMessage id="advancedFilters.apply" defaultMessage="Apply Filters" />
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <SavedFilters filters={savedFilters} onApply={applyFilter} onDelete={deleteFilter} onSave={saveFilter} />
      </CardContent>
    </Card>
  );
};

export default AdvancedFilterBuilder;
