import { AppPath } from '@core/config/app-paths';

export interface ReturnState {
  readonly from: string;
}

export function toReturnState(pathname: string, search: string): ReturnState {
  return { from: `${pathname}${search}` };
}

export function readReturnPath(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('from' in state)) {
    return AppPath.admin;
  }
  const { from } = state;
  const isAdminPath = typeof from === 'string' && from.startsWith(AppPath.admin);
  return isAdminPath && !from.startsWith(AppPath.login) ? from : AppPath.admin;
}
