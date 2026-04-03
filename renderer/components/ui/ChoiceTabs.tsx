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
              className={`cursor-pointer rounded-sm px-2.5 py-1.5 text-[14px] font-medium text-nowrap text-black transition-colors dark:text-white ${selected === item.key ? "bg-zinc-300 dark:bg-zinc-700" : "hover:bg-zinc-300/80"}`}
            >
              {item.text}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
