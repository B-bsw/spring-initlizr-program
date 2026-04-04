import { Button, InputGroup } from "@heroui/react";
import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import {
  isBootVersionInRange,
  type MetadataModel,
} from "../../models/MetadataMapper";
import { useMemo } from "react";
import DependencyModal from "../ui/DependencyModal";
import { Folder, Trash2 } from "lucide-react";

type Props = {
  theme: Theme;
  dependencies: MetadataModel["lists"]["dependencies"];
  dependencyGroups: MetadataModel["lists"]["dependencyGroups"];
  boot: string;
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
  boot,
  selectedDependencies,
  outputLocation,
  outputLocationDisplay,
  onPickOutputLocation,
  onSelectedDependenciesChange,
}: Props) {
  const style = new ThemeStyle(theme);

  const selectedDependencyMap = useMemo(
    () => new Map(dependencies.map((item) => [item.key, item] as const)),
    [dependencies],
  );
  const selectedDependencyItems = selectedDependencies
    .map((key) => selectedDependencyMap.get(key))
    .filter((item): item is NonNullable<typeof item> => {
      if (!item) {
        return false;
      }
      return isBootVersionInRange(boot, item.versionRange);
    });

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
          className="w-full rounded-sm border border-zinc-200 bg-white dark:border-[#4B5053] dark:bg-[#272A2D]"
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
              className={`m-1 cursor-pointer rounded-md p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600`}
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
          <DependencyModal
            trigger={
              <Button className="rounded-md bg-zinc-300 text-black dark:bg-zinc-700 dark:text-white">
                Add dependencies
              </Button>
            }
            groups={dependencyGroups}
            boot={boot}
            selectedDependencies={selectedDependencies}
            onToggleDependency={toggleDependency}
          />
        </div>
        <div
          className={`${selectedDependencyItems.length < 2 && "border-0"} no-scrollbar max-h-[45vh] overflow-scroll rounded-md border p-1`}
        >
          <ul className="no-scrollbar m-0 list-none p-0">
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
                <div className="flex items-center justify-between gap-3 py-1">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-tight font-semibold">
                      {dependency.text}
                    </p>

                    {dependency.description && (
                      <p className="text-default-500 line-clamp-2 text-sm leading-tight">
                        {dependency.description}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => toggleDependency(dependency.key)}
                    isIconOnly
                    variant="danger"
                    className="shrink-0 rounded-md"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
