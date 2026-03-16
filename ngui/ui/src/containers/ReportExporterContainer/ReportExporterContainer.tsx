import React from "react";
import { ReportExporter } from "components/ReportExporter";
import BIExportService from "services/BIExportService";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";

export const ReportExporterContainer: React.FC = () => {
  const { useGetAll, useCreate, useDelete } = BIExportService();
  const { isLoading, organizationBIExports } = useGetAll();
  const { onCreate, isLoading: isCreating } = useCreate();
  const { onDelete, isLoading: isDeleting } = useDelete();
  const { organizationId, currency } = useOrganizationInfo();

  return (
    <ReportExporter
      biExports={organizationBIExports}
      isLoading={isLoading}
      isCreating={isCreating}
      isDeleting={isDeleting}
      onCreate={onCreate}
      onDelete={onDelete}
      organizationId={organizationId}
      currency={currency}
    />
  );
};

export default ReportExporterContainer;
