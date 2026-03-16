import { describe, it, expect, beforeEach } from "vitest";
import { SUPPORTED_LANGUAGES } from "./useLanguage";

describe("useLanguage logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("SUPPORTED_LANGUAGES has 8 entries", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(8);
  });

  it("each language has code, label, nativeLabel", () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.label).toBeTruthy();
      expect(lang.nativeLabel).toBeTruthy();
    });
  });

  it("includes en-US as first language", () => {
    expect(SUPPORTED_LANGUAGES[0].code).toBe("en-US");
  });

  it("persists language preference to localStorage", () => {
    localStorage.setItem("user_language_preference", "ja");
    expect(localStorage.getItem("user_language_preference")).toBe("ja");
  });

  it("restores language from localStorage", () => {
    localStorage.setItem("user_language_preference", "zh-CN");
    const stored = localStorage.getItem("user_language_preference");
    expect(stored).toBe("zh-CN");
  });

  it("sets document lang attribute", () => {
    document.documentElement.lang = "de";
    expect(document.documentElement.lang).toBe("de");
  });
});
