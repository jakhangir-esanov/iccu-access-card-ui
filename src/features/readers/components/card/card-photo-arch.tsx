import type { ReactNode } from 'react';

const ARCH_CLIP_ID = 'id-card-arch';
const ARCH_CLIP_PATH =
  'M0 1 V0.3185 C0 0.1481 0.2871 0.0519 0.5 0 C0.7129 0.0519 1 0.1481 1 0.3185 V1 Z';
const OUTER_ARCH = 'M1 296 V92 C1 42 62 14 111 1 C160 14 221 42 221 92 V296';
const FRAME_ARCH = 'M1.5 270 V86 C1.5 41 58 15 101 1.5 C144 15 200.5 41 200.5 86 V270';

export function CardPhotoArch({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="id-card__arch">
      <svg className="id-card__arch-defs" aria-hidden>
        <defs>
          <clipPath id={ARCH_CLIP_ID} clipPathUnits="objectBoundingBox">
            <path d={ARCH_CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>
      <svg className="id-card__arch-outer" viewBox="0 0 222 296" aria-hidden>
        <path d={OUTER_ARCH} />
      </svg>
      <div className="id-card__arch-photo">{children}</div>
      <svg className="id-card__arch-frame" viewBox="0 0 202 270" aria-hidden>
        <path d={FRAME_ARCH} />
      </svg>
    </div>
  );
}
