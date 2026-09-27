import { cn } from 'cn';

const OUTER_ARCH = 'M20 600 V244 C20 136 128 66 220 0 C312 66 420 136 420 244 V600';
const MAIN_ARCH = 'M40 600 V250 C40 150 140 84 220 20 C300 84 400 150 400 250 V600';
const INNER_ARCH = 'M64 600 V258 C64 166 150 108 220 52 C290 108 376 166 376 258 V600';
const NICHES = [
  'M64 300 C64 280 86 268 98 268 C110 268 132 280 132 300',
  'M132 300 C132 280 154 268 166 268 C178 268 200 280 200 300',
  'M240 300 C240 280 262 268 274 268 C286 268 308 280 308 300',
  'M308 300 C308 280 330 268 342 268 C354 268 376 280 376 300',
] as const;
const APEX = 'M220 -2 L228 10 L220 22 L212 10 Z';

export function PortalArch({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 -4 440 604"
      aria-hidden
      className={cn('text-gold', className)}
      preserveAspectRatio="xMidYMax meet"
    >
      <path d={`${MAIN_ARCH} Z`} fill="currentColor" fillOpacity={0.07} />
      <g fill="none" stroke="currentColor">
        <path d={OUTER_ARCH} strokeOpacity={0.5} strokeWidth={1.5} />
        <path d={MAIN_ARCH} strokeOpacity={0.9} strokeWidth={2} />
        <path d={INNER_ARCH} strokeOpacity={0.35} />
        {NICHES.map((niche) => (
          <path key={niche} d={niche} strokeOpacity={0.45} />
        ))}
      </g>
      <path d={APEX} fill="currentColor" />
    </svg>
  );
}
