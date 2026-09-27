import emblemUrl from '@shared/assets/iccu-emblem.png';
import { PortalArch } from '@shared/components/ornaments/portal-arch';
import { CARD_TEXT } from '../../models/card-face';

function CardContact({
  label,
  value,
  align,
}: Readonly<{ label: string; value: string; align: 'start' | 'end' }>) {
  return (
    <div className={`id-card__contact id-card__contact--${align}`}>
      <span className="id-card__label">{label}</span>
      <span className="id-card__contact-value">{value}</span>
    </div>
  );
}

export function IdCardBack() {
  return (
    <div className="id-card id-card--back id-card-sheet">
      <div className="id-card__strip id-card__strip--start" />
      <div className="id-card__strip id-card__strip--end" />
      <PortalArch className="id-card__back-arch" />
      <div className="id-card__back-content">
        <img src={emblemUrl} alt="" className="id-card__back-emblem" />
        <span className="id-card__label id-card__back-center">{CARD_TEXT.center}</span>
        <span className="id-card__back-title">{CARD_TEXT.library}</span>
      </div>
      <CardContact label={CARD_TEXT.websiteLabel} value={CARD_TEXT.website} align="start" />
      <CardContact label={CARD_TEXT.phoneLabel} value={CARD_TEXT.phone} align="end" />
    </div>
  );
}
