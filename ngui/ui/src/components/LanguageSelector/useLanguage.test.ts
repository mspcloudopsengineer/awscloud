import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLanguage, SUPPORTED_LANGUAGES } from "./useLanguage";

describe("useLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns supported languages list", () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.languages).toEqual(SUPPORTED_LANGUAGES);
    expect(result.current.languages.length).toBe(8);
  });

  it("defaults to browser language or en", () => {
    const { result } = renderHook(() => useLanguage());
    expect(typeof result.current.currentLanguage).toBe("string");
    expect(SUPPORTED_LANGUAGES.some((l) => l.code === result.current.currentLanguage)).toBe(true);
  });

  it("changes language and persists to localStorage", () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.changeLanguage("ja");
    });
    expect(result.current.currentLanguage).toBe("ja");
    expect(localStorage.getItem("user_language_preference")).toBe("ja");
  });

  it("restores language from localStorage", () => {
    localStorage.setItem("user_language_preference", "zh-CN");
    const { result } = renderHook(() => useLanguage());
    expect(result.current.currentLanguage).toBe("zh-CN");
  });

  it("sets document lang attribute", () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.changeLanguage("de");
    });
    expect(document.documentElement.lang).toBe("de");
  });
});
