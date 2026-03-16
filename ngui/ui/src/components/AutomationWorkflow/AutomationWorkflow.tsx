import React, { useState } from "react";
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, CircularProgress, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

interface PowerScheduleTrigger {
  time: string;
  action: string;
}

interface PowerSchedule {
  id: string;
  name: string;
  power_on: string;
  power_off: string;
  timezone: string;
  enabled: boolean;
  resources_count: number;
  last_run: number;
  last_run_error: string | null;
  triggers: PowerScheduleTrigger[];
  created_at: number;
}

interface AutomationWorkflowProps {
  powerSchedules: PowerSchedule[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onCreate: (params: { name: string; triggers: PowerScheduleTrigger[]; timezone: string; enabled?: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, params: Partial<{ name: string; enabled: boolean }>) => Promise<void>;
  organizationId: string;
}

export const AutomationWorkflow: React.FC<AutomationWorkflowProps> = ({
  powerSchedules,
  isLoading,
  isCreating,
  isDeleting,
  isUpdating,
  onCreate,
  onDelete,
  onUpdate,
}) => {
  const intl = useIntl();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [powerOn, setPowerOn] = useState("08:00");
  const [powerOff, setPowerOff] = useState("20:00");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const triggers = [
      { time: powerOn, action: "power_on" },
      { time: powerOff, action: "power_off" },
    ];
    try {
      await onCreate({ name: newName, triggers, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, enabled: true });
      setDialogOpen(false);
      setNewName("");
      setPowerOn("08:00");
      setPowerOff("20:00");
    } catch {
      // error handled by service layer
    }
  };

  const handleToggle = async (schedule: PowerSchedule) => {
    try {
      await onUpdate(schedule.id, { enabled: !schedule.enabled });
    } catch {
      // error handled by service layer
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch {
      // error handled by service layer
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              <FormattedMessage id="automationWorkflow.powerSchedules" defaultMessage="Power Schedules" />
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)} disabled={isCreating}>
              <FormattedMessage id="automationWorkflow.create" defaultMessage="Create Schedule" />
            </Button>
          </Box>

          {powerSchedules.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              <FormattedMessage
                id="automationWorkflow.noSchedules"
                defaultMessage="No power schedules configured. Create one to automate instance start/stop."
              />
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedMessage id="name" defaultMessage="Name" /></TableCell>
                    <TableCell><FormattedMessage id="automationWorkflow.triggers" defaultMessage="Triggers" /></TableCell>
                    <TableCell><FormattedMessage id="automationWorkflow.timezone" defaultMessage="Timezone" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="automationWorkflow.resources" defaultMessage="Resources" /></TableCell>
                    <TableCell><FormattedMessage id="automationWorkflow.lastRun" defaultMessage="Last Run" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="status" defaultMessage="Status" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="actions" defaultMessage="Actions" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {powerSchedules.map((schedule) => (
                    <TableRow key={schedule.id} hover>
                      <TableCell>{schedule.name}</TableCell>
                      <TableCell>
                        {schedule.triggers?.map((t, i) => (
                          <Chip
                            key={i}
                            label={`${t.action === "power_on" ? "⬆ ON" : "⬇ OFF"} ${t.time}`}
                            size="small"
                            color={t.action === "power_on" ? "success" : "warning"}
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{schedule.timezone}</TableCell>
                      <TableCell align="center">{schedule.resources_count}</TableCell>
                      <TableCell>
                        {schedule.last_run
                          ? new Date(schedule.last_run * 1000).toLocaleString()
                          : intl.formatMessage({ id: "never", defaultMessage: "Never" })}
                        {schedule.last_run_error && (
                          <Chip label="Error" color="error" size="small" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={schedule.enabled}
                          onChange={() => handleToggle(schedule)}
                          disabled={isUpdating}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => handleDelete(schedule.id)} disabled={isDeleting}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <FormattedMessage id="automationWorkflow.createSchedule" defaultMessage="Create Power Schedule" />
        </DialogTitle>
        <DialogContent>
          <TextField
            label={intl.formatMessage({ id: "name", defaultMessage: "Name" })}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label={intl.formatMessage({ id: "automationWorkflow.powerOnTime", defaultMessage: "Power On Time" })}
            type="time"
            value={powerOn}
            onChange={(e) => setPowerOn(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label={intl.formatMessage({ id: "automationWorkflow.powerOffTime", defaultMessage: "Power Off Time" })}
            type="time"
            value={powerOff}
            onChange={(e) => setPowerOff(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating || !newName.trim()}>
            {isCreating ? <CircularProgress size={20} /> : <FormattedMessage id="create" defaultMessage="Create" />}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutomationWorkflow;
