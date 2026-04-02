import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import { buttonBase } from "../../utils/constants";

export default function FooterSection({
  theme,
  className,
  generating = false,
  onGenerate,
}: {
  theme: Theme;
  className: string;
  generating?: boolean;
  onGenerate: () => void;
}) {
  const style = new ThemeStyle(theme);
  return (
    <div className={`${className}`}>
      <div
        className={`py-3 flex items-center justify-center ${style.actionBg}`}
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
        >
          Explore
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
