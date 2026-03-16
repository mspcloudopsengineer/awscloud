import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { CostPrediction } from "./CostPrediction";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <CostPrediction />
    </TestProvider>
  );
  root.unmount();
});

it("renders with prediction data", () => {
  const data = [
    { date: "2026-03-10", actualCost: 100, predictedCost: 100, lowerBound: 85, upperBound: 115 },
    { date: "2026-03-11", actualCost: 110, predictedCost: 110, lowerBound: 93, upperBound: 127 },
    { date: "2026-03-12", actualCost: 0, predictedCost: 120, lowerBound: 102, upperBound: 138 },
  ];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <CostPrediction predictionData={data} />
    </TestProvider>
  );
  root.unmount();
});

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <CostPrediction isLoading />
    </TestProvider>
  );
  root.unmount();
});
