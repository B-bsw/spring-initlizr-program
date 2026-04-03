import {
  Checkbox,
  Input,
  Modal,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { useMemo, useState } from "react";
import type { DependencyGroup } from "../../models/MetadataMapper";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: DependencyGroup[];
  selectedDependencies: string[];
  onToggleDependency: (key: string) => void;
};

export default function DependencyModal({
  open,
  onOpenChange,
  groups,
  selectedDependencies,
  onToggleDependency,
}: Props) {
  const state = useOverlayState({
    isOpen: open,
    onOpenChange,
  });
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
    <Modal state={state}>
      <Modal.Trigger />
      <Modal.Backdrop className="z-9999" isKeyboardDismissDisabled>
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
              <div className="sticky top-0 z-20 border-b bg-white py-2 dark:bg-zinc-900">
                <TextField aria-label="Search dependencies">
                  <Input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search dependencies"
                    aria-label="Search dependencies"
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
                <section key={group.name} className="text-black dark:text-zinc-200">
                  <h4 className="sticky top-13 z-10 border-b bg-white py-2 text-[14px] font-semibold dark:bg-zinc-900">
                    {group.name}
                  </h4>
                  <ul className="m-0 list-none p-0">
                    {group.values.map((dependency) => (
                      <li
                        key={dependency.key}
                        className={`border-t py-2 first:border-t-0 ${
                          selectedDependencies.includes(dependency.key) &&
                          "bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <Checkbox
                          isSelected={selectedDependencies.includes(
                            dependency.key,
                          )}
                          onChange={() => onToggleDependency(dependency.key)}
                          className="w-full"
                        >
                          <Checkbox.Control className="hidden">
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <strong className="mb-[0.2rem] block text-[14px]">
                              {dependency.text}
                            </strong>
                            {dependency.description && (
                              <span className="text-[13px] opacity-70">
                                {dependency.description}
                              </span>
                            )}
                          </Checkbox.Content>
                        </Checkbox>
                      </li>
                    ))}
                  </ul>
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
