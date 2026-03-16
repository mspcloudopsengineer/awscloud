import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

interface BIExport {
  id: string;
  name?: string;
  last_run?: number;
  last_status_error?: string;
  next_run?: number;
  days?: number;
  meta?: { bucket?: string; s3_prefix?: string; access_key_id?: string };
}

interface Props {
  biExports: BIExport[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  onCreate: (p: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  organizationId: string;
  currency?: string;
}

export const ReportExporter: React.FC<Props> = ({ biExports, isLoading, isCreating, isDeleting, onCreate, onDelete }) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState("180");
  const [bucket, setBucket] = useState("");
  const [prefix, setPrefix] = useState("");
  const [keyId, setKeyId] = useState("");
  const [secret, setSecret] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !bucket.trim()) return;
    try {
      await onCreate({ name, days: parseInt(days, 10), meta: { bucket, s3_prefix: prefix, access_key_id: keyId, secret_access_key: secret } });
      setOpen(false); setName(""); setDays("180"); setBucket(""); setPrefix(""); setKeyId(""); setSecret("");
    } catch { /* service handles */ }
  };

  if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6"><FormattedMessage id="reportExporter.biExports" defaultMessage="BI Exports" /></Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} disabled={isCreating}>
              <FormattedMessage id="reportExporter.create" defaultMessage="Create Export" />
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <FormattedMessage id="reportExporter.description" defaultMessage="Configure automated data exports to S3 for BI tools." />
          </Typography>
          {biExports.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              <FormattedMessage id="reportExporter.noExports" defaultMessage="No BI exports configured yet." />
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedMessage id="name" defaultMessage="Name" /></TableCell>
                    <TableCell>S3 Bucket</TableCell>
                    <TableCell><FormattedMessage id="reportExporter.days" defaultMessage="Days" /></TableCell>
                    <TableCell><FormattedMessage id="reportExporter.lastRun" defaultMessage="Last Run" /></TableCell>
                    <TableCell><FormattedMessage id="status" defaultMessage="Status" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="actions" defaultMessage="Actions" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {biExports.map((exp) => (
                    <TableRow key={exp.id} hover>
                      <TableCell>{exp.name || exp.id}</TableCell>
                      <TableCell>{exp.meta?.bucket || "-"}</TableCell>
                      <TableCell>{exp.days || "-"}</TableCell>
                      <TableCell>{exp.last_run ? new Date(exp.last_run * 1000).toLocaleString() : intl.formatMessage({ id: "never", defaultMessage: "Never" })}</TableCell>
                      <TableCell>{exp.last_status_error ? <Chip label="Error" color="error" size="small" /> : <Chip label="OK" color="success" size="small" />}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => onDelete(exp.id)} disabled={isDeleting}><Delete fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle><FormattedMessage id="reportExporter.createExport" defaultMessage="Create BI Export" /></DialogTitle>
        <DialogContent>
          <TextField label={intl.formatMessage({ id: "name", defaultMessage: "Name" })} value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ mt: 1, mb: 2 }} />
          <TextField label="S3 Bucket" value={bucket} onChange={(e) => setBucket(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="S3 Prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Access Key ID" value={keyId} onChange={(e) => setKeyId(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Secret Access Key" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label={intl.formatMessage({ id: "reportExporter.days", defaultMessage: "Days" })} type="number" value={days} onChange={(e) => setDays(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}><FormattedMessage id="cancel" defaultMessage="Cancel" /></Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating || !name.trim() || !bucket.trim()}>
            {isCreating ? <CircularProgress size={20} /> : <FormattedMessage id="create" defaultMessage="Create" />}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportExporter;
