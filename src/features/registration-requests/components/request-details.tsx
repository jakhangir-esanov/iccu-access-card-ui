import { formatDateOnly, formatDateTime } from '@core/i18n/date-format';
import { i18nKey } from '@core/i18n/translation-key';
import { useT } from '@core/i18n/use-i18n';
import { DetailList, type DetailRow } from '@shared/components/detail-list';
import { OptionalLabel } from '@shared/components/optional-label';
import { CITIZENSHIP_LABELS } from '@shared/models/citizenship';
import { GENDER_LABELS } from '@shared/models/gender';
import { READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { formatPhone } from '@shared/person-details/person-format';
import type { RegistrationRequest } from '../models/registration-request';

export function RequestDetails({ request }: { readonly request: RegistrationRequest }) {
  const t = useT();
  const person: readonly DetailRow[] = [
    { label: 'person.category', value: t(READER_CATEGORY_LABELS[request.category]) },
    { label: 'person.lastName', value: request.lastName },
    { label: 'person.firstName', value: request.firstName },
    { label: 'person.middleName', value: request.middleName ?? '—' },
    {
      label: 'person.gender',
      value: <OptionalLabel value={request.gender} labels={GENDER_LABELS} />,
    },
    { label: 'person.birthDate', value: formatDateOnly(request.birthDate) },
    {
      label: 'person.citizenship',
      value: <OptionalLabel value={request.citizenship} labels={CITIZENSHIP_LABELS} />,
    },
    { label: 'person.phone', value: formatPhone(request.phone) },
  ];
  const review: readonly DetailRow[] = [
    { label: 'requests.detail.submittedAt', value: formatDateTime(request.submittedAt) },
    { label: 'requests.detail.expiresAt', value: formatDateTime(request.expiresAt) },
    ...(request.reviewedAt === null
      ? []
      : [
          {
            label: i18nKey('requests.detail.reviewedAt'),
            value: formatDateTime(request.reviewedAt),
          },
          { label: i18nKey('requests.detail.reviewedBy'), value: request.reviewedByName ?? '—' },
        ]),
    ...(request.rejectionReason === null
      ? []
      : [{ label: i18nKey('requests.detail.rejectionReason'), value: request.rejectionReason }]),
  ];
  return (
    <div className="grid gap-6">
      <DetailList rows={person} />
      <div className="border-t pt-6">
        <DetailList rows={review} />
      </div>
    </div>
  );
}
