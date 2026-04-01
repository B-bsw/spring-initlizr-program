import { buttonBase } from "../../utils/constants";

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
  const outline = dark
    ? "border-white text-white hover:bg-zinc-800"
    : "border-black text-black hover:bg-zinc-200";
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
              active
                ? "border-lime-600/80 bg-lime-600/80 hover:bg-lime-600 hover:border-lime-600 text-white hover:"
                : outline
            } cursor-pointer `}
          >
            {item.text}
          </button>
        );
      })}
    </div>
  );
}
