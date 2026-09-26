import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { describeError, type MessageSource } from '@core/feedback/error-message';
import { hasErrorCode } from '@core/http/api-error';
import { applyServerErrors } from '@shared/components/form/apply-server-errors';

export const UserErrorCode = {
  UsernameTaken: 'User.UsernameTaken',
  CannotDemoteSelf: 'User.CannotDemoteSelf',
} as const;

interface UserFormTarget<T extends FieldValues> {
  readonly fields: readonly Path<T>[];
  readonly setError: UseFormSetError<T>;
  readonly message: (source: MessageSource) => string;
  readonly usernameField?: Path<T>;
}

export function unplacedErrorMessage<T extends FieldValues>(
  error: unknown,
  target: UserFormTarget<T>,
): string | null {
  const text = target.message(describeError(error));
  if (target.usernameField !== undefined && hasErrorCode(error, UserErrorCode.UsernameTaken)) {
    target.setError(target.usernameField, { type: 'server', message: text });
    return null;
  }
  return applyServerErrors<T>(error, target) ? null : text;
}
