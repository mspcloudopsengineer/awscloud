import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWorkflowBuilder } from "./useWorkflowBuilder";

describe("useWorkflowBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty workflows and logs", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    expect(result.current.workflows).toEqual([]);
    expect(result.current.logs).toEqual([]);
  });

  it("adds a workflow", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    act(() => {
      result.current.addWorkflow(
        "Test Workflow",
        "A test",
        [{ type: "cost-threshold", config: { threshold: 100 } }],
        [{ type: "send-notification", config: {} }]
      );
    });
    expect(result.current.workflows).toHaveLength(1);
    expect(result.current.workflows[0].name).toBe("Test Workflow");
    expect(result.current.workflows[0].enabled).toBe(true);
    expect(result.current.workflows[0].triggers).toHaveLength(1);
    expect(result.current.workflows[0].actions).toHaveLength(1);
  });

  it("persists workflows to localStorage", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    act(() => {
      result.current.addWorkflow("Persisted", "desc", [], []);
    });
    const stored = JSON.parse(localStorage.getItem("automation_workflows") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Persisted");
  });

  it("deletes a workflow", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    act(() => {
      result.current.addWorkflow("WF1", "", [], []);
    });
    const id = result.current.workflows[0].id;
    act(() => {
      result.current.deleteWorkflow(id);
    });
    expect(result.current.workflows).toHaveLength(0);
  });

  it("toggles workflow enabled state", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    act(() => {
      result.current.addWorkflow("Toggle Test", "", [], []);
    });
    const id = result.current.workflows[0].id;
    expect(result.current.workflows[0].enabled).toBe(true);
    act(() => {
      result.current.toggleWorkflow(id);
    });
    expect(result.current.workflows[0].enabled).toBe(false);
    act(() => {
      result.current.toggleWorkflow(id);
    });
    expect(result.current.workflows[0].enabled).toBe(true);
  });

  it("simulates a run and creates a log entry", () => {
    const { result } = renderHook(() => useWorkflowBuilder());
    act(() => {
      result.current.addWorkflow("Run Test", "", [], []);
    });
    const id = result.current.workflows[0].id;
    act(() => {
      result.current.simulateRun(id);
    });
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].workflowId).toBe(id);
    expect(["success", "failed"]).toContain(result.current.logs[0].status);
  });
});
