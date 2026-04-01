import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import { buttonBase } from "../../utils/constants";

export default function FooterSection({
  theme,
  className,
}: {
  theme: Theme;
  className: string;
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
        >
          Generate
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
