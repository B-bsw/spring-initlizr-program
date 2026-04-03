import { Input, ListBox, Modal, TextField } from "@heroui/react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  isBootVersionInRange,
  type DependencyGroup,
} from "../../models/MetadataMapper";

type Props = {
  trigger: ReactNode;
  groups: DependencyGroup[];
  boot: string;
  selectedDependencies: string[];
  onToggleDependency: (key: string) => void;
};

const formatVersionRangeLabel = (versionRange: string) => {
  const range = versionRange.trim();
  if (!range.includes(",")) {
    return `>= ${range}`;
  }
  if (range === "[3.5.0,4.0.0-M1)") {
    return ">= 3.5.0 and < 4.0.0";
  }
  const body = range.slice(1, -1);
  const [lowerBoundRaw = "", upperBoundRaw = ""] = body
    .split(",")
    .map((part) => part.trim());
  const lowerOperator = range.startsWith("[") ? ">=" : ">";
  const upperOperator = range.endsWith("]") ? "<=" : "<";
  if (lowerBoundRaw && upperBoundRaw) {
    return `${lowerOperator} ${lowerBoundRaw} and ${upperOperator} ${upperBoundRaw}`;
  }
  if (lowerBoundRaw) {
    return `${lowerOperator} ${lowerBoundRaw}`;
  }
  if (upperBoundRaw) {
    return `${upperOperator} ${upperBoundRaw}`;
  }
  return range;
};

export default function DependencyModal({
  trigger,
  groups,
  boot,
  selectedDependencies,
  onToggleDependency,
}: Props) {
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!normalizedSearch) {
      return groups;
    }
    return groups
      .map((group) => ({
        ...group,
        values: group.values.filter((dependency) =>
          [dependency.text, dependency.description, dependency.key]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch),
        ),
      }))
      .filter((group) => group.values.length > 0);
  }, [groups, normalizedSearch]);

  return (
    <Modal>
      <Modal.Trigger>{trigger}</Modal.Trigger>
      <Modal.Backdrop className="z-9999" isKeyboardDismissDisabled={false}>
        <Modal.Container
          size="cover"
          scroll="inside"
          className="**:no-scrollbar"
        >
          <Modal.Dialog className="rounded-lg border-none">
            <Modal.Header className="flex items-center justify-between">
              <Modal.Heading>Add dependencies</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="overflow-y-auto">
              <div className="sticky top-0 z-20 bg-white px-1 py-2 dark:bg-zinc-900">
                <TextField aria-label="Search dependencies">
                  <Input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search dependencies"
                    aria-label="Search dependencies"
                    className="rounded-md border border-zinc-300 bg-white dark:bg-zinc-800 dark:border-zinc-600"
                    // className="focus:border-red-600"
                    variant="secondary"
                  />
                </TextField>
              </div>
              {filteredGroups.length === 0 && (
                <p className="flex items-center justify-center p-5">
                  No dependencies found
                </p>
              )}
              {filteredGroups.map((group) => (
                <section
                  key={group.name}
                  className="text-black dark:text-zinc-200"
                >
                  <h4 className="text-md sticky top-13 z-10 mb-1 border-y bg-white px-1 py-2 font-semibold dark:bg-zinc-900">
                    <span className="rounded-md border bg-green-600 px-2 py-1 text-white">
                      {group.name}
                    </span>
                  </h4>

                  <ListBox
                    aria-label={`${group.name} dependencies`}
                    selectionMode="multiple"
                    selectedKeys={new Set(selectedDependencies)}
                    onSelectionChange={(keys) => {
                      if (keys === "all") {
                        return;
                      }
                      const nextSelectedKeys = new Set(
                        Array.from(keys, (key) => String(key)),
                      );
                      group.values.forEach((dependency) => {
                        if (
                          !isBootVersionInRange(boot, dependency.versionRange)
                        ) {
                          return;
                        }
                        const isSelected = selectedDependencies.includes(
                          dependency.key,
                        );
                        const shouldBeSelected = nextSelectedKeys.has(
                          dependency.key,
                        );
                        if (isSelected !== shouldBeSelected) {
                          onToggleDependency(dependency.key);
                        }
                      });
                    }}
                    className="m-0 p-0"
                  >
                    {group.values.map((dependency) => {
                      const isCompatible = isBootVersionInRange(
                        boot,
                        dependency.versionRange,
                      );
                      return (
                        <ListBox.Item
                          key={dependency.key}
                          id={dependency.key}
                          textValue={dependency.text}
                          isDisabled={!isCompatible}
                          className={`rounded-none px-3 py-2 ${
                            selectedDependencies.includes(dependency.key) &&
                            "bg-zinc-200 dark:bg-zinc-800"
                          }`}
                        >
                          <div>
                            <strong className="mb-[0.2rem] block text-[14px]">
                              {dependency.text}
                            </strong>
                            {dependency.description && (
                              <span className="text-[13px] opacity-70">
                                {dependency.description}
                              </span>
                            )}
                            {dependency.versionRange && !isCompatible && (
                              <span className="mt-1 block text-xs font-semibold text-red-600 dark:text-red-400">
                                Requires Spring Boot{" "}
                                {formatVersionRangeLabel(
                                  dependency.versionRange,
                                )}
                              </span>
                            )}
                          </div>
                        </ListBox.Item>
                      );
                    })}
                  </ListBox>
                </section>
              ))}
            </Modal.Body>
            <Modal.CloseTrigger className="bg-inherit">
              <span className="mr-4 rounded-md bg-zinc-200 px-1 dark:bg-zinc-800 dark:text-white">
                Done
              </span>
            </Modal.CloseTrigger>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
