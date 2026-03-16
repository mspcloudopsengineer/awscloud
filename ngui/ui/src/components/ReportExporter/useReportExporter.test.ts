import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReportExporter } from "./useReportExporter";

describe("useReportExporter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty state", () => {
    const { result } = renderHook(() => useReportExporter());
    expect(result.current.isExporting).toBe(false);
    expect(result.current.history).toEqual([]);
    expect(result.current.schedules).toEqual([]);
  });

  it("exports a report and adds to history", async () => {
    const { result } = renderHook(() => useReportExporter());
    let entry: any;
    await act(async () => {
      entry = await result.current.exportReport({
        format: "pdf",
        template: "cost-summary",
        title: "Test Report",
        dateRange: { start: "2026-01-01", end: "2026-01-31" },
        includeCharts: true,
        includeSummary: true,
      });
    });
    expect(entry.status).toBe("completed");
    expect(entry.format).toBe("pdf");
    expect(result.current.history).toHaveLength(1);
    expect(result.current.isExporting).toBe(false);
  });

  it("adds a schedule", () => {
    const { result } = renderHook(() => useReportExporter());
    act(() => {
      result.current.addSchedule(
        "Weekly Report",
        { format: "excel", template: "cost-summary", title: "", dateRange: { start: "", end: "" }, includeCharts: true, includeSummary: true },
        "weekly",
        ["[email]"]
      );
    });
    expect(result.current.schedules).toHaveLength(1);
    expect(result.current.schedules[0].name).toBe("Weekly Report");
    expect(result.current.schedules[0].enabled).toBe(true);
  });

  it("deletes a schedule", () => {
    const { result } = renderHook(() => useReportExporter());
    act(() => {
      result.current.addSchedule("To Delete", { format: "csv", template: "custom", title: "", dateRange: { start: "", end: "" }, includeCharts: false, includeSummary: false }, "daily", []);
    });
    const id = result.current.schedules[0].id;
    act(() => {
      result.current.deleteSchedule(id);
    });
    expect(result.current.schedules).toHaveLength(0);
  });

  it("toggles a schedule", () => {
    const { result } = renderHook(() => useReportExporter());
    act(() => {
      result.current.addSchedule("Toggle", { format: "pdf", template: "cost-summary", title: "", dateRange: { start: "", end: "" }, includeCharts: true, includeSummary: true }, "monthly", []);
    });
    const id = result.current.schedules[0].id;
    expect(result.current.schedules[0].enabled).toBe(true);
    act(() => {
      result.current.toggleSchedule(id);
    });
    expect(result.current.schedules[0].enabled).toBe(false);
  });
});
