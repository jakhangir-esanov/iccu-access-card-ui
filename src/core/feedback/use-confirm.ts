import { use } from 'react';
import { ConfirmContext, type Confirm } from './confirm-context';

export function useConfirm(): Confirm {
  const confirm = use(ConfirmContext);
  if (confirm === null) {
    throw new Error('ConfirmProvider is missing above this component');
  }
  return confirm;
}
