import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { describeFieldError, type MessageSource } from '@core/feedback/error-message';
import { isApiError } from '@core/http/api-error';

export interface ServerErrorTarget<T extends FieldValues> {
  readonly fields: readonly Path<T>[];
  readonly setError: UseFormSetError<T>;
  readonly message: (source: MessageSource) => string;
}

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  target: ServerErrorTarget<T>,
): boolean {
  if (!isApiError(error)) {
    return false;
  }
  let applied = false;
  for (const fieldError of error.fieldErrors) {
    const field = target.fields.find((name) => name === fieldError.field);
    if (field !== undefined) {
      target.setError(field, {
        type: 'server',
        message: target.message(describeFieldError(fieldError)),
      });
      applied = true;
    }
  }
  return applied;
}
