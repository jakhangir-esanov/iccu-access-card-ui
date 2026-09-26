import { CircleAlertIcon } from 'lucide-react';

interface FormAlertProps {
  readonly message: string | null;
}

export function FormAlert({ message }: FormAlertProps) {
  if (message === null) {
    return null;
  }
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
