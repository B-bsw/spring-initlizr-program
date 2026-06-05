import { ListBox, Select, InputGroup } from "@heroui/react";
import ChoiceTabs from "../ui/ChoiceTabs";
import AppInput from "../ui/AppInput";
import { ThemeStyle } from "../../models/ThemeStyle";
import type { Theme } from "../../types/types";
import type { MetadataModel } from "../../models/MetadataMapper";
import { Folder } from "lucide-react";

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
  outputLocation: string;
  outputLocationDisplay: string;
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
  onPickOutputLocation: () => void;
};

export default function FormSection(props: Props) {
  const style = new ThemeStyle(props.theme);
  return (
    <div className="md:flex-1 md:pr-20">
      <section className="mb-4">
        <h3 className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Project name</h3>
        <AppInput
          className={`w-full rounded-sm border px-2 py-1 text-xs transition-all focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none ${style.inputTone}`}
          value={props.name}
          onChange={(value) => props.onName(value.trim())}
          ariaLabel="Project name"
        />
      </section>
      
      <section className="mb-4">
        <h3 className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Location</h3>
        <InputGroup
          className="w-full rounded-sm border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 transition-all focus-within:ring-1 focus-within:ring-lime-500 focus-within:border-lime-500 text-xs"
          variant="secondary"
        >
          <InputGroup.Input
            value={props.outputLocationDisplay || "No output directory selected"}
            readOnly
            className="px-2 py-1 text-xs"
            aria-label="Output location"
          />
          <InputGroup.Suffix className="pr-1">
            <button
              type="button"
              className={`m-0.5 cursor-pointer rounded p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-lime-500`}
              onClick={props.onPickOutputLocation}
              aria-label="Browse output location"
            >
              <Folder size={14} />
            </button>
          </InputGroup.Suffix>
        </InputGroup>
      </section>

      <div className="flex w-full flex-col md:flex-row md:justify-between gap-4">
        <section className="mb-4 w-full">
          <h3 className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Project</h3>
          <ChoiceTabs
            options={props.metadata.lists.project}
            selected={props.project}
            onChange={props.onProject}
            ariaLabel="Project type"
          />
        </section>

        <section className="mb-4 w-full">
          <h3 className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Language</h3>
          <ChoiceTabs
            options={props.metadata.lists.language}
            selected={props.language}
            onChange={props.onLanguage}
            ariaLabel="Programming language"
          />
        </section>
      </div>

      <section className="mb-4">
        <h3 className="mb-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Spring Boot</h3>
        <Select
          variant="secondary"
          selectedKey={props.boot}
          onSelectionChange={(key) => props.onBoot(String(key))}
          className="w-full"
          aria-label="Spring Boot version"
        >
          <Select.Trigger
            className={`w-full rounded-sm border px-2 py-1 text-xs transition-all focus-visible:border-lime-500 focus-visible:ring-1 focus-visible:ring-lime-500 outline-none ${style.inputTone}`}
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

      <section className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">
          Project Metadata
        </h3>
        <label className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Group</span>
          <AppInput
            className={`w-full rounded-sm border px-2 py-1 text-xs transition-all focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none ${style.inputTone}`}
            value={props.group}
            onChange={props.onGroup}
            ariaLabel="Group"
          />
        </label>
        <label className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Artifact</span>
          <AppInput
            className={`w-full rounded-sm border px-2 py-1 text-xs transition-all focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none ${style.inputTone}`}
            value={props.artifact}
            onChange={props.onArtifact}
            ariaLabel="Artifact"
          />
        </label>
        <label className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Package name</span>
          <AppInput
            className={`w-full rounded-sm border px-2 py-1 text-xs transition-all focus:border-lime-500 focus:ring-1 focus:ring-lime-500 outline-none ${style.inputTone}`}
            value={props.packageName}
            onChange={props.onPackageName}
            ariaLabel="Package name"
          />
        </label>
        <label className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Packaging</span>
          <ChoiceTabs
            options={props.metadata.lists.meta.packaging}
            selected={props.packaging}
            onChange={props.onPackaging}
            ariaLabel="Packaging"
          />
        </label>
        <label className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Java</span>
          <ChoiceTabs
            options={props.metadata.lists.meta.java}
            selected={props.java}
            onChange={props.onJava}
            ariaLabel="Java version"
          />
        </label>
        <label className="mb-1 grid grid-cols-1 items-center gap-2 md:grid-cols-[100px_1fr] md:gap-2 group">
          <span className="text-xs text-neutral-600 dark:text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-200 transition-colors">Configuration</span>
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
