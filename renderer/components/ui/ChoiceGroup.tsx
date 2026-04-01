import { buttonBase } from "../constants";

type ChoiceOption = {
  key: string;
  text: string;
};

export default function ChoiceGroup({
  options,
  selected,
  onChange,
  dark,
}: {
  options: ChoiceOption[];
  selected: string;
  onChange: (next: string) => void;
  dark: boolean;
}) {
  const outline = dark ? "border-white text-white" : "border-[#111111] text-[#111111]";
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((item) => {
        const active = selected === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`${buttonBase} ${
              active ? "border-[#6db33f] bg-[#6db33f] text-white" : outline
            }`}
          >
            {item.text}
          </button>
        );
      })}
    </div>
  );
}
