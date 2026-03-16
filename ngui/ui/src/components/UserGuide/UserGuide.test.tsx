import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { UserGuide } from "./UserGuide";

it("renders with default FAQ and guide steps", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <UserGuide />
    </TestProvider>
  );
  root.unmount();
});

it("renders with custom FAQ items", () => {
  const faq = [{ question: "Custom Q?", answer: "Custom A", category: "Custom" }];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <UserGuide faqItems={faq} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with custom guide steps", () => {
  const steps = [{ title: "Step 1", description: "Do something" }];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <UserGuide guideSteps={steps} />
    </TestProvider>
  );
  root.unmount();
});
