import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilterBuilder } from "./useFilterBuilder";

describe("useFilterBuilder", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty conditions", () => {
    const { result } = renderHook(() => useFilterBuilder());
    expect(result.current.conditions).toEqual([]);
    expect(result.current.logic).toBe("AND");
  });

  it("adds a condition", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cloudAccount", "equals", "AWS");
    });
    expect(result.current.conditions).toHaveLength(1);
    expect(result.current.conditions[0].field).toBe("cloudAccount");
    expect(result.current.conditions[0].operator).toBe("equals");
    expect(result.current.conditions[0].value).toBe("AWS");
  });

  it("parses comma-separated values into array", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("region", "contains", "us-east-1, eu-west-1");
    });
    expect(result.current.conditions[0].value).toEqual(["us-east-1", "eu-west-1"]);
  });

  it("ignores empty field or value", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("", "equals", "test");
    });
    expect(result.current.conditions).toHaveLength(0);
    act(() => {
      result.current.addCondition("field", "equals", "");
    });
    expect(result.current.conditions).toHaveLength(0);
  });

  it("removes a condition by id", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cost", "greaterThan", "100");
      result.current.addCondition("region", "equals", "us-east-1");
    });
    expect(result.current.conditions).toHaveLength(2);
    const idToRemove = result.current.conditions[0].id;
    act(() => {
      result.current.removeCondition(idToRemove);
    });
    expect(result.current.conditions).toHaveLength(1);
    expect(result.current.conditions[0].field).toBe("region");
  });

  it("clears all conditions", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cost", "greaterThan", "100");
      result.current.addCondition("region", "equals", "us-east-1");
    });
    act(() => {
      result.current.clearAll();
    });
    expect(result.current.conditions).toEqual([]);
  });

  it("toggles logic between AND and OR", () => {
    const { result } = renderHook(() => useFilterBuilder());
    expect(result.current.logic).toBe("AND");
    act(() => {
      result.current.setLogic("OR");
    });
    expect(result.current.logic).toBe("OR");
  });

  it("saves and loads filters from localStorage", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cost", "greaterThan", "100");
      result.current.saveFilter("My Filter");
    });
    expect(result.current.savedFilters).toHaveLength(1);
    expect(result.current.savedFilters[0].name).toBe("My Filter");
    expect(JSON.parse(localStorage.getItem("advancedFilters_saved") || "[]")).toHaveLength(1);
  });

  it("deletes a saved filter", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cost", "greaterThan", "100");
      result.current.saveFilter("Filter 1");
    });
    const filterId = result.current.savedFilters[0].id;
    act(() => {
      result.current.deleteFilter(filterId);
    });
    expect(result.current.savedFilters).toHaveLength(0);
  });

  it("applies a saved filter", () => {
    const { result } = renderHook(() => useFilterBuilder());
    act(() => {
      result.current.addCondition("cost", "greaterThan", "100");
      result.current.setLogic("OR");
      result.current.saveFilter("Test");
    });
    act(() => {
      result.current.clearAll();
    });
    expect(result.current.conditions).toHaveLength(0);
    act(() => {
      result.current.applyFilter(result.current.savedFilters[0]);
    });
    expect(result.current.conditions).toHaveLength(1);
    expect(result.current.logic).toBe("OR");
  });
});
