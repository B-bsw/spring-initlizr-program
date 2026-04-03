"use client";

import { useMemo, useState } from "react";
import { ThemeStyle } from "../../models/ThemeStyle";
import useHomeState from "../../hooks/useHomeState";
import HeaderSection from "../../components/sections/HeaderSection";
import FormSection from "../../components/sections/FormSection";
import DependencySection from "../../components/sections/DependencySection";
import FooterSection from "../../components/sections/FooterSection";
import { Menu, Moon, Sun } from "lucide-react";
import { buttonBase } from "../../utils/constants";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import { Toast, toast } from "@heroui/react";
import { useTheme } from "next-themes";

export default function HomePage() {
  const { state, actions, computed } = useHomeState();
  const style = useMemo(() => new ThemeStyle(state.theme), [state.theme]);
  const [generating, setGenerating] = useState(false);
  const { setTheme } = useTheme();

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      if (!state.outputLocation) {
        // throw new Error("Please select output location");
        toast.warning("Please select output location.");
        return;
      }
      if (!state.name) {
        toast.warning("Please include your Project name.");
        return;
      }
      const response = await fetch("/api/starter", { method: "GET" });
      if (!response.ok) {
        throw new Error(`Generate failed (${response.status})`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const zipData = Array.from(new Uint8Array(arrayBuffer));
      await window.ipc.invoke<
        { path: string },
        { zipData: number[]; outputLocation: string; projectName: string }
      >("project:generate", {
        zipData,
        outputLocation: state.outputLocation,
        projectName: state.name,
      });
      toast.success("generate project success");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main
      className={`h-screen overflow-hidden md:grid md:grid-cols-[72px_1fr_72px] ${style.bg} ${style.text}`}
    >
      <Toast.Provider placement="bottom end" className="z-100 **:rounded-md" />
      <aside
        className={`${style.bg} sticky top-0 z-99 hidden h-screen md:block`}
      >
        <div
          className={`flex h-full flex-col items-center justify-between border-r px-2.5 py-3.5 ${style.border}`}
        >
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent opacity-90"
            aria-label="Menu"
          >
            <Menu />
          </button>
          <a
            className="cursor-pointer border-0 bg-transparent opacity-90"
            href="https://github.com/B-bsw/spring-initlizr-program"
            target="_blank"
            rel="noreferrer"
          >
            <IconBrandGithubFilled
              className={`rounded-full p-1 ${style.isDark ? "bg-white text-black" : "bg-black text-white"}`}
              size={30}
            />
          </a>
        </div>
      </aside>
      <section className="hide-scrollbar mx-auto h-screen w-full max-w-330 overflow-y-auto px-3 pb-24">
        <HeaderSection theme={state.theme} onThemeChange={actions.setTheme} />
        {state.loading ? (
          <div className="text-[14px] opacity-80">Loading metadata…</div>
        ) : state.error || !state.metadata ? (
          <div className="text-[14px] text-red-500">
            {state.error ?? "Metadata unavailable"}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <FormSection
              theme={state.theme}
              metadata={state.metadata}
              project={state.project}
              name={state.name}
              language={state.language}
              boot={state.boot}
              group={state.group}
              artifact={state.artifact}
              packageName={state.packageName}
              packaging={state.packaging}
              java={state.java}
              configFormat={state.configFormat}
              onProject={actions.setProject}
              onName={actions.setName}
              onLanguage={actions.setLanguage}
              onBoot={actions.setBoot}
              onGroup={actions.setGroup}
              onArtifact={actions.setArtifact}
              onPackageName={actions.setPackageName}
              onPackaging={actions.setPackaging}
              onJava={actions.setJava}
              onConfigFormat={actions.setConfigFormat}
            />
            <DependencySection
              theme={state.theme}
              dependencies={state.metadata.lists.dependencies}
              dependencyGroups={state.metadata.lists.dependencyGroups}
              boot={state.boot}
              selectedDependencies={state.selectedDependencies}
              outputLocation={state.outputLocation}
              outputLocationDisplay={computed.outputLocationDisplay}
              onPickOutputLocation={actions.pickOutputLocation}
              onSelectedDependenciesChange={actions.setSelectedDependencies}
            />
          </div>
        )}
        <FooterSection
          className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full"
          theme={state.theme}
          generating={generating}
          onGenerate={handleGenerate}
        />
      </section>
      <aside
        className={`sticky top-0 z-99 hidden h-screen md:block ${style.bg}`}
      >
        <div
          className={`flex h-full flex-col items-center justify-between border-l px-2.5 py-3.5 ${style.border}`}
        >
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`${buttonBase} h-10.5 w-10.5 p-0 ${
                state.theme === "light"
                  ? "border-[#6db33f] bg-[#6db33f] text-white"
                  : style.outlineButton
              }flex items-center justify-center`}
              onClick={() => {
                setTheme("light");
                actions.setTheme("light");
              }}
              aria-label="Enable  light mode"
            >
              <div>
                <Sun size={14} />
              </div>
            </button>
            <button
              type="button"
              className={`${buttonBase} h-10.5 w-10.5 p-0 ${
                state.theme === "dark"
                  ? "border-[#6db33f] bg-[#6db33f] text-[#111111]"
                  : style.outlineButton
              }flex items-center justify-center`}
              onClick={() => {
                setTheme("dark");
                actions.setTheme("dark");
              }}
              aria-label="Enable dark mode"
            >
              <Moon size={14} />
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
