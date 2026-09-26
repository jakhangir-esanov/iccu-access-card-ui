import { formatDateOnly, formatDateTime } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { DetailList, type DetailRow } from '@shared/components/detail-list';
import { DOCUMENT_TYPE_LABELS } from '@shared/models/document-type';
import { READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { REGISTRATION_SOURCE_LABELS } from '@shared/models/registration-source';
import { formatPhone } from '@shared/person-details/person-format';
import type { Reader } from '../models/reader';

const EMPTY_VALUE = '—';

export function ReaderDetails({ reader }: { readonly reader: Reader }) {
  const t = useT();
  const person: readonly DetailRow[] = [
    { label: 'person.category', value: t(READER_CATEGORY_LABELS[reader.category]) },
    { label: 'person.lastName', value: reader.lastName },
    { label: 'person.firstName', value: reader.firstName },
    { label: 'person.middleName', value: reader.middleName ?? EMPTY_VALUE },
    { label: 'person.birthDate', value: formatDateOnly(reader.birthDate) },
    { label: 'person.phone', value: formatPhone(reader.phone) },
    { label: 'person.documentType', value: t(DOCUMENT_TYPE_LABELS[reader.documentType]) },
    {
      label: 'person.documentNumber',
      value: <span className="font-mono">{reader.documentNumber}</span>,
    },
  ];
  const record: readonly DetailRow[] = [
    { label: 'readers.detail.source', value: t(REGISTRATION_SOURCE_LABELS[reader.source]) },
    { label: 'readers.detail.createdAt', value: formatDateTime(reader.createdAt) },
    { label: 'readers.detail.createdBy', value: reader.createdByName ?? EMPTY_VALUE },
    {
      label: 'readers.detail.updatedAt',
      value: reader.updatedAt === null ? EMPTY_VALUE : formatDateTime(reader.updatedAt),
    },
  ];
  return (
    <div className="grid gap-6">
      <DetailList rows={person} />
      <div className="border-t pt-4">
        <DetailList rows={record} />
      </div>
    </div>
  );
}
