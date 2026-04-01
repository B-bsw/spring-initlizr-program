import ChoiceGroup from "../ui/ChoiceGroup";
import { HomeThemeStyle } from "../models/HomeThemeStyle";
import type { Theme } from "../types";
import type { MetadataModel } from "../models/MetadataMapper";

type Props = {
  theme: Theme;
  metadata: MetadataModel;
  project: string;
  language: string;
  boot: string;
  group: string;
  artifact: string;
  packageName: string;
  packaging: string;
  java: string;
  configFormat: string;
  onProject: (value: string) => void;
  onLanguage: (value: string) => void;
  onBoot: (value: string) => void;
  onGroup: (value: string) => void;
  onArtifact: (value: string) => void;
  onPackageName: (value: string) => void;
  onPackaging: (value: string) => void;
  onJava: (value: string) => void;
  onConfigFormat: (value: string) => void;
};

export default function HomeFormSection(props: Props) {
  const style = new HomeThemeStyle(props.theme);
  return (
    <div className="md:flex-1 md:pr-20">
      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Project</h3>
        <ChoiceGroup
          options={props.metadata.lists.project}
          selected={props.project}
          onChange={props.onProject}
          dark={style.isDark}
        />
      </section>

      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Language</h3>
        <ChoiceGroup
          options={props.metadata.lists.language}
          selected={props.language}
          onChange={props.onLanguage}
          dark={style.isDark}
        />
      </section>

      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Spring Boot</h3>
        <ChoiceGroup
          options={props.metadata.lists.boot}
          selected={props.boot}
          onChange={props.onBoot}
          dark={style.isDark}
        />
      </section>

      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Project Metadata</h3>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Group</span>
          <input
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${style.inputTone}`}
            value={props.group}
            onChange={(e) => props.onGroup(e.target.value)}
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Artifact</span>
          <input
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${style.inputTone}`}
            value={props.artifact}
            onChange={(e) => props.onArtifact(e.target.value)}
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Package name</span>
          <input
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] outline-none ${style.inputTone}`}
            value={props.packageName}
            onChange={(e) => props.onPackageName(e.target.value)}
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Packaging</span>
          <ChoiceGroup
            options={props.metadata.lists.meta.packaging}
            selected={props.packaging}
            onChange={props.onPackaging}
            dark={style.isDark}
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Java</span>
          <ChoiceGroup
            options={props.metadata.lists.meta.java}
            selected={props.java}
            onChange={props.onJava}
            dark={style.isDark}
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Configuration</span>
          <ChoiceGroup
            options={props.metadata.lists.meta.configurationFileFormat}
            selected={props.configFormat}
            onChange={props.onConfigFormat}
            dark={style.isDark}
          />
        </label>
      </section>
    </div>
  );
}
