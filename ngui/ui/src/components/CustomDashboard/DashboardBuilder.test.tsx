import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { DashboardBuilder } from "./DashboardBuilder";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardBuilder />
    </TestProvider>
  );
  root.unmount();
});
