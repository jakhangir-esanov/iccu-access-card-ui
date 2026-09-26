import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { describeError } from '@core/feedback/error-message';
import { useMessage } from '@core/feedback/use-message';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { applyServerErrors } from '@shared/components/form/apply-server-errors';
import { FormAlert } from '@shared/components/form/form-alert';
import { PhotoField } from '@shared/components/photo/photo-field';
import { PersonDetailsFields } from '@shared/person-details/person-details-fields';
import { Button } from '@shared/ui/button';
import { useUploadReaderPhoto } from '../api/readers.queries';
import {
  READER_FORM_FIELDS,
  createReaderFormSchema,
  type ReaderFormInput,
  type ReaderFormValues,
} from '../models/reader-form.schema';

interface ReaderFormProps {
  readonly initialValues: ReaderFormInput;
  readonly currentPhoto?: ReactNode;
  readonly isPending: boolean;
  readonly onSubmit: (values: ReaderFormValues) => Promise<unknown>;
  readonly onCancel: () => void;
}

export function ReaderForm({
  initialValues,
  currentPhoto,
  isPending,
  onSubmit,
  onCancel,
}: ReaderFormProps) {
  const t = useT();
  const message = useMessage();
  const [failure, setFailure] = useState<unknown>(null);
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const [schema] = useState(() => createReaderFormSchema(today));
  const upload = useUploadReaderPhoto();
  const form = useForm<ReaderFormInput, unknown, ReaderFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const submit = form.handleSubmit(async (values) => {
    setFailure(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setFailure(error);
      applyServerErrors<ReaderFormInput>(error, {
        fields: READER_FORM_FIELDS,
        setError: form.setError,
        message,
      });
    }
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={(event) => void submit(event)} className="grid max-w-2xl gap-5">
        <Controller
          control={form.control}
          name="photoFileId"
          render={({ field, fieldState }) => (
            <PhotoField
              id="photo"
              upload={upload.mutateAsync}
              currentPhoto={currentPhoto}
              error={fieldState.error?.message}
              onChange={(fileId) => {
                field.onChange(fileId ?? initialValues.photoFileId);
              }}
            />
          )}
        />
        <PersonDetailsFields today={today} />
        <FormAlert message={failure === null ? null : message(describeError(failure))} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
