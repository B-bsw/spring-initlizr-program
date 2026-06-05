import { Button } from "@heroui/react";
import type { Theme } from "../../types/types";
import { ThemeStyle } from "../../models/ThemeStyle";
import {
  isBootVersionInRange,
  type MetadataModel,
} from "../../models/MetadataMapper";
import { useMemo } from "react";
import DependencyModal from "../ui/DependencyModal";
import { Trash2 } from "lucide-react";

type Props = {
  theme: Theme;
  dependencies: MetadataModel["lists"]["dependencies"];
  dependencyGroups: MetadataModel["lists"]["dependencyGroups"];
  boot: string;
  selectedDependencies: string[];
  onSelectedDependenciesChange: (next: string[]) => void;
};

export default function DependencySection({
  theme,
  dependencies,
  dependencyGroups,
  boot,
  selectedDependencies,
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
      <section className="mb-4">
        <div
          className={`mb-2 flex items-center justify-between gap-4 border-b pb-2 ${style.border}`}
        >
          <h3 className="mb-0 text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">Dependencies</h3>
          <DependencyModal
            trigger={
              <Button className="rounded-sm bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 transition-colors font-medium border border-neutral-200 dark:border-neutral-700 text-xs h-7 min-h-0 px-2">
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
          className={`${selectedDependencyItems.length < 2 && "border-0"} no-scrollbar max-h-[45vh] overflow-scroll rounded-sm border p-0.5`}
        >
          <ul className="no-scrollbar m-0 list-none p-0">
            {selectedDependencyItems.length === 0 && (
              <li
                className={`border-t py-1.5 first:border-t-0 first:pt-0 ${style.border}`}
              >
                <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                  No dependencies selected
                </span>
              </li>
            )}
            {selectedDependencyItems.map((dependency) => (
              <li
                key={dependency.key}
                className={`border-t py-1.5 first:border-t-0 first:pt-0 ${style.border}`}
              >
                <div className="flex items-center justify-between gap-2 py-0.5 group">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs leading-tight font-medium text-neutral-900 dark:text-neutral-100">
                      {dependency.text}
                    </p>

                    {dependency.description && (
                      <p className="mt-0.5 text-[11px] leading-snug text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {dependency.description}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => toggleDependency(dependency.key)}
                    isIconOnly
                    variant="ghost"
                    className="shrink-0 rounded text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 h-6 w-6 min-h-0 min-w-0 p-0"
                    aria-label={`Remove ${dependency.text}`}
                  >
                    <Trash2 size={14} />
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
