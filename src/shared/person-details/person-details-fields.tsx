import { useFormContext, useWatch } from 'react-hook-form';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, DocumentType } from '@shared/models/document-type';
import { READER_CATEGORIES, READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { Input } from '@shared/ui/input';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';
import { BirthDateField } from './birth-date-field';
import type { PersonDetailsFormInput } from './person-details.schema';
import { PersonNameFields } from './person-name-fields';

const PHONE_PREFIX = '+998';

interface PersonDetailsFieldsProps {
  readonly today: string;
}

export function PersonDetailsFields({ today }: PersonDetailsFieldsProps) {
  const t = useT();
  const { register, formState } = useFormContext<PersonDetailsFormInput>();
  const { errors } = formState;
  const documentType = useWatch<PersonDetailsFormInput, 'documentType'>({ name: 'documentType' });
  const isPassport = documentType === String(DocumentType.Passport);

  return (
    <div className="@container">
      <div className="grid gap-4 @2xl:grid-cols-2 @2xl:gap-x-6 @2xl:gap-y-5">
        <FormField id="category" label="person.category" error={errors.category?.message}>
          <NativeSelect
            id="category"
            className="w-full"
            aria-invalid={errors.category !== undefined}
            {...register('category')}
          >
            <NativeSelectOption value="" disabled>
              {t('person.choose')}
            </NativeSelectOption>
            {READER_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {t(READER_CATEGORY_LABELS[category])}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <PersonNameFields />
        <BirthDateField today={today} />
        <FormField id="phone" label="person.phone" error={errors.phone?.message}>
          <div className="flex items-center gap-2">
            <span className="flex h-11 shrink-0 items-center rounded-xl border bg-muted px-3.5 text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
              {PHONE_PREFIX}
            </span>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={t('person.phonePlaceholder')}
              aria-invalid={errors.phone !== undefined}
              {...register('phone')}
            />
          </div>
        </FormField>
        <FormField
          id="documentType"
          label="person.documentType"
          error={errors.documentType?.message}
        >
          <NativeSelect id="documentType" className="w-full" {...register('documentType')}>
            {DOCUMENT_TYPES.map((type) => (
              <NativeSelectOption key={type} value={type}>
                {t(DOCUMENT_TYPE_LABELS[type])}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField
          id="documentNumber"
          label="person.documentNumber"
          error={errors.documentNumber?.message}
        >
          <Input
            id="documentNumber"
            autoCapitalize="characters"
            autoComplete="off"
            placeholder={t(
              isPassport ? 'person.passportPlaceholder' : 'person.birthCertificatePlaceholder',
            )}
            aria-invalid={errors.documentNumber !== undefined}
            {...register('documentNumber')}
          />
        </FormField>
      </div>
    </div>
  );
}
