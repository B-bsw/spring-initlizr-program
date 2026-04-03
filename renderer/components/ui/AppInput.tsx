import { Input, TextField } from "@heroui/react";
import type { FocusEventHandler } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

export default function AppInput({
  value,
  onChange,
  ariaLabel,
  className,
  placeholder,
  readOnly,
  onBlur,
}: Props) {
  return (
    <TextField className="w-full" aria-label={ariaLabel}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        placeholder={placeholder}
        readOnly={readOnly}
        onBlur={onBlur}
        aria-label={ariaLabel}
        variant="secondary"
      />
    </TextField>
  );
}
