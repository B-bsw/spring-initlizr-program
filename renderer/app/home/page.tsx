"use client";

import { useEffect, useState } from "react";
import Logo from "../../app/home/Logo";
import ChoiceGroup from "../../components/ui/ChoiceGroup";
import { buttonBase, dependenciesPreview } from "../../components/constants";
import type { Theme } from "../../types/types";
import useMetadata from "../../hooks/useMetadata";
import { Menu } from "lucide-react";

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("light");
  const { metadata, loading, error } = useMetadata();

  const [project, setProject] = useState("");
  const [language, setLanguage] = useState("");
  const [boot, setBoot] = useState("");
  const [group, setGroup] = useState("");
  const [artifact, setArtifact] = useState("");
  const [packageName, setPackageName] = useState("");
  const [packaging, setPackaging] = useState("");
  const [java, setJava] = useState("");
  const [configFormat, setConfigFormat] = useState("");

  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#1b1f23]" : "bg-white";
  const text = isDark ? "text-white" : "text-[#111111]";
  const border = isDark ? "border-[#4a5053]" : "border-[#dce8e8]";
  const actionBg = isDark ? "bg-[#262a2d]" : "bg-[#ecf2f2]";
  const outlineButton = isDark
    ? "border-white text-white"
    : "border-[#111111] text-[#111111]";
  const inputTone = isDark
    ? "border-[#4a5053] bg-[#262a2d] text-white"
    : "border-[#dce8e8] bg-white text-[#111111]";

  useEffect(() => {
    if (!metadata) return;
    setProject(metadata.defaultValues.project);
    setLanguage(metadata.defaultValues.language);
    setBoot(metadata.defaultValues.boot);
    setGroup(metadata.defaultValues.meta.group);
    setArtifact(metadata.defaultValues.meta.artifact);
    setPackageName(metadata.defaultValues.meta.packageName);
    setPackaging(metadata.defaultValues.meta.packaging);
    setJava(metadata.defaultValues.meta.java);
    setConfigFormat(metadata.defaultValues.meta.configurationFileFormat);
  }, [metadata]);

  useEffect(() => {
    setPackageName([group, artifact].filter(Boolean).join("."));
  }, [group, artifact]);

  return (
    <main
      className={`min-h-screen md:grid md:grid-cols-[72px_1fr_72px] ${bg} ${text}`}
    >
      <aside className="sticky top-0 hidden h-screen md:block">
        <div
          className={`flex h-full flex-col items-center justify-between border-r px-2.5 py-3.5 ${border}`}
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
            href="https://github.com/spring-io/start.spring.io"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </aside>

      <section className="mx-auto w-full max-w-[1320px] px-3 pb-20 md:px-[110px]">
        <header>
          <h1 className="m-0 block max-w-[320px] py-8">
            <a href="/home">
              <span className="block px-1.5 outline-none">
                <Logo className="block text-[#6db33f]" />
              </span>
            </a>
          </h1>
          <h2 className="m-0 py-[0.8rem] pb-4">
            <strong className="block pb-[0.4rem] text-[42px] leading-10 font-semibold">
              Spring Initializr
            </strong>
            <span className="block text-[22px] leading-8 font-semibold">
              Bootstrap your application with Spring Boot
            </span>
          </h2>
          <p className="mt-[0.3rem] text-[16px] leading-[1.6rem] font-extralight">
            Generate a project with selected dependencies and start coding right
            away.
          </p>
        </header>
        <hr className={`my-8 mt-[0.2rem] border-0 border-t ${border}`} />

        {loading ? (
          <div className="text-[14px] opacity-80">Loading metadata…</div>
        ) : error || !metadata ? (
          <div className="text-[14px] text-red-500">
            {error ?? "Metadata unavailable"}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:flex-1 md:pr-20">
              <section className="mb-6">
                <h3 className="mb-[0.7rem] text-[14px] font-semibold">
                  Project
                </h3>
                <ChoiceGroup
                  options={metadata.lists.project}
                  selected={project}
                  onChange={setProject}
                  dark={isDark}
                />
              </section>

              <section className="mb-6">
                <h3 className="mb-[0.7rem] text-[14px] font-semibold">
                  Language
                </h3>
                <ChoiceGroup
                  options={metadata.lists.language}
                  selected={language}
                  onChange={setLanguage}
                  dark={isDark}
                />
              </section>

              <section className="mb-6">
                <h3 className="mb-[0.7rem] text-[14px] font-semibold">
                  Spring Boot
                </h3>
                <ChoiceGroup
                  options={metadata.lists.boot}
                  selected={boot}
                  onChange={setBoot}
                  dark={isDark}
                />
              </section>

              <section className="mb-6">
                <h3 className="mb-[0.7rem] text-[14px] font-semibold">
                  Project Metadata
                </h3>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Group</span>
                  <input
                    className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${inputTone}`}
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  />
                </label>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Artifact</span>
                  <input
                    className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${inputTone}`}
                    value={artifact}
                    onChange={(e) => setArtifact(e.target.value)}
                  />
                </label>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Package name</span>
                  <input
                    className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${inputTone}`}
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                  />
                </label>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Packaging</span>
                  <ChoiceGroup
                    options={metadata.lists.meta.packaging}
                    selected={packaging}
                    onChange={setPackaging}
                    dark={isDark}
                  />
                </label>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Java</span>
                  <ChoiceGroup
                    options={metadata.lists.meta.java}
                    selected={java}
                    onChange={setJava}
                    dark={isDark}
                  />
                </label>
                <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
                  <span className="text-[14px]">Configuration</span>
                  <ChoiceGroup
                    options={metadata.lists.meta.configurationFileFormat}
                    selected={configFormat}
                    onChange={setConfigFormat}
                    dark={isDark}
                  />
                </label>
              </section>
            </div>

            <div className="md:flex-1">
              <section className="mb-6">
                <div
                  className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${border}`}
                >
                  <h3 className="mb-0 text-[14px] font-semibold">
                    Dependencies
                  </h3>
                  <button
                    type="button"
                    className={`${buttonBase} ${outlineButton}`}
                  >
                    Add dependencies...
                  </button>
                </div>
                <ul className="m-0 list-none p-0">
                  {dependenciesPreview.map(([name, desc]) => (
                    <li
                      key={name}
                      className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${border}`}
                    >
                      <strong className="mb-[0.2rem] block text-[14px]">
                        {name}
                      </strong>
                      <span className="text-[14px] opacity-70">{desc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 mt-[0.8rem]">
          <div className={`py-[0.7rem] ${actionBg}`}>
            <button
              type="button"
              className={`${buttonBase} mr-2 border-[#6db33f] bg-[#6db33f] text-white`}
            >
              Generate
            </button>
            <button
              type="button"
              className={`${buttonBase} mr-2 ${outlineButton}`}
            >
              Explore
            </button>
            <button type="button" className={`${buttonBase} ${outlineButton}`}>
              ...
            </button>
          </div>
        </div>
      </section>

      <aside className="sticky top-0 hidden h-screen md:block">
        <div
          className={`flex h-full flex-col items-center justify-between border-l px-2.5 py-3.5 ${border}`}
        >
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`${buttonBase} h-[42px] w-[42px] p-0 ${
                theme === "light"
                  ? "border-[#6db33f] bg-[#6db33f] text-white"
                  : outlineButton
              }`}
              onClick={() => setTheme("light")}
              aria-label="Enable light mode"
            >
              ☀
            </button>
            <button
              type="button"
              className={`${buttonBase} h-[42px] w-[42px] p-0 ${
                theme === "dark"
                  ? "border-[#6db33f] bg-[#6db33f] text-[#111111]"
                  : outlineButton
              }`}
              onClick={() => setTheme("dark")}
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
