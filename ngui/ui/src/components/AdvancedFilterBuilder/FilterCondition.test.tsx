import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { FilterCondition } from "./FilterCondition";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <FilterCondition
        condition={{ id: "1", field: "cost", operator: "greaterThan", value: "100" }}
        fieldLabel="成本"
        operatorLabel="大于"
        onRemove={() => {}}
      />
    </TestProvider>
  );
  root.unmount();
});

it("renders with array value", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <FilterCondition
        condition={{ id: "2", field: "region", operator: "contains", value: ["us-east-1", "eu-west-1"] }}
        fieldLabel="区域"
        operatorLabel="包含"
        onRemove={() => {}}
      />
    </TestProvider>
  );
  root.unmount();
});
