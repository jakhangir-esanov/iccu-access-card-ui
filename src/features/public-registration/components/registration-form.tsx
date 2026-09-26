import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import {
  useSubmitRegistrationMutation,
  useUploadPublicPhotoMutation,
} from '../api/public-registration.queries';
import {
  EMPTY_REGISTRATION_FORM,
  REGISTRATION_FORM_FIELDS,
  createRegistrationFormSchema,
  type RegistrationFormInput,
  type RegistrationFormValues,
} from '../models/registration-form.schema';
import type { RegistrationReceipt } from '../models/registration-receipt';
import { ConsentField } from './consent-field';

interface RegistrationFormProps {
  readonly onSubmitted: (receipt: RegistrationReceipt) => void;
}

export function RegistrationForm({ onSubmitted }: RegistrationFormProps) {
  const t = useT();
  const message = useMessage();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const [schema] = useState(() => createRegistrationFormSchema(today));
  const form = useForm<RegistrationFormInput, unknown, RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_REGISTRATION_FORM,
  });
  const upload = useUploadPublicPhotoMutation();
  const submit = useSubmitRegistrationMutation();

  const onSubmit = form.handleSubmit((values) => {
    submit.mutate(values, {
      onSuccess: (receipt) => {
        onSubmitted(receipt);
      },
      onError: (error) =>
        applyServerErrors<RegistrationFormInput>(error, {
          fields: REGISTRATION_FORM_FIELDS,
          setError: form.setError,
          message,
        }),
    });
  });

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={(event) => void onSubmit(event)} className="grid gap-5">
        <Controller
          control={form.control}
          name="photoFileId"
          render={({ field, fieldState }) => (
            <PhotoField
              id="photo"
              upload={upload.mutateAsync}
              error={fieldState.error?.message}
              onChange={(fileId) => {
                field.onChange(fileId ?? '');
              }}
            />
          )}
        />
        <PersonDetailsFields today={today} />
        <ConsentField />
        <FormAlert message={submit.error === null ? null : message(describeError(submit.error))} />
        <Button type="submit" size="lg" className="h-11 w-full" disabled={submit.isPending}>
          {t('publicRegistration.submit')}
        </Button>
      </form>
    </FormProvider>
  );
}
