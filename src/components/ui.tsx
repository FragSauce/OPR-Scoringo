import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-emerald-600 hover:bg-emerald-500 text-white",
  secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700",
  danger: "bg-red-700 hover:bg-red-600 text-white",
};

export function Button({
  variant = "secondary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-lg px-4 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  const set = (n: number) => onChange(Math.max(min, Math.min(max, n)));
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => set(value - 1)}
          disabled={value <= min}
          className="h-11 w-11 shrink-0 rounded-lg bg-slate-700 text-2xl font-bold leading-none text-white disabled:opacity-30"
          aria-label="decrease"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center text-2xl font-bold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => set(value + 1)}
          disabled={value >= max}
          className="h-11 w-11 shrink-0 rounded-lg bg-slate-700 text-2xl font-bold leading-none text-white disabled:opacity-30"
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Card({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: "player1" | "player2";
}) {
  const ring =
    accent === "player1"
      ? "border-player1/60"
      : accent === "player2"
        ? "border-player2/60"
        : "border-slate-700";
  return (
    <div className={`rounded-xl border ${ring} bg-slate-800/60 p-4 ${className}`}>{children}</div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </button>
      <span className="text-sm">{label}</span>
    </label>
  );
}
