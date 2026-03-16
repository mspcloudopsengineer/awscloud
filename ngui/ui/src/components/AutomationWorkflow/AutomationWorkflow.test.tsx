import { vi } from "vitest";
import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { AutomationWorkflow } from "./AutomationWorkflow";

const noop = vi.fn().mockResolvedValue(undefined);

const baseProps = {
  powerSchedules: [] as any[],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  isUpdating: false,
  onCreate: noop,
  onDelete: noop,
  onUpdate: noop,
  organizationId: "org-1",
};

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AutomationWorkflow {...baseProps} isLoading={true} />
    </TestProvider>
  );
  root.unmount();
});

it("renders empty state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AutomationWorkflow {...baseProps} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with schedules", () => {
  const schedules = [
    {
      id: "s1", name: "Dev Hours", power_on: "08:00", power_off: "20:00",
      timezone: "UTC", enabled: true, resources_count: 5, last_run: 0,
      last_run_error: null, triggers: [{ time: "08:00", action: "power_on" }, { time: "20:00", action: "power_off" }],
      created_at: 1700000000,
    },
  ];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AutomationWorkflow {...baseProps} powerSchedules={schedules} />
    </TestProvider>
  );
  root.unmount();
});
