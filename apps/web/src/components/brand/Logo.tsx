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
      viewBox="0 0 210 210"
      fill="none"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="CamCore"
    >
      <defs>
        <linearGradient id="camcore-cyan" x1="30" y1="25" x2="190" y2="190">
          <stop stopColor="#18D7F2" />
          <stop offset="1" stopColor="#0096C7" />
        </linearGradient>
        <linearGradient id="camcore-white" x1="20" y1="15" x2="175" y2="170">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCEBFF" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="208" height="208" rx="42" fill="#06111F" />
      <path
        d="M105 12 190 44v48c0 21-3 40-12 58"
        stroke="url(#camcore-white)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 150c-9-18-12-37-12-58V44l85-32"
        stroke="url(#camcore-white)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 118V82l53-41 53 41v36M145 72V50h18v36"
        stroke="url(#camcore-white)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="91" y="82" width="12" height="12" rx="1.5" fill="#FFFFFF" />
      <rect x="108" y="82" width="12" height="12" rx="1.5" fill="#FFFFFF" />
      <rect x="91" y="99" width="12" height="12" rx="1.5" fill="#FFFFFF" />
      <rect x="108" y="99" width="12" height="12" rx="1.5" fill="#FFFFFF" />
      <path
        d="M40 143h130M105 143v45"
        stroke="url(#camcore-cyan)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="40" cy="143" r="16" fill="#06111F" stroke="url(#camcore-cyan)" strokeWidth="9" />
      <circle cx="170" cy="143" r="16" fill="#06111F" stroke="url(#camcore-cyan)" strokeWidth="9" />
      <circle cx="105" cy="143" r="18" fill="url(#camcore-cyan)" />
      <circle cx="105" cy="188" r="16" fill="#06111F" stroke="url(#camcore-cyan)" strokeWidth="9" />
      <path
        d="M57 169c14 12 29 20 48 27 19-7 34-15 48-27"
        stroke="url(#camcore-white)"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
