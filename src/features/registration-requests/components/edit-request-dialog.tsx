import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMessage } from '@core/feedback/use-message';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { applyServerErrors } from '@shared/components/form/apply-server-errors';
import { PersonDetailsFields } from '@shared/person-details/person-details-fields';
import {
  PERSON_DETAILS_FIELDS,
  createPersonDetailsSchema,
  type PersonDetails,
  type PersonDetailsFormInput,
} from '@shared/person-details/person-details.schema';
import { Button } from '@shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { toPersonDetailsFormInput } from '../api/registration-requests.mapper';
import type { RegistrationRequest } from '../models/registration-request';

interface EditRequestDialogProps {
  readonly request: RegistrationRequest;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (details: PersonDetails) => Promise<void>;
  readonly isPending: boolean;
}

export function EditRequestDialog({
  request,
  open,
  onOpenChange,
  onSave,
  isPending,
}: EditRequestDialogProps) {
  const t = useT();
  const message = useMessage();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const [schema] = useState(() => createPersonDetailsSchema(today));
  const form = useForm<PersonDetailsFormInput, unknown, PersonDetails>({
    resolver: zodResolver(schema),
    defaultValues: toPersonDetailsFormInput(request),
  });

  useEffect(() => {
    if (open) {
      form.reset(toPersonDetailsFormInput(request));
    }
  }, [open, request, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      applyServerErrors<PersonDetailsFormInput>(error, {
        fields: PERSON_DETAILS_FIELDS,
        setError: form.setError,
        message,
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('requests.edit.title')}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form noValidate onSubmit={(event) => void onSubmit(event)} className="grid gap-4">
            <PersonDetailsFields today={today} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
