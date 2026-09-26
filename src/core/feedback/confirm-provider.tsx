import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useT } from '@core/i18n/use-i18n';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/ui/alert-dialog';
import { ConfirmContext, type ConfirmOptions } from './confirm-context';

export function ConfirmProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    resolveRef.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const settle = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext value={confirm}>
      {children}
      <ConfirmDialog options={options} onSettle={settle} />
    </ConfirmContext>
  );
}

interface ConfirmDialogProps {
  readonly options: ConfirmOptions | null;
  readonly onSettle: (confirmed: boolean) => void;
}

function ConfirmDialog({ options, onSettle }: ConfirmDialogProps) {
  const t = useT();
  return (
    <AlertDialog
      open={options !== null}
      onOpenChange={(open) => {
        if (!open) {
          onSettle(false);
        }
      }}
    >
      {options !== null && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(options.title ?? 'confirm.title', options.params)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(options.description, options.params)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant={options.destructive === true ? 'destructive' : 'default'}
              onClick={() => {
                onSettle(true);
              }}
            >
              {t(options.confirmLabel ?? 'common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
