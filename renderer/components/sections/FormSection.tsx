import { ListBox, Select } from "@heroui/react";
import ChoiceTabs from "../ui/ChoiceTabs";
import AppInput from "../ui/AppInput";
import { ThemeStyle } from "../../models/ThemeStyle";
import type { Theme } from "../../types/types";
import type { MetadataModel } from "../../models/MetadataMapper";

type Props = {
  theme: Theme;
  metadata: MetadataModel;
  project: string;
  name: string;
  language: string;
  boot: string;
  group: string;
  artifact: string;
  packageName: string;
  packaging: string;
  java: string;
  configFormat: string;
  onProject: (value: string) => void;
  onName: (value: string) => void;
  onLanguage: (value: string) => void;
  onBoot: (value: string) => void;
  onGroup: (value: string) => void;
  onArtifact: (value: string) => void;
  onPackageName: (value: string) => void;
  onPackaging: (value: string) => void;
  onJava: (value: string) => void;
  onConfigFormat: (value: string) => void;
};

export default function FormSection(props: Props) {
  const style = new ThemeStyle(props.theme);
  return (
    <div className="md:flex-1 md:pr-20">
      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Project name</h3>
        <AppInput
          className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
          value={props.name}
          onChange={(value) => props.onName(value.trim())}
          ariaLabel="Project name"
        />
      </section>
      <div className="flex w-full justify-between gap-5">
        <section className="mb-6">
          <h3 className="mb-[0.7rem] text-[14px] font-semibold">Project</h3>
          <ChoiceTabs
            options={props.metadata.lists.project}
            selected={props.project}
            onChange={props.onProject}
            ariaLabel="Project type"
          />
        </section>

        <section className="mb-6">
          <h3 className="mb-[0.7rem] text-[14px] font-semibold">Language</h3>
          <ChoiceTabs
            options={props.metadata.lists.language}
            selected={props.language}
            onChange={props.onLanguage}
            ariaLabel="Programming language"
          />
        </section>
      </div>

      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">Spring Boot</h3>
        <Select
          variant="secondary"
          selectedKey={props.boot}
          onSelectionChange={(key) => props.onBoot(String(key))}
          className="w-full"
          aria-label="Spring Boot version"
        >
          <Select.Trigger
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
          >
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover className="rounded-md">
            <ListBox>
              {props.metadata.lists.boot.map((item) => (
                <ListBox.Item
                  textValue={item.text}
                  key={item.key}
                  id={item.key}
                  className="rounded-md"
                >
                  {item.text}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </section>

      <section className="mb-6">
        <h3 className="mb-[0.7rem] text-[14px] font-semibold">
          Project Metadata
        </h3>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Group</span>
          <AppInput
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
            value={props.group}
            onChange={props.onGroup}
            ariaLabel="Group"
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Artifact</span>
          <AppInput
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
            value={props.artifact}
            onChange={props.onArtifact}
            ariaLabel="Artifact"
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Package name</span>
          <AppInput
            className={`w-full rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
            value={props.packageName}
            onChange={props.onPackageName}
            ariaLabel="Package name"
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Packaging</span>
          <ChoiceTabs
            options={props.metadata.lists.meta.packaging}
            selected={props.packaging}
            onChange={props.onPackaging}
            ariaLabel="Packaging"
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Java</span>
          <ChoiceTabs
            options={props.metadata.lists.meta.java}
            selected={props.java}
            onChange={props.onJava}
            ariaLabel="Java version"
          />
        </label>
        <label className="mb-[0.65rem] grid grid-cols-1 items-center gap-[0.35rem] md:grid-cols-[120px_1fr] md:gap-[0.8rem]">
          <span className="text-[14px]">Configuration</span>
          <ChoiceTabs
            options={props.metadata.lists.meta.configurationFileFormat}
            selected={props.configFormat}
            onChange={props.onConfigFormat}
            ariaLabel="Configuration file format"
          />
        </label>
      </section>
    </div>
  );
}
