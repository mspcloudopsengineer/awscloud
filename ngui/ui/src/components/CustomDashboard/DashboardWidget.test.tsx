import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { DashboardWidget } from "./DashboardWidget";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardWidget title="Test Widget">
        <div>Content</div>
      </DashboardWidget>
    </TestProvider>
  );
  root.unmount();
});

it("renders with remove and edit callbacks", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardWidget title="Editable" onRemove={() => {}} onEdit={() => {}} size="large">
        <div>Content</div>
      </DashboardWidget>
    </TestProvider>
  );
  root.unmount();
});
