import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { DashboardBuilder } from "./DashboardBuilder";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardBuilder
        dataSources={[]}
        expensesData={{}}
        currency="USD"
        currencySymbol="$"
        isLoading={false}
      />
    </TestProvider>
  );
  root.unmount();
});

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardBuilder
        dataSources={[]}
        expensesData={{}}
        isLoading={true}
      />
    </TestProvider>
  );
  root.unmount();
});

it("renders with data sources", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <DashboardBuilder
        dataSources={[
          { id: "ds1", name: "AWS Account", type: "aws_cnr", details: { cost: 1500, forecast: 2000, resources: 42 } },
        ]}
        expensesData={{}}
        currency="USD"
        currencySymbol="$"
        isLoading={false}
      />
    </TestProvider>
  );
  root.unmount();
});
