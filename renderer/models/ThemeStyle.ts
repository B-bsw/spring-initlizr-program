import type { Theme } from "../types/types";

export class ThemeStyle {
  constructor(private readonly theme: Theme) {}

  get isDark() {
    return this.theme === "dark";
  }

  get bg() {
    return "bg-white dark:bg-neutral-900/50";
  }

  get text() {
    return "text-neutral-900 dark:text-neutral-100";
  }

  get border() {
    return "border-neutral-200 dark:border-neutral-800";
  }

  get actionBg() {
    return "bg-neutral-50 dark:bg-neutral-900";
  }

  get outlineButton() {
    return "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200";
  }

  get inputTone() {
    return "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100";
  }
}
