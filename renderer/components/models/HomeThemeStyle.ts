import type { Theme } from "../types";

export class HomeThemeStyle {
  constructor(private readonly theme: Theme) {}

  get isDark() {
    return this.theme === "dark";
  }

  get bg() {
    return this.isDark ? "bg-[#1b1f23]" : "bg-white";
  }

  get text() {
    return this.isDark ? "text-white" : "text-[#111111]";
  }

  get border() {
    return this.isDark ? "border-[#4a5053]" : "border-[#dce8e8]";
  }

  get actionBg() {
    return this.isDark ? "bg-[#262a2d]" : "bg-[#ecf2f2]";
  }

  get outlineButton() {
    return this.isDark ? "border-white text-white" : "border-[#111111] text-[#111111]";
  }

  get inputTone() {
    return this.isDark
      ? "border-[#4a5053] bg-[#262a2d] text-white"
      : "border-[#dce8e8] bg-white text-[#111111]";
  }
}
