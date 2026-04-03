import { Button, InputGroup } from "@heroui/react";
import type { Theme } from "../../types/types";
import { buttonBase } from "../../utils/constants";
import { ThemeStyle } from "../../models/ThemeStyle";
import type { MetadataModel } from "../../models/MetadataMapper";
import { useMemo, useState } from "react";
import DependencyModal from "../ui/DependencyModal";
import { Folder } from "lucide-react";

type Props = {
  theme: Theme;
  dependencies: MetadataModel["lists"]["dependencies"];
  dependencyGroups: MetadataModel["lists"]["dependencyGroups"];
  selectedDependencies: string[];
  outputLocation: string;
  outputLocationDisplay: string;
  onPickOutputLocation: () => void;
  onSelectedDependenciesChange: (next: string[]) => void;
};

export default function DependencySection({
  theme,
  dependencies,
  dependencyGroups,
  selectedDependencies,
  outputLocation,
  outputLocationDisplay,
  onPickOutputLocation,
  onSelectedDependenciesChange,
}: Props) {
  const style = new ThemeStyle(theme);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);

  const selectedDependencyMap = useMemo(
    () => new Map(dependencies.map((item) => [item.key, item] as const)),
    [dependencies],
  );
  const selectedDependencyItems = selectedDependencies
    .map((key) => selectedDependencyMap.get(key))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const toggleDependency = (key: string) => {
    const next = selectedDependencies.includes(key)
      ? selectedDependencies.filter((item) => item !== key)
      : [...selectedDependencies, key];
    onSelectedDependenciesChange(next);
  };

  return (
    <div className="md:flex-1">
      <section className="mb-6">
        <div className={`mb-[0.8rem] border-b pb-[0.8rem] ${style.border}`}>
          <h3 className="mb-0 text-[14px] font-semibold">Location</h3>
        </div>
        <InputGroup
          className="w-full rounded-sm border border-zinc-200 bg-white dark:bg-[#272A2D] dark:border-[#4B5053]"
          variant="secondary"
        >
          <InputGroup.Input
            value={outputLocationDisplay || "No output directory selected"}
            readOnly
            aria-label="Output location"
          />
          <InputGroup.Suffix className="pr-1">
            <button
              type="button"
              className={`m-1 cursor-pointer rounded-md p-1 hover:bg-zinc-200`}
              onClick={onPickOutputLocation}
              aria-label="Browse output location"
            >
              <Folder size={16} />
            </button>
          </InputGroup.Suffix>
        </InputGroup>
        {/*{outputLocation && (
          <p className="mt-2 text-[12px] opacity-70">{outputLocation}</p>
        )}*/}
      </section>
      <section className="mb-6">
        <div
          className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}
        >
          <h3 className="mb-0 text-[14px] font-semibold">Dependencies</h3>
          <Button
            className="rounded-md bg-zinc-300 text-black dark:text-white dark:bg-zinc-700"
            onClick={() => setIsDependencyModalOpen(true)}
          >
            Add dependencies
          </Button>
        </div>
        <ul className="m-0 list-none p-0">
          {selectedDependencyItems.length === 0 && (
            <li
              className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${style.border}`}
            >
              <span className="text-[14px] opacity-70">
                No dependencies selected
              </span>
            </li>
          )}
          {selectedDependencyItems.map((dependency) => (
            <li
              key={dependency.key}
              className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${style.border}`}
            >
              <div className="mb-[0.2rem] flex items-start justify-between gap-2">
                <strong className="block text-[14px]">{dependency.text}</strong>
                <button
                  type="button"
                  className={`${buttonBase} px-2 py-1 text-[12px] ${style.outlineButton}`}
                  onClick={() => toggleDependency(dependency.key)}
                >
                  Remove
                </button>
              </div>
              {dependency.description && (
                <span className="text-[14px] opacity-70">
                  {dependency.description}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
      <DependencyModal
        open={isDependencyModalOpen}
        onOpenChange={setIsDependencyModalOpen}
        groups={dependencyGroups}
        selectedDependencies={selectedDependencies}
        onToggleDependency={toggleDependency}
      />
    </div>
  );
}
