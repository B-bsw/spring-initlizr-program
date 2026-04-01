"use client";

import { useMemo } from "react";
import { HomeThemeStyle } from "../../components/models/HomeThemeStyle";
import useHomeState from "../../components/hooks/useHomeState";
import HomeHeaderSection from "../../components/sections/HomeHeaderSection";
import HomeFormSection from "../../components/sections/HomeFormSection";
import HomeDependencySection from "../../components/sections/HomeDependencySection";
import HomeFooterSection from "../../components/sections/HomeFooterSection";
import { Menu } from "lucide-react";
import { buttonBase } from "../../components/constants";

export default function LayoutHome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state, actions } = useHomeState();
  const style = useMemo(() => new HomeThemeStyle(state.theme), [state.theme]);

  return (
    <main className={`min-h-screen md:grid md:grid-cols-[72px_1fr_72px] ${style.bg} ${style.text}`}>
      <aside className="sticky top-0 hidden h-screen md:block">
        <div className={`flex h-full flex-col items-center justify-between border-r px-2.5 py-3.5 ${style.border}`}>
          <button type="button" className="cursor-pointer border-0 bg-transparent opacity-90" aria-label="Menu">
            <Menu />
          </button>
          <a
            className="cursor-pointer border-0 bg-transparent opacity-90"
            href="https://github.com/spring-io/start.spring.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </aside>
      <section className="mx-auto w-full max-w-[1320px] px-3 pb-20 md:px-[110px]">
        <HomeHeaderSection theme={state.theme} onThemeChange={actions.setTheme} />
        {state.loading ? (
          <div className="text-[14px] opacity-80">Loading metadata…</div>
        ) : state.error || !state.metadata ? (
          <div className="text-[14px] text-red-500">{state.error ?? "Metadata unavailable"}</div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <HomeFormSection
              theme={state.theme}
              metadata={state.metadata}
              project={state.project}
              language={state.language}
              boot={state.boot}
              group={state.group}
              artifact={state.artifact}
              packageName={state.packageName}
              packaging={state.packaging}
              java={state.java}
              configFormat={state.configFormat}
              onProject={actions.setProject}
              onLanguage={actions.setLanguage}
              onBoot={actions.setBoot}
              onGroup={actions.setGroup}
              onArtifact={actions.setArtifact}
              onPackageName={actions.setPackageName}
              onPackaging={actions.setPackaging}
              onJava={actions.setJava}
              onConfigFormat={actions.setConfigFormat}
            />
            <HomeDependencySection theme={state.theme} />
          </div>
        )}
        <HomeFooterSection theme={state.theme} />
        {children}
      </section>
      <aside className="sticky top-0 hidden h-screen md:block">
        <div className={`flex h-full flex-col items-center justify-between border-l px-2.5 py-3.5 ${style.border}`}>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`${buttonBase} h-[42px] w-[42px] p-0 ${
                state.theme === "light" ? "border-[#6db33f] bg-[#6db33f] text-white" : style.outlineButton
              }`}
              onClick={() => actions.setTheme("light")}
              aria-label="Enable light mode"
            >
              ☀
            </button>
            <button
              type="button"
              className={`${buttonBase} h-[42px] w-[42px] p-0 ${
                state.theme === "dark" ? "border-[#6db33f] bg-[#6db33f] text-[#111111]" : style.outlineButton
              }`}
              onClick={() => actions.setTheme("dark")}
              aria-label="Enable dark mode"
            >
              ☾
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
