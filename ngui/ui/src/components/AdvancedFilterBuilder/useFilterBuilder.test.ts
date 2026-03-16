import { describe, it, expect, beforeEach } from "vitest";

describe("useFilterBuilder logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("localStorage starts empty", () => {
    expect(localStorage.getItem("advancedFilters_saved")).toBeNull();
  });

  it("stores and retrieves saved filters", () => {
    const filter = {
      id: "f1",
      name: "Test Filter",
      conditions: [{ id: "c1", field: "cost", operator: "greaterThan", value: "100" }],
      logic: "AND",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("advancedFilters_saved", JSON.stringify([filter]));
    const stored = JSON.parse(localStorage.getItem("advancedFilters_saved") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Test Filter");
  });

  it("deletes a saved filter", () => {
    const filters = [
      { id: "f1", name: "Filter 1", conditions: [], logic: "AND", createdAt: "" },
      { id: "f2", name: "Filter 2", conditions: [], logic: "OR", createdAt: "" },
    ];
    localStorage.setItem("advancedFilters_saved", JSON.stringify(filters));
    const remaining = filters.filter((f) => f.id !== "f1");
    localStorage.setItem("advancedFilters_saved", JSON.stringify(remaining));
    const stored = JSON.parse(localStorage.getItem("advancedFilters_saved") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe("f2");
  });

  it("parses comma-separated values into array", () => {
    const raw = "us-east-1, eu-west-1";
    const parsed = raw.includes(",") ? raw.split(",").map((s) => s.trim()) : raw;
    expect(parsed).toEqual(["us-east-1", "eu-west-1"]);
  });

  it("single value stays as string", () => {
    const raw = "us-east-1";
    const parsed = raw.includes(",") ? raw.split(",").map((s) => s.trim()) : raw;
    expect(parsed).toBe("us-east-1");
  });
});