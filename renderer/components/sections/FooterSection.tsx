import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import { buttonBase } from "../../utils/constants";

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
        className={`flex items-center justify-center py-3 ${style.actionBg}`}
      >
        <button
          type="button"
          className={`${buttonBase} mr-2 border-[#6db33f] bg-[#6db33f] text-white`}
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate"}
        </button>
        <button
          type="button"
          className={`${buttonBase} mr-2 ${style.outlineButton}`}
          onClick={onExplore}
          disabled={exploring}
        >
          {exploring ? "Exploring..." : "Explore"}
        </button>
        <button
          type="button"
          className={`${buttonBase} ${style.outlineButton}`}
        >
          ...
        </button>
      </div>
    </div>
  );
}
