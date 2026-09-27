import emblemUrl from '@shared/assets/iccu-emblem.png';

export function IdCardBack() {
  return (
    <div className="id-card id-card--back id-card-sheet">
      <img src={emblemUrl} alt="" className="id-card__back-emblem" />
    </div>
  );
}
