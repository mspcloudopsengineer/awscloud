import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { SavedFilters } from "./SavedFilters";

it("renders without crashing with empty filters", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <SavedFilters filters={[]} onApply={() => {}} onDelete={() => {}} onSave={() => {}} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with saved filters", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <SavedFilters
        filters={[
          {
            id: "f1",
            name: "Test Filter",
            conditions: [{ field: "cost", operator: "greaterThan", value: "100" }],
            logic: "AND",
            createdAt: "2026-01-01",
          },
        ]}
        onApply={() => {}}
        onDelete={() => {}}
        onSave={() => {}}
      />
    </TestProvider>
  );
  root.unmount();
});
