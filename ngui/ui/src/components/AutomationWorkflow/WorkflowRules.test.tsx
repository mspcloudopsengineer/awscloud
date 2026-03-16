import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { WorkflowRules } from "./WorkflowRules";

it("renders without crashing with empty workflows", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <WorkflowRules workflows={[]} onToggle={() => {}} onDelete={() => {}} onRun={() => {}} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with workflows", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <WorkflowRules
        workflows={[
          {
            id: "wf-1",
            name: "Test WF",
            description: "A test workflow",
            enabled: true,
            triggers: [{ type: "cost-threshold", config: {} }],
            actions: [{ type: "send-notification", config: {} }],
            createdAt: "2026-01-01",
          },
        ]}
        onToggle={() => {}}
        onDelete={() => {}}
        onRun={() => {}}
      />
    </TestProvider>
  );
  root.unmount();
});
