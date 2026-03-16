import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { RealtimeCostMonitor } from "./RealtimeCostMonitor";

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <RealtimeCostMonitor expensesData={{}} dataSources={[]} isLoading={true} />
    </TestProvider>
  );
  root.unmount();
});

it("renders empty state when no data sources", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <RealtimeCostMonitor expensesData={{}} dataSources={[]} isLoading={false} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with data sources", () => {
  const dataSources = [
    { id: "1", name: "My AWS", type: "aws_cnr", details: { cost: 1234.56, forecast: 2000, last_month_cost: 1100, resources: 42 } },
  ];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <RealtimeCostMonitor expensesData={{ total: 1234.56 }} dataSources={dataSources} isLoading={false} />
    </TestProvider>
  );
  root.unmount();
});
