import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { WorkflowLogs } from "./WorkflowLogs";

it("renders without crashing with empty logs", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <WorkflowLogs logs={[]} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with log entries", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <WorkflowLogs
        logs={[
          { id: "log-1", workflowId: "wf-1", status: "success", message: "OK", timestamp: "2026-01-01T00:00:00Z" },
          { id: "log-2", workflowId: "wf-1", status: "failed", message: "Error", timestamp: "2026-01-01T01:00:00Z" },
        ]}
      />
    </TestProvider>
  );
  root.unmount();
});
