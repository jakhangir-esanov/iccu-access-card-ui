import emblemUrl from '@shared/assets/iccu-emblem.png';
import { AuthorizedImage } from '@shared/components/authorized-image';
import { cn } from 'cn';
import { CARD_TEXT, type CardFace } from '../../models/card-face';
import { CardBarcode } from './card-barcode';

interface IdCardFrontProps {
  readonly face: CardFace;
  readonly onPhotoLoad: () => void;
}

export function IdCardFront({ face, onPhotoLoad }: IdCardFrontProps) {
  return (
    <div className="id-card id-card-sheet">
      <header className="id-card__band id-card__header">
        <img src={emblemUrl} alt="" className="id-card__logo" />
        <p className="id-card__title">
          {CARD_TEXT.titleLines.map((line) => (
            <span key={line} className="id-card__title-line">
              {line}
            </span>
          ))}
        </p>
      </header>
      <div className="id-card__details">
        <p className={cn('id-card__name', face.isLongName && 'id-card__name--long')}>
          {face.fullName}
        </p>
        <p className="id-card__category">{face.category}</p>
        <CardBarcode value={face.cardNumber} className="id-card__barcode" />
        <div className="id-card__dates">
          <p>
            {CARD_TEXT.issuedOn}: {face.issuedOn}
          </p>
          <p>
            {CARD_TEXT.expiresOn}: {face.expiresOn}
          </p>
        </div>
      </div>
      <AuthorizedImage
        fileId={face.photoFileId}
        alt={face.fullName}
        className="id-card__photo"
        onLoad={onPhotoLoad}
      />
      <p className="id-card__number">{face.cardNumber}</p>
      <footer className="id-card__band id-card__footer">
        <span>{CARD_TEXT.website}</span>
        <span>{CARD_TEXT.phone}</span>
      </footer>
    </div>
  );
}
