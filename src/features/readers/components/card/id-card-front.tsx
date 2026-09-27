import emblemUrl from '@shared/assets/iccu-emblem.png';
import { AuthorizedImage } from '@shared/components/authorized-image';
import { cn } from 'cn';
import { CARD_TEXT, type CardFace } from '../../models/card-face';
import { CardBarcode } from './card-barcode';
import { CardPhotoArch } from './card-photo-arch';

interface IdCardFrontProps {
  readonly face: CardFace;
  readonly onPhotoLoad: () => void;
}

function CardDate({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="id-card__date">
      <span className="id-card__label">{label}</span>
      <span className="id-card__date-value">{value}</span>
    </div>
  );
}

export function IdCardFront({ face, onPhotoLoad }: IdCardFrontProps) {
  return (
    <div className="id-card id-card-sheet">
      <img src={emblemUrl} alt="" className="id-card__logo" />
      <div className="id-card__heading">
        <span className="id-card__label id-card__center">{CARD_TEXT.center}</span>
        <span className="id-card__title">{CARD_TEXT.title}</span>
      </div>
      <div className="id-card__number">
        <span className="id-card__label">{CARD_TEXT.cardNumber}</span>
        <span className="id-card__number-value">{face.cardNumber}</span>
      </div>
      <div className="id-card__strip id-card__strip--header" />
      <CardPhotoArch>
        <AuthorizedImage
          fileId={face.photoFileId}
          alt={face.fullName}
          className="id-card__photo"
          onLoad={onPhotoLoad}
        />
      </CardPhotoArch>
      <div className="id-card__holder">
        <p className={cn('id-card__name', face.isLongName && 'id-card__name--long')}>
          {face.fullName}
        </p>
        <p className="id-card__category">{face.category}</p>
      </div>
      <div className="id-card__dates">
        <CardDate label={CARD_TEXT.issuedOn} value={face.issuedOn} />
        <CardDate label={CARD_TEXT.expiresOn} value={face.expiresOn} />
      </div>
      <div className="id-card__barcode-panel">
        <CardBarcode value={face.cardNumber} className="id-card__barcode" />
      </div>
    </div>
  );
}
