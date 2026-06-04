import Logo from "../../app/home/Logo";
import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";

export default function HeaderSection({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const style = new ThemeStyle(theme);

  return (
    <header className="pt-10 pb-6">
      {/*<h1 className="m-0 block max-w-[320px] py-8">
        <a href="/home">
          <span className="block px-1.5 outline-none">
            <Logo className="block text-lime-600/80" />
          </span>
        </a>
      </h1>*/}
      <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400 font-light max-w-lg">
        Generate a project with selected dependencies and start coding right away.
      </p>
      <hr className={`mt-8 mb-6 border-0 border-t ${style.border}`} />
    </header>
  );
}
