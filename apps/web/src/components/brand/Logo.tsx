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
    <img
      src="/logo-transparent.png?v=2026-08-30-approved"
      className={cn('shrink-0 object-contain', className)}
      alt="CamCore"
      draggable={false}
    />
  );
}
