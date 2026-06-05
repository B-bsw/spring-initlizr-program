import {Logo} from "../icons";
import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import { Moon, Sun } from "lucide-react";
import { IconBrandGithubFilled } from "@tabler/icons-react";

export default function HeaderSection({
  theme,
  onThemeChange,
}: {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const style = new ThemeStyle(theme);

  return (
    <header className="pt-6 pb-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="m-0 block max-w-[320px] py-4">
            <a href="/home">
              <span className="block px-1.5 outline-none">
                <Logo className="block text-lime-600/80 dark:text-lime-600 "/>
              </span>
            </a>
          </h1>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium max-w-lg mb-4">
            Generate a project with selected dependencies and start coding right away.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
            onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <a
            className="flex items-center justify-center w-7 h-7 rounded bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
            href="https://github.com/B-bsw/spring-initlizr-program"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
          >
            <IconBrandGithubFilled size={16} />
          </a>
        </div>
      </div>

      <hr className={`mt-2 mb-4 border-0 border-t ${style.border}`} />
    </header>
  );
}
