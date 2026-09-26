import type { ReactNode } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { FormAlert } from '@shared/components/form/form-alert';
import { Button } from '@shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';

interface UserDialogFrameProps {
  readonly title: string;
  readonly description?: string;
  readonly failure: string | null;
  readonly isPending: boolean;
  readonly onClose: () => void;
  readonly onSubmit: () => void;
  readonly children: ReactNode;
}

export function UserDialogFrame(props: UserDialogFrameProps) {
  const { title, description, failure, isPending, onClose, onSubmit, children } = props;
  const t = useT();
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description !== undefined && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          noValidate
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <FormAlert message={failure} />
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
