import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 'h-7 w-7', text: 'text-base', subtitle: 'text-[9px]' },
  md: { icon: 'h-9 w-9', text: 'text-lg', subtitle: 'text-[10px]' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl', subtitle: 'text-xs' },
  xl: { icon: 'h-16 w-16', text: 'text-3xl', subtitle: 'text-sm' },
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { icon, text, subtitle } = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoIcon className={icon} />
      {showText && (
        <div className="flex min-w-0 flex-col leading-none">
          <span className={cn('font-bold tracking-tight', text)}>CamCore</span>
          <span
            className={cn(
              'mt-1 font-semibold uppercase tracking-[0.18em] text-muted-foreground',
              subtitle
            )}
          >
            Tracearr
          </span>
        </div>
      )}
    </div>
  );
}

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="CamCore"
    >
      <path
        d="M256 48 A208 208 0 1 0 256 464 A208 208 0 0 0 390 415 L338 351 A126 126 0 1 1 338 161 L390 97 A208 208 0 0 0 256 48 Z"
        fill="#FFFFFF"
      />
      <path
        d="M280 149 A132 132 0 1 1 280 413 L330 352 A55 55 0 1 0 330 210 Z"
        fill="#FF4B2B"
      />
      <path
        d="M256 198 A58 58 0 1 0 256 314 A58 58 0 0 0 256 198 Z"
        fill="#FF4B2B"
      />
    </svg>
  );
}
