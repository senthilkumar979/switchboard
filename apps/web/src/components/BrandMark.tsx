interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { icon: 'h-8 w-8 text-[0.65rem]', label: 'text-base' },
  md: { icon: 'h-11 w-11 text-[0.75rem]', label: 'text-xl' },
  lg: { icon: 'h-14 w-14 text-sm', label: 'text-3xl md:text-4xl' },
} as const;

export const BrandMark = ({ size = 'md' }: BrandMarkProps) => {
  const s = sizes[size];
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid place-items-center rounded-xl bg-accent font-bold tracking-tight text-accent-fg shadow-[0_12px_40px_-16px_rgba(15,118,110,0.7)] ${s.icon}`}
        aria-hidden
      >
        SB
      </span>
      <span className={`font-semibold tracking-tight text-fg ${s.label}`}>Switchboard</span>
    </span>
  );
};
