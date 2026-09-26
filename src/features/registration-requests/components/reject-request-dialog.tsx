import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useT } from '@core/i18n/use-i18n';
import { FormField } from '@shared/components/form/form-field';
import { Button } from '@shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Textarea } from '@shared/ui/textarea';
import {
  EMPTY_REJECT_FORM,
  rejectFormSchema,
  type RejectFormValues,
} from '../models/reject-form.schema';

interface RejectRequestDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onReject: (reason: string) => Promise<void>;
  readonly isPending: boolean;
}

export function RejectRequestDialog({
  open,
  onOpenChange,
  onReject,
  isPending,
}: RejectRequestDialogProps) {
  const t = useT();
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: EMPTY_REJECT_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(EMPTY_REJECT_FORM);
    }
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    await onReject(values.reason);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('requests.reject.title')}</DialogTitle>
        </DialogHeader>
        <form noValidate onSubmit={(event) => void onSubmit(event)} className="grid gap-4">
          <FormField
            id="reject-reason"
            label="requests.reject.reason"
            error={form.formState.errors.reason?.message}
          >
            <Textarea
              id="reject-reason"
              rows={4}
              aria-invalid={form.formState.errors.reason !== undefined}
              {...form.register('reason')}
            />
          </FormField>
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
            <Button type="submit" variant="destructive" disabled={isPending}>
              {t('requests.reject.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
