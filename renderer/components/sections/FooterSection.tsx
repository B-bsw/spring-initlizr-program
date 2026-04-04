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
        className={`flex items-center justify-center gap-5 py-3 ${style.actionBg}`}
      >
        <Button
          onClick={onGenerate}
          isDisabled={generating}
          className="rounded-sm bg-zinc-500 dark:bg-zinc-700 dark:text-white"
        >
          {generating ? "Generating..." : "Generate"}
        </Button>
        <Button
          onClick={onExplore}
          isDisabled={exploring}
          className="rounded-sm border border-zinc-500 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-transparent dark:text-white"
        >
          {exploring ? "Exploring..." : "Explore"}
        </Button>
      </div>
    </div>
  );
}
