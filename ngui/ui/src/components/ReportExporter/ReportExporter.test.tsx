import { vi } from "vitest";
import { createRoot } from "react-dom/client";
import TestProvider from "tests/TestProvider";
import { ReportExporter } from "./ReportExporter";

const noop = vi.fn().mockResolvedValue(undefined);

const baseProps = {
  biExports: [] as any[],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  onCreate: noop,
  onDelete: noop,
  organizationId: "org-1",
};

it("renders loading state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ReportExporter {...baseProps} isLoading={true} />
    </TestProvider>
  );
  root.unmount();
});

it("renders empty state", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ReportExporter {...baseProps} />
    </TestProvider>
  );
  root.unmount();
});

it("renders with exports", () => {
  const biExports = [
    { id: "e1", name: "Daily Export", days: 180, meta: { bucket: "my-bucket" }, last_run: 1700000000, last_status_error: null },
  ];
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(
    <TestProvider>
      <ReportExporter {...baseProps} biExports={biExports} />
    </TestProvider>
  );
  root.unmount();
});
