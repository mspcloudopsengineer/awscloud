import React from "react";
import { AutomationWorkflow } from "components/AutomationWorkflow";
import PowerScheduleService from "services/PowerScheduleService";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";

export const AutomationWorkflowContainer: React.FC = () => {
  const { useGetAll, useCreate, useDelete, useUpdate } = PowerScheduleService();
  const { isLoading, powerSchedules } = useGetAll();
  const { onCreate, isLoading: isCreating } = useCreate();
  const { onDelete, isLoading: isDeleting } = useDelete();
  const { onUpdate, isLoading: isUpdating } = useUpdate();
  const { organizationId } = useOrganizationInfo();

  return (
    <AutomationWorkflow
      powerSchedules={powerSchedules}
      isLoading={isLoading}
      isCreating={isCreating}
      isDeleting={isDeleting}
      isUpdating={isUpdating}
      onCreate={onCreate}
      onDelete={onDelete}
      onUpdate={onUpdate}
      organizationId={organizationId}
    />
  );
};

export default AutomationWorkflowContainer;
