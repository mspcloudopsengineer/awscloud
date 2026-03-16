import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { ScheduledReports } from "./ScheduledReports";

it("renders without crashing with empty schedules", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ScheduledReports schedules={[]} onToggle={() => {}} onDelete={() => {}} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with schedules", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ScheduledReports
        schedules={[
          {
            id: "s1",
            name: "Weekly",
            config: {
              format: "pdf",
              template: "cost-summary",
              title: "",
              dateRange: { start: "", end: "" },
              includeCharts: true,
              includeSummary: true,
            },
            schedule: "weekly",
            recipients: ["[email]"],
            enabled: true,
          },
        ]}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    </TestProvider>
  );
  root.unmount();
});
