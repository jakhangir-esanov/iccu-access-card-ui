import type { ReaderCategory } from '@shared/models/reader-category';

export interface DashboardTotals {
  readonly total: number;
  readonly active: number;
  readonly expired: number;
  readonly expiringSoon: number;
  readonly registeredToday: number;
  readonly registeredThisMonth: number;
}

export interface CategoryCount {
  readonly category: ReaderCategory;
  readonly count: number;
}

export interface DayCount {
  readonly day: string;
  readonly count: number;
}

export interface Dashboard {
  readonly totals: DashboardTotals;
  readonly pendingRequests: number;
  readonly byCategory: readonly CategoryCount[];
  readonly lastDays: readonly DayCount[];
}
