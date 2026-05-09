type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

export function TextInput({ label, name, defaultValue, type = "text", required, placeholder }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink/80">
      {label}
      <input
        className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm"
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
    </label>
  );
}

export function TextArea({ label, name, defaultValue, required, placeholder }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink/80">
      {label}
      <textarea
        className="focus-ring min-h-28 rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm"
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
    </label>
  );
}

export function SelectInput({
  label,
  name,
  defaultValue,
  options
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink/80">
      {label}
      <select
        className="focus-ring rounded-md border border-ink/15 bg-white px-3 py-2.5 text-ink shadow-sm"
        name={name}
        defaultValue={defaultValue ?? options[0]?.value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
