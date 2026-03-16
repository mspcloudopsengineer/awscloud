import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { HeatmapChart } from "./HeatmapChart";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <HeatmapChart />
    </TestProvider>
  );
  root.unmount();
});

it("renders with custom title", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <HeatmapChart title="Custom Heatmap" />
    </TestProvider>
  );
  root.unmount();
});
