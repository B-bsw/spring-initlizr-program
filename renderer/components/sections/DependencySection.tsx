import type { Theme } from "../../types/types";
import { buttonBase } from "../../utils/constants";
import { ThemeStyle } from "../../models/ThemeStyle";
import type { MetadataModel } from "../../models/MetadataMapper";
import { useMemo, useState } from "react";

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
        <div
          className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}
        >
          <h3 className="mb-0 text-[14px] font-semibold">Location</h3>
          <button
            type="button"
            className={`${buttonBase} ${style.outlineButton}`}
            onClick={onPickOutputLocation}
          >
            Browse
          </button>
        </div>
        <div
          className={`rounded border px-[0.58rem] py-[0.48rem] text-[14px] ${style.inputTone}`}
        >
          {outputLocationDisplay || "No output directory selected"}
        </div>
        {outputLocation && (
          <p className="mt-2 text-[12px] opacity-70">{outputLocation}</p>
        )}
      </section>
      <section className="mb-6">
        <div
          className={`mb-[0.8rem] flex items-center justify-between gap-4 border-b pb-[0.8rem] ${style.border}`}
        >
          <h3 className="mb-0 text-[14px] font-semibold">Dependencies</h3>
          <button
            type="button"
            className={`${buttonBase} ${style.outlineButton}`}
            onClick={() => setIsDependencyModalOpen(true)}
          >
            Add dependencies...
          </button>
        </div>
        <ul className="m-0 list-none p-0">
          {selectedDependencyItems.length === 0 && (
            <li className={`border-t py-[0.8rem] first:border-t-0 first:pt-0 ${style.border}`}>
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
      {isDependencyModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 px-4">
          <div
            className={`max-h-[80vh] w-full max-w-3xl overflow-hidden rounded border ${style.border} ${style.bg} ${style.text}`}
          >
            <div
              className={`flex items-center justify-between border-b px-4 py-3 ${style.border}`}
            >
              <h3 className="text-[16px] font-semibold">Add dependencies</h3>
              <button
                type="button"
                className={`${buttonBase} ${style.outlineButton}`}
                onClick={() => setIsDependencyModalOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="max-h-[calc(80vh-64px)] overflow-y-auto px-4 py-3">
              {dependencyGroups.map((group) => (
                <section key={group.name} className="mb-4">
                  <h4
                    className={`mb-2 border-b pb-2 text-[14px] font-semibold ${style.border}`}
                  >
                    {group.name}
                  </h4>
                  <ul className="m-0 list-none p-0">
                    {group.values.map((dependency) => {
                      const checked = selectedDependencies.includes(
                        dependency.key,
                      );
                      return (
                        <li
                          key={dependency.key}
                          className={`border-t py-2 first:border-t-0 ${style.border}`}
                        >
                          <label className="flex cursor-pointer items-start gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDependency(dependency.key)}
                              className="mt-0.5"
                            />
                            <span>
                              <strong className="mb-[0.2rem] block text-[14px]">
                                {dependency.text}
                              </strong>
                              {dependency.description && (
                                <span className="text-[13px] opacity-70">
                                  {dependency.description}
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
