import { BRAND } from '@/lib/brand';

interface BrandMarkProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

export function BrandMark({
  className = 'flex items-center gap-3',
  textClassName = 'text-xl font-bold font-headline',
  iconClassName = 'h-11 w-11',
}: BrandMarkProps) {
  return (
    <span className={className}>
      <img src={BRAND.logoPath} alt={BRAND.name} className={iconClassName} />
      <span className={textClassName}>{BRAND.name}</span>
    </span>
  );
}
