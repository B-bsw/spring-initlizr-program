import type { Theme } from "../../types/types";
import { dependenciesPreview, buttonBase } from "../../utils/constants";
import { ThemeStyle } from "../../models/ThemeStyle";

export default function DependencySection({ theme }: { theme: Theme }) {
  const style = new ThemeStyle(theme);

  return (
    <div className="md:flex-1">
      <section className="mb-6">
        <div className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}>
          <h3 className="mb-0 text-[14px] font-semibold">Dependencies</h3>
          <button type="button" className={`${buttonBase} ${style.outlineButton}`}>
            Add dependencies...
          </button>
        </div>
        <ul className="m-0 list-none p-0">
          {dependenciesPreview.map(([name, desc]) => (
            <li key={name} className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${style.border}`}>
              <strong className="mb-[0.2rem] block text-[14px]">{name}</strong>
              <span className="text-[14px] opacity-70">{desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
