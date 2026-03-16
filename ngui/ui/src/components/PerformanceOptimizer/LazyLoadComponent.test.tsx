import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { LazyLoadComponent } from "./LazyLoadComponent";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <LazyLoadComponent>
        <div>Lazy content</div>
      </LazyLoadComponent>
    </TestProvider>
  );
  root.unmount();
});

it("renders with custom height", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <LazyLoadComponent height={300}>
        <div>Content</div>
      </LazyLoadComponent>
    </TestProvider>
  );
  root.unmount();
});
