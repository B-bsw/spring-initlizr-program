import type { Theme } from "../types";
import { HomeThemeStyle } from "../models/HomeThemeStyle";
import { buttonBase } from "../constants";

export default function HomeFooterSection({ theme }: { theme: Theme }) {
  const style = new HomeThemeStyle(theme);
  return (
    <div className="sticky bottom-0 mt-[0.8rem]">
      <div className={`py-[0.7rem] ${style.actionBg}`}>
        <button type="button" className={`${buttonBase} mr-2 border-[#6db33f] bg-[#6db33f] text-white`}>
          Generate
        </button>
        <button type="button" className={`${buttonBase} mr-2 ${style.outlineButton}`}>
          Explore
        </button>
        <button type="button" className={`${buttonBase} ${style.outlineButton}`}>
          ...
        </button>
      </div>
    </div>
  );
}
