import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { AdvancedCharts } from "./AdvancedCharts";

const emptyData = { byProvider: {}, perSource: [] };

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AdvancedCharts chartData={emptyData} isLoading={true} />
    </TestProvider>
  );
  root.unmount();
});

it("renders empty state when no data", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AdvancedCharts chartData={emptyData} isLoading={false} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with chart data", () => {
  const chartData = {
    byProvider: { aws_cnr: 500, gcp_cnr: 300 },
    perSource: [
      { name: "My AWS", type: "aws_cnr", cost: 500, forecast: 600, resources: 20, lastMonthCost: 450 },
      { name: "My GCP", type: "gcp_cnr", cost: 300, forecast: 350, resources: 10, lastMonthCost: 280 },
    ],
  };
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <AdvancedCharts chartData={chartData} isLoading={false} />
    </TestProvider>
  );
  root.unmount();
});
