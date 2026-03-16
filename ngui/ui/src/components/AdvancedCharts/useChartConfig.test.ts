import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChartConfig, COLOR_SCHEMES } from "./useChartConfig";

describe("useChartConfig", () => {
  it("returns default config", () => {
    const { result } = renderHook(() => useChartConfig());
    expect(result.current.config.type).toBe("sankey");
    expect(result.current.config.showLegend).toBe(true);
    expect(result.current.config.showTooltip).toBe(true);
    expect(result.current.config.animate).toBe(true);
    expect(result.current.config.colorScheme).toBe("default");
  });

  it("updates config partially", () => {
    const { result } = renderHook(() => useChartConfig());
    act(() => {
      result.current.updateConfig({ type: "heatmap" });
    });
    expect(result.current.config.type).toBe("heatmap");
    expect(result.current.config.showLegend).toBe(true); // unchanged
  });

  it("resets config to defaults", () => {
    const { result } = renderHook(() => useChartConfig());
    act(() => {
      result.current.updateConfig({ type: "timeseries", showLegend: false });
    });
    act(() => {
      result.current.resetConfig();
    });
    expect(result.current.config.type).toBe("sankey");
    expect(result.current.config.showLegend).toBe(true);
  });

  it("provides color schemes", () => {
    const { result } = renderHook(() => useChartConfig());
    expect(result.current.colorSchemes).toEqual(COLOR_SCHEMES);
    expect(result.current.colorSchemes.length).toBe(4);
  });
});
