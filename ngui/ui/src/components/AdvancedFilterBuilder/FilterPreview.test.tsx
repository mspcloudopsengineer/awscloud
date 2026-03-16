import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { FilterPreview } from "./FilterPreview";

it("renders without crashing with conditions", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <FilterPreview
        conditions={[{ field: "cost", operator: "greaterThan", value: "100" }]}
        logic="AND"
        fieldLabels={{ cost: "成本" }}
        operatorLabels={{ greaterThan: "大于" }}
      />
    </TestProvider>
  );
  root.unmount();
});

it("renders nothing with empty conditions", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <FilterPreview conditions={[]} logic="AND" fieldLabels={{}} operatorLabels={{}} />
    </TestProvider>
  );
  root.unmount();
});
