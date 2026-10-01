import backUrl from '../../assets/card-back.jpg';

export function IdCardBack() {
  return (
    <div className="id-card id-card--back id-card-sheet">
      <img src={backUrl} alt="" className="id-card__back-image" />
    </div>
  );
}
