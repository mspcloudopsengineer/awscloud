import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUserGuide } from "./useUserGuide";

describe("useUserGuide", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default steps and faqs", () => {
    const { result } = renderHook(() => useUserGuide());
    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.faqs.length).toBeGreaterThan(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.completedCount).toBe(0);
  });

  it("completes a step and updates progress", () => {
    const { result } = renderHook(() => useUserGuide());
    const totalSteps = result.current.steps.length;
    act(() => {
      result.current.completeStep("welcome");
    });
    expect(result.current.steps.find((s) => s.id === "welcome")?.completed).toBe(true);
    expect(result.current.completedCount).toBe(1);
    expect(result.current.progress).toBe(Math.round((1 / totalSteps) * 100));
  });

  it("persists progress to localStorage", () => {
    const { result } = renderHook(() => useUserGuide());
    act(() => {
      result.current.completeStep("welcome");
    });
    const stored = JSON.parse(localStorage.getItem("user_guide_progress") || "[]");
    expect(stored.find((s: any) => s.id === "welcome")?.completed).toBe(true);
  });

  it("resets progress", () => {
    const { result } = renderHook(() => useUserGuide());
    act(() => {
      result.current.completeStep("welcome");
      result.current.completeStep("datasource");
    });
    expect(result.current.completedCount).toBe(2);
    act(() => {
      result.current.resetProgress();
    });
    expect(result.current.completedCount).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.currentStep).toBe(0);
  });

  it("changes current step", () => {
    const { result } = renderHook(() => useUserGuide());
    act(() => {
      result.current.setCurrentStep(3);
    });
    expect(result.current.currentStep).toBe(3);
  });
});
