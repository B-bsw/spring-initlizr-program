import { Tabs } from "@heroui/react";

type ChoiceOption = {
  key: string;
  text: string;
};

export default function ChoiceTabs({
  options,
  selected,
  onChange,
  ariaLabel,
}: {
  options: ChoiceOption[];
  selected: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={(next) => onChange(String(next))}
      className="w-fit"
      aria-label={ariaLabel}
    >
      <Tabs.ListContainer>
        <Tabs.List className="gap-1 rounded-md">
          {options.map((item) => (
            <Tabs.Tab
              key={item.key}
              id={item.key}
              className={`cursor-pointer rounded-sm px-2 py-1 text-xs font-medium text-nowrap text-neutral-800 transition-colors dark:text-neutral-200 ${selected === item.key ? "bg-neutral-200 dark:bg-neutral-700" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            >
              {item.text}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
