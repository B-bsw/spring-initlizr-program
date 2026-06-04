import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import { Button } from "@heroui/react";

export default function FooterSection({
  theme,
  className,
  generating = false,
  exploring = false,
  onGenerate,
  onExplore,
}: {
  theme: Theme;
  className: string;
  generating?: boolean;
  exploring?: boolean;
  onGenerate: () => void;
  onExplore: () => void;
}) {
  const style = new ThemeStyle(theme);
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center justify-center gap-3 py-2 ${style.actionBg} border-t border-neutral-200 dark:border-neutral-800`}
      >
        <Button
          onClick={onGenerate}
          isDisabled={generating}
          className="rounded-sm bg-lime-600 hover:bg-lime-700 text-white font-medium transition-colors border-none min-w-[100px] h-7 min-h-0 text-xs px-3"
        >
          {generating ? "Generating..." : "Generate"}
        </Button>
        <Button
          onClick={onExplore}
          isDisabled={exploring}
          className="rounded-sm border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium min-w-[100px] h-7 min-h-0 text-xs px-3"
        >
          {exploring ? "Exploring..." : "Explore"}
        </Button>
      </div>
    </div>
  );
}
