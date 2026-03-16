import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { VirtualizedList } from "./VirtualizedList";

const mockItems = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <VirtualizedList
        items={mockItems}
        itemHeight={40}
        containerHeight={200}
        renderItem={(item) => <div>{item.name}</div>}
      />
    </TestProvider>
  );
  root.unmount();
});

it("renders with empty items", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <VirtualizedList items={[]} itemHeight={40} containerHeight={200} renderItem={(item) => <div>{item}</div>} />
    </TestProvider>
  );
  root.unmount();
});
