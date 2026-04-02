import type { Theme } from "../../types/types";
import { dependenciesPreview, buttonBase } from "../../utils/constants";
import { ThemeStyle } from "../../models/ThemeStyle";

type Props = {
  theme: Theme;
  outputLocation: string;
  outputLocationDisplay: string;
  onPickOutputLocation: () => void;
};

export default function DependencySection({
  theme,
  outputLocation,
  outputLocationDisplay,
  onPickOutputLocation,
}: Props) {
  const style = new ThemeStyle(theme);

  return (
    <div className="md:flex-1">
      <section className="mb-6">
        <div
          className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}
        >
          <h3 className="mb-0 text-[14px] font-semibold">Location</h3>
          <button
            type="button"
            className={`${buttonBase} ${style.outlineButton}`}
            onClick={onPickOutputLocation}
          >
            Browse
          </button>
        </div>
        <div
          className={`rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
        >
          {outputLocationDisplay || "No output directory selected"}
        </div>
        {outputLocation && (
          <p className="mt-2 text-[12px] opacity-70">{outputLocation}</p>
        )}
      </section>
      <section className="mb-6">
        <div
          className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}
        >
          <h3 className="mb-0 text-[14px] font-semibold">Dependencies</h3>
          <button
            type="button"
            className={`${buttonBase} ${style.outlineButton}`}
          >
            Add dependencies...
          </button>
        </div>
        <ul className="m-0 list-none p-0">
          {dependenciesPreview.map(([name, desc]) => (
            <li
              key={name}
              className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${style.border}`}
            >
              <strong className="mb-[0.2rem] block text-[14px]">{name}</strong>
              <span className="text-[14px] opacity-70">{desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
