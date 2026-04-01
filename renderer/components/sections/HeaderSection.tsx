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
    <header>
      <h1 className="m-0 block max-w-[320px] py-8">
        <a href="/home">
          <span className="block px-1.5 outline-none">
            <Logo className="block text-lime-600/80" />
          </span>
        </a>
      </h1>
      <h2 className="m-0 py-[0.8rem] pb-4">
        <strong className="block pb-[0.4rem] text-[42px] leading-10 font-semibold">Spring Initializr</strong>
        <span className="block text-[22px] leading-8 font-semibold">Bootstrap your application with Spring Boot</span>
      </h2>
      <p className="mt-[0.3rem] text-[16px] leading-[1.6rem] font-extralight">
        Generate a project with selected dependencies and start coding right away.
      </p>
      <hr className={`my-8 mt-[0.2rem] border-0 border-t ${style.border}`} />
    </header>
  );
}
